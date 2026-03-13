import React, {useEffect, useRef, useState} from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import Layout from '@theme/Layout';
import useBaseUrl from '@docusaurus/useBaseUrl';

import styles from './index.module.css';

function SwaggerApp({assetBase}) {
  const containerRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let cancelled = false;
    setErrorMessage('');

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
        if (!cancelled) {
          const message = error instanceof Error ? error.message : String(error);
          setErrorMessage(`Failed to load Swagger UI: ${message}`);
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

export default function ApiUiPage() {
  const assetBase = useBaseUrl('/api-ui/');

  return (
    <Layout title="API" description="Bundled Swagger UI for the Listenarr API.">
      <main className={styles.page}>
        <div className="container">
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
