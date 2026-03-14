import {mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync, copyFileSync, existsSync} from 'node:fs';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import {spawn, spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const defaultRepo = path.resolve(siteRoot, '..', 'Listenarr');
const providedRepo = getArgValue('--repo');
const repoRoot = path.resolve(providedRepo || process.env.LISTENARR_REPO || defaultRepo);

async function main() {
  assertPathExists(repoRoot, 'Listenarr repository');

  console.log(`Syncing Listenarr API bundle from ${repoRoot}`);

  const sourceRef = process.env.LISTENARR_REF || readGitValue(['rev-parse', '--abbrev-ref', 'HEAD']) || 'canary';
  const version = readListenarrVersion(sourceRef);
  const commit = readGitValue(['rev-parse', '--short', 'HEAD']);

  const publishRoot = mkdtempSync(path.join(os.tmpdir(), 'listenarr-docs-'));
  const publishDir = path.join(publishRoot, 'publish');

  try {
    runCommand(
      'dotnet',
      [
        'publish',
        path.join(repoRoot, 'listenarr.api', 'Listenarr.Api.csproj'),
        '-c',
        'Release',
        '-o',
        publishDir,
        '/p:SkipFrontendBuild=true',
      ],
      {
        cwd: repoRoot,
        stdio: 'inherit',
      },
    );

    const port = await getFreePort();
    const appProcess = spawn('dotnet', [path.join(publishDir, 'Listenarr.Api.dll'), '--urls', `http://127.0.0.1:${port}`], {
      cwd: publishDir,
      env: {
        ...process.env,
        ASPNETCORE_ENVIRONMENT: 'Development',
        DOTNET_ENVIRONMENT: 'Development',
      },
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    const logLines = [];
    const captureLogs = (chunk) => {
      const text = chunk.toString();
      process.stdout.write(text);
      logLines.push(...text.split(/\r?\n/).filter(Boolean));
      if (logLines.length > 60) {
        logLines.splice(0, logLines.length - 60);
      }
    };

    appProcess.stdout.on('data', captureLogs);
    appProcess.stderr.on('data', captureLogs);

    try {
      await waitForUrl(`http://127.0.0.1:${port}/swagger/v1/swagger.json`, 120000);
      await bundleSwaggerUi(port);
    } catch (error) {
      throw new Error(`${error.message}\nRecent Listenarr logs:\n${logLines.join('\n')}`);
    } finally {
      stopProcess(appProcess);
      await delay(1500);
    }
  } finally {
    try {
      rmSync(publishRoot, {recursive: true, force: true});
    } catch (error) {
      console.warn(`Skipping temp cleanup for ${publishRoot}: ${error.message}`);
    }
  }

  writeMetadata({version, commit, sourceRef});
  writeSocialCardPlaceholder();
  console.log('Listenarr sync complete.');
}

function getArgValue(flag) {
  const index = process.argv.indexOf(flag);
  if (index === -1) {
    return null;
  }
  return process.argv[index + 1] || null;
}

function assertPathExists(targetPath, label) {
  if (!existsSync(targetPath)) {
    throw new Error(`${label} not found at ${targetPath}`);
  }
}

function readListenarrVersion(sourceRef) {
  const csprojPath = path.join(repoRoot, 'listenarr.api', 'Listenarr.Api.csproj');

  const evaluatedVersion = readMsbuildProperty(csprojPath, 'Version');
  if (evaluatedVersion) {
    return evaluatedVersion;
  }

  const versionFromFile = readVersionFromProjectFile(csprojPath);
  if (versionFromFile) {
    return versionFromFile;
  }

  const describedVersion = readGitValue(['describe', '--tags', '--always']);
  if (describedVersion) {
    console.warn(`Unable to resolve Listenarr version from MSBuild metadata; using git describe value "${describedVersion}".`);
    return describedVersion;
  }

  const refVersion = normalizeRefName(sourceRef);
  if (refVersion) {
    console.warn(`Unable to resolve Listenarr version from MSBuild metadata; using source ref "${refVersion}".`);
    return refVersion;
  }

  console.warn(`Unable to resolve Listenarr version from ${csprojPath}; using "unknown".`);
  return 'unknown';
}

function readMsbuildProperty(csprojPath, propertyName) {
  const result = spawnSync('dotnet', ['msbuild', csprojPath, '-nologo', `-getProperty:${propertyName}`], {
    cwd: repoRoot,
    encoding: 'utf8',
  });

  if (result.status !== 0) {
    return '';
  }

  return result.stdout.trim();
}

function readVersionFromProjectFile(csprojPath) {
  const content = readFileSync(csprojPath, 'utf8');
  const directVersion = content.match(/<Version>([^<]+)<\/Version>/);
  if (directVersion) {
    return directVersion[1].trim();
  }

  const versionPrefix = content.match(/<VersionPrefix>([^<]+)<\/VersionPrefix>/)?.[1]?.trim() || '';
  const versionSuffix = content.match(/<VersionSuffix>([^<]+)<\/VersionSuffix>/)?.[1]?.trim() || '';

  if (!versionPrefix) {
    return '';
  }

  return versionSuffix ? `${versionPrefix}-${versionSuffix}` : versionPrefix;
}

function normalizeRefName(refValue) {
  if (!refValue) {
    return '';
  }

  return refValue.replace(/^refs\/tags\//, '').replace(/^refs\/heads\//, '').trim();
}

function readGitValue(args) {
  const result = spawnSync('git', ['-C', repoRoot, ...args], {
    encoding: 'utf8',
  });
  if (result.status !== 0) {
    return '';
  }
  return result.stdout.trim();
}

function runCommand(command, args, options = {}) {
  const result = spawnSync(command, args, {
    encoding: 'utf8',
    ...options,
  });
  if (result.status !== 0) {
    const details = [result.stderr, result.stdout, result.error?.message].filter(Boolean).join('\n') || `Exit code ${result.status}`;
    throw new Error(`Command failed: ${command} ${args.join(' ')}\n${details}`);
  }
}

function getFreePort() {
  return new Promise((resolve, reject) => {
    const server = http.createServer();
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      if (!address || typeof address === 'string') {
        reject(new Error('Failed to allocate a free port'));
        return;
      }
      const {port} = address;
      server.close(() => resolve(port));
    });
    server.on('error', reject);
  });
}

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function waitForUrl(url, timeoutMs) {
  const start = Date.now();

  return new Promise((resolve, reject) => {
    const attempt = () => {
      http
        .get(url, (response) => {
          if (response.statusCode === 200) {
            response.resume();
            resolve();
            return;
          }

          response.resume();
          retry(`Unexpected status ${response.statusCode}`);
        })
        .on('error', (error) => retry(error.message));
    };

    const retry = (reason) => {
      if (Date.now() - start >= timeoutMs) {
        reject(new Error(`Timed out waiting for ${url}: ${reason}`));
        return;
      }
      setTimeout(attempt, 1000);
    };

    attempt();
  });
}

async function bundleSwaggerUi(port) {
  const legacyApiDir = path.join(siteRoot, 'static', 'api');
  const apiDir = path.join(siteRoot, 'static', 'api-ui');
  if (existsSync(legacyApiDir)) {
    try {
      rmSync(legacyApiDir, {recursive: true, force: true});
    } catch (error) {
      console.warn(`Skipping legacy API bundle cleanup for ${legacyApiDir}: ${error.message}`);
    }
  }
  mkdirSync(apiDir, {recursive: true});

  const filesToFetch = [
    ['openapi.json', `http://127.0.0.1:${port}/swagger/v1/swagger.json`],
    ['swagger-ui.css', `http://127.0.0.1:${port}/swagger/swagger-ui.css`],
    ['swagger-ui-bundle.js', `http://127.0.0.1:${port}/swagger/swagger-ui-bundle.js`],
    ['swagger-ui-standalone-preset.js', `http://127.0.0.1:${port}/swagger/swagger-ui-standalone-preset.js`],
  ];

  for (const [filename, url] of filesToFetch) {
    const body = await fetchBuffer(url);
    writeFileSync(path.join(apiDir, filename), body);
  }

  writeFileSync(
    path.join(apiDir, 'swagger-initializer.js'),
    `window.onload = async function () {
  const response = await fetch('./openapi.json');
  const spec = await response.json();

  window.ui = SwaggerUIBundle({
    spec: {
      ...spec,
      info: {
        ...(spec.info || {}),
        description: ''
      }
    },
    dom_id: '#swagger-ui',
    deepLinking: true,
    presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
    layout: 'StandaloneLayout'
  });
};
`,
  );

  writeFileSync(
    path.join(apiDir, 'index.html'),
    `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Listenarr API UI</title>
    <link rel="icon" href="../img/listenarr/logo-icon.png">
    <link rel="stylesheet" href="./swagger-ui.css">
    <style>
      html { box-sizing: border-box; overflow-y: scroll; }
      *, *::before, *::after { box-sizing: inherit; }
      body {
        margin: 0;
        background:
          radial-gradient(circle at top left, rgba(33, 150, 243, 0.18), transparent 24%),
          linear-gradient(180deg, #0f0f0f, #1a1a1a);
      }
      .topbar-wrapper img { content: url("../img/listenarr/logo-full.png"); width: 180px; height: auto; }
      .swagger-ui,
      .swagger-ui .wrapper {
        color: #ffffff;
        background: #161b22;
        font-family: Figtree, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }
      .swagger-ui .topbar {
        background: #1a1a1a;
        border-bottom: 1px solid rgba(33, 150, 243, 0.25);
      }
      .swagger-ui .dialog-ux .backdrop-ux {
        background: rgba(0, 0, 0, 0.82);
      }
      .swagger-ui .dialog-ux .modal-ux {
        background: #1b222c;
        border: 1px solid rgba(255, 255, 255, 0.08);
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.45);
        color: #ffffff;
      }
      .swagger-ui .dialog-ux .modal-ux-header {
        background: #11161d;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      }
      .swagger-ui .dialog-ux .modal-ux-content {
        background: #1b222c;
      }
      .swagger-ui .dialog-ux .modal-ux-header h3,
      .swagger-ui .dialog-ux .modal-ux-content h4,
      .swagger-ui .dialog-ux .modal-ux-content p,
      .swagger-ui .dialog-ux .modal-ux-content label,
      .swagger-ui .dialog-ux .modal-ux-content small,
      .swagger-ui .scopes h2,
      .swagger-ui .auth-container h4 {
        color: #ffffff;
      }
      .swagger-ui .scopes h2 a,
      .swagger-ui .auth-container .wrapper p,
      .swagger-ui .auth-container .wrapper label {
        color: #90caf9;
      }
      .swagger-ui .dialog-ux .modal-ux-header .close-modal,
      .swagger-ui .dialog-ux .modal-ux-header .close-modal svg {
        color: #ffffff;
        fill: currentColor;
      }
      .swagger-ui .auth-container {
        background: #161b22;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      }
      .swagger-ui .auth-container:last-of-type {
        border-bottom: 0;
      }
      .swagger-ui .auth-container .errors {
        background: rgba(249, 62, 62, 0.14);
        border: 1px solid rgba(249, 62, 62, 0.35);
        color: #ffd4d4;
      }
      .swagger-ui .scheme-container {
        background: #11161d;
        box-shadow: none;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      }
      .swagger-ui .info,
      .swagger-ui .opblock,
      .swagger-ui .responses-inner,
      .swagger-ui section.models,
      .swagger-ui .model-box,
      .swagger-ui .response-col_description,
      .swagger-ui .parameters-col_description,
      .swagger-ui .opblock-description-wrapper,
      .swagger-ui .opblock-title_normal,
      .swagger-ui .parameter__name,
      .swagger-ui .response-col_status,
      .swagger-ui .model-title,
      .swagger-ui .prop-name,
      .swagger-ui .parameter__type,
      .swagger-ui .parameter__in,
      .swagger-ui table thead tr th,
      .swagger-ui table thead tr td,
      .swagger-ui table tbody tr td,
      .swagger-ui .response-col_links,
      .swagger-ui .opblock-summary-method {
        color: #ffffff;
      }
      .swagger-ui .info p,
      .swagger-ui .info li,
      .swagger-ui .markdown p,
      .swagger-ui .markdown li,
      .swagger-ui .renderedMarkdown p,
      .swagger-ui .renderedMarkdown li,
      .swagger-ui .info .base-url,
      .swagger-ui .opblock-tag small,
      .swagger-ui .model,
      .swagger-ui .prop-type,
      .swagger-ui .parameter__deprecated {
        color: #cccccc;
      }
      .swagger-ui .opblock .opblock-summary-description,
      .swagger-ui .opblock .opblock-summary-operation-id,
      .swagger-ui .opblock .opblock-summary-path,
      .swagger-ui .opblock .opblock-summary-path__deprecated {
        color: revert;
      }
      .swagger-ui .opblock-tag,
      .swagger-ui .opblock .opblock-summary,
      .swagger-ui table tbody tr td,
      .swagger-ui table thead tr th,
      .swagger-ui table thead tr td {
        border-color: rgba(255, 255, 255, 0.08);
      }
      .swagger-ui .opblock,
      .swagger-ui .responses-inner,
      .swagger-ui section.models,
      .swagger-ui .model-box {
        background: #1b222c;
        box-shadow: none;
      }
      .swagger-ui .opblock { background: #1e2630; }
      .swagger-ui .opblock .opblock-summary { background: rgba(255, 255, 255, 0.02); }
      .swagger-ui .opblock.opblock-get {
        background: rgba(33, 150, 243, 0.14);
        border-color: rgba(33, 150, 243, 0.42);
      }
      .swagger-ui .opblock.opblock-post { background: rgba(81, 207, 102, 0.12); }
      .swagger-ui .opblock.opblock-put { background: rgba(247, 201, 72, 0.12); }
      .swagger-ui .opblock.opblock-delete { background: rgba(255, 107, 107, 0.12); }
      .swagger-ui .opblock-body pre,
      .swagger-ui .highlight-code,
      .swagger-ui .microlight,
      .swagger-ui pre.microlight {
        background: #0f141a !important;
        color: #f4f8fc !important;
      }
      .swagger-ui .btn.authorize,
      .swagger-ui .btn.execute {
        background: #2196f3;
        border-color: #1976d2;
        color: #ffffff;
      }
      .swagger-ui .btn.authorize:hover,
      .swagger-ui .btn.execute:hover {
        background: #1976d2;
      }
      .swagger-ui .btn.cancel,
      .swagger-ui select,
      .swagger-ui .download-url-wrapper .select-label select {
        background: #2a2f37;
        border-color: rgba(255, 255, 255, 0.12);
        color: #ffffff;
      }
      .swagger-ui input[type="text"],
      .swagger-ui input[type="password"],
      .swagger-ui textarea,
      .swagger-ui .download-url-wrapper input[type="text"] {
        background: #11161d;
        border-color: rgba(255, 255, 255, 0.12);
        color: #ffffff;
      }
      .swagger-ui input::placeholder,
      .swagger-ui textarea::placeholder {
        color: #94a3b8;
      }
    </style>
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="./swagger-ui-bundle.js" crossorigin></script>
    <script src="./swagger-ui-standalone-preset.js" crossorigin></script>
    <script src="./swagger-initializer.js" crossorigin></script>
  </body>
</html>
`,
  );
}

function fetchBuffer(url) {
  return new Promise((resolve, reject) => {
    http
      .get(url, (response) => {
        if (response.statusCode !== 200) {
          response.resume();
          reject(new Error(`Failed to fetch ${url}: ${response.statusCode}`));
          return;
        }

        const chunks = [];
        response.on('data', (chunk) => chunks.push(chunk));
        response.on('end', () => resolve(Buffer.concat(chunks)));
      })
      .on('error', reject);
  });
}

function writeMetadata({version, commit, sourceRef}) {
  const destination = path.join(siteRoot, 'src', 'data', 'listenarr.generated.json');
  const payload = {
    sourceRepository: 'https://github.com/Listenarrs/Listenarr',
    sourceRef,
    version,
    commit: commit || 'unknown',
    generatedAt: new Date().toISOString(),
  };
  writeFileSync(destination, `${JSON.stringify(payload, null, 2)}\n`);
}

function writeSocialCardPlaceholder() {
  const destination = path.join(siteRoot, 'static', 'img', 'listenarr', 'social-card.png');
  copyFileSync(path.join(siteRoot, 'static', 'img', 'listenarr', 'audiobooks.png'), destination);
}

function stopProcess(child) {
  if (!child || child.killed) {
    return;
  }

  if (process.platform === 'win32') {
    spawnSync('taskkill', ['/pid', String(child.pid), '/t', '/f'], {stdio: 'ignore'});
    return;
  }

  child.kill('SIGTERM');
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
