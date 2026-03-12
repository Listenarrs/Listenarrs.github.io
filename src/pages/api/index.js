import React, {useEffect, useRef} from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import Layout from '@theme/Layout';
import useBaseUrl from '@docusaurus/useBaseUrl';

import styles from './index.module.css';

function SwaggerApp({assetBase}) {
  const containerRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    ensureStylesheet(`${assetBase}swagger-ui.css`, 'listenarr-swagger-ui-css');

    Promise.all([
      ensureScript(`${assetBase}swagger-ui-bundle.js`, 'listenarr-swagger-ui-bundle'),
      ensureScript(`${assetBase}swagger-ui-standalone-preset.js`, 'listenarr-swagger-ui-standalone'),
    ])
      .then(() => {
        if (cancelled || !containerRef.current || !window.SwaggerUIBundle) {
          return;
        }

        window.SwaggerUIBundle({
          url: `${assetBase}openapi.json`,
          domNode: containerRef.current,
          deepLinking: true,
          presets: [window.SwaggerUIBundle.presets.apis, window.SwaggerUIStandalonePreset],
          layout: 'StandaloneLayout',
        });
      })
      .catch((error) => {
        if (containerRef.current) {
          containerRef.current.innerHTML = `<div class="${styles.error}">Failed to load Swagger UI: ${error.message}</div>`;
        }
      });

    return () => {
      cancelled = true;
    };
  }, [assetBase]);

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
      existing.addEventListener('load', resolve, {once: true});
      existing.addEventListener('error', () => reject(new Error(`Unable to load ${src}`)), {once: true});
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.id = id;
    script.async = false;
    script.onload = () => {
      script.dataset.loaded = 'true';
      resolve();
    };
    script.onerror = () => reject(new Error(`Unable to load ${src}`));
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

export default function ApiUiPage() {
  const assetBase = useBaseUrl('/api-ui/');

  return (
    <Layout title="API UI" description="Bundled Swagger UI for the Listenarr API.">
      <main className={styles.page}>
        <div className="container">
          <div className={styles.header}>
            <div>
              <p className={styles.kicker}>Listenarr API</p>
              <h1>Bundled Swagger UI</h1>
              <p>
                This page mounts the Swagger UI and OpenAPI document generated from the Listenarr repository during the docs build.
              </p>
            </div>
            <button
              type="button"
              className="button button--primary button--lg"
              onClick={() => window.open(`${assetBase}index.html`, '_blank', 'noopener,noreferrer')}
            >
              Open full screen
            </button>
          </div>
          <div className={styles.swaggerShell}>
            <BrowserOnly fallback={<div className={styles.loading}>Loading Swagger UI...</div>}>
              {() => <SwaggerApp assetBase={assetBase} />}
            </BrowserOnly>
          </div>
        </div>
      </main>
    </Layout>
  );
}
