import React, {useEffect, useRef, useState} from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import Layout from '@theme/Layout';
import useBaseUrl from '@docusaurus/useBaseUrl';

import metadata from '@site/src/data/listenarr.generated.json';
import styles from './index.module.css';

const swaggerExamples = [
  'http://localhost:4545/swagger/',
  'http://<listenarr-host>:4545/swagger/',
  'http://<listenarr-host>:<custom-port>/swagger/',
];

function SwaggerReference({assetBase}) {
  const containerRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let cancelled = false;
    setErrorMessage('');

    ensureStylesheet(`${assetBase}swagger-ui.css`, 'listenarr-swagger-ui-css');

    Promise.all([
      ensureScript(`${assetBase}swagger-ui-bundle.js`, 'listenarr-swagger-ui-bundle'),
      ensureScript(`${assetBase}swagger-ui-standalone-preset.js`, 'listenarr-swagger-ui-standalone'),
      fetchSwaggerSpec(`${assetBase}openapi.json`),
    ])
      .then(([, , spec]) => {
        if (cancelled || !containerRef.current || !window.SwaggerUIBundle || !spec) {
          return;
        }

        window.SwaggerUIBundle({
          spec: stripSwaggerDescription(spec),
          domNode: containerRef.current,
          deepLinking: true,
          docExpansion: 'list',
          filter: true,
          displayOperationId: false,
          supportedSubmitMethods: [],
          presets: [window.SwaggerUIBundle.presets.apis, window.SwaggerUIStandalonePreset],
          layout: 'StandaloneLayout',
        });
      })
      .catch((error) => {
        if (!cancelled) {
          const message = error instanceof Error ? error.message : String(error);
          setErrorMessage(`Failed to load API reference: ${message}`);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [assetBase]);

  if (errorMessage) {
    return <div className={styles.error}>{errorMessage}</div>;
  }

  return <div ref={containerRef} className={styles.swaggerMount} />;
}

function ensureScript(src, id) {
  return new Promise((resolve, reject) => {
    const existing = document.getElementById(id);
    if (existing) {
      if (existing.dataset.loaded === 'true') {
        resolve();
        return;
      }

      existing.remove();
    }

    const script = document.createElement('script');
    script.src = src;
    script.id = id;
    script.async = false;
    script.onload = () => {
      script.dataset.loaded = 'true';
      resolve();
    };
    script.onerror = () => {
      script.remove();
      reject(new Error(`Unable to load ${src}`));
    };
    document.body.appendChild(script);
  });
}

function ensureStylesheet(href, id) {
  if (document.getElementById(id)) {
    return;
  }

  const stylesheet = document.createElement('link');
  stylesheet.id = id;
  stylesheet.rel = 'stylesheet';
  stylesheet.href = href;
  document.head.appendChild(stylesheet);
}

function fetchSwaggerSpec(url) {
  return fetch(url).then((response) => {
    if (!response.ok) {
      throw new Error(`Unable to load ${url}`);
    }

    return response.json();
  });
}

function stripSwaggerDescription(spec) {
  return {
    ...spec,
    info: {
      ...(spec.info || {}),
      description: '',
    },
  };
}

function formatTimestamp(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(date);
}

export default function ApiPage() {
  const assetBase = useBaseUrl('/api-ui/');
  const openApiUrl = useBaseUrl('/api-ui/openapi.json');
  const generatedAt = formatTimestamp(metadata.generatedAt);

  return (
    <Layout
      title="API"
      description="Read-only Listenarr API reference plus guidance for the development-only Swagger UI.">
      <main className={styles.page}>
        <div className="container">
          <section className={styles.introSection}>
            <div className={styles.hero}>
              <h1>Listenarr API documentation</h1>
              <p className={styles.lead}>
                This page renders the bundled OpenAPI snapshot as a read-only endpoint reference.
                Listenarr&apos;s built-in Swagger UI is currently enabled only for Development
                builds, so this docs site is the reliable reference for normal installed
                instances.
              </p>
              <div className={styles.actions}>
                <a className="button button--primary button--lg" href={openApiUrl}>
                  Download OpenAPI JSON
                </a>
                <a className="button button--secondary button--lg" href={metadata.sourceRepository}>
                  View Listenarr source
                </a>
              </div>
            </div>

            <div className={styles.grid}>
              <article className={styles.card}>
                <h2>Use Swagger in a local development instance</h2>
                <p>
                  Listenarr mounts Swagger only when the app runs in <code>Development</code>. By
                  default the API listens on port <code>4545</code>, unless you override it with{' '}
                  <code>--urls</code>, so the built-in Swagger UI is usually available at{' '}
                  <code>/swagger/</code> on that same origin.
                </p>
                <p className={styles.cardNote}>
                  Normal installed or production-style instances do not expose <code>/swagger/</code>{' '}
                  by default.
                </p>
                <pre className={styles.codeBlock}>
                  <code>{swaggerExamples.join('\n')}</code>
                </pre>
              </article>
            </div>
          </section>

          <section className={styles.referenceSection}>
            <div className={styles.referenceHeader}>
              <div>
                <h2>Endpoint reference</h2>
                <p>
                  Read-only Swagger rendering of the bundled OpenAPI document. Execution is
                  disabled on this docs site.
                </p>
              </div>
            </div>
            <div className={styles.swaggerShell}>
              <BrowserOnly fallback={<div className={styles.loading}>Loading API reference...</div>}>
                {() => <SwaggerReference assetBase={assetBase} />}
              </BrowserOnly>
            </div>
          </section>
        </div>
      </main>
    </Layout>
  );
}
