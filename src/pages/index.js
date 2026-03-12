import {startTransition, useEffect, useState} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

import metadata from '@site/src/data/listenarr.generated.json';
import styles from './index.module.css';

const features = [
  {
    title: 'Search across your sources',
    description:
      'Query multiple torrent and NZB indexers from one place and route the right result to the right client.',
  },
  {
    title: 'Automate the handoff',
    description:
      'Listenarr watches active downloads, handles completion, and keeps your workflow moving without manual babysitting.',
  },
  {
    title: 'Enrich every audiobook',
    description:
      'Use external metadata providers to improve matching, artwork, and library detail before titles land on the shelf.',
  },
  {
    title: 'Organize the library',
    description:
      'Naming patterns, folder rules, and import behavior keep your audiobook collection consistent over time.',
  },
  {
    title: 'Monitor in real time',
    description:
      'Live activity, logs, and status updates make it easier to see what the server is doing and where it needs attention.',
  },
  {
    title: 'Manage it anywhere',
    description:
      'The responsive web UI works across phones, tablets, and desktops, so the server is usable beyond the primary workstation.',
  },
];

const screenshots = [
  {
    title: 'Library overview',
    image: '/img/listenarr/audiobooks.png',
  },
  {
    title: 'Search results',
    image: '/img/listenarr/search-result.png',
  },
  {
    title: 'Wanted queue',
    image: '/img/listenarr/wanted.png',
  },
];

const workflowSteps = [
  'Connect your download clients and indexers.',
  'Search or monitor for the audiobook you want.',
  'Let Listenarr track completion and import the result.',
  'Browse a richer, cleaner library with less manual cleanup.',
];

function formatDate(isoValue) {
  const date = new Date(isoValue);
  return Number.isNaN(date.getTime())
    ? 'Unknown'
    : date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
}

function HomepageHeader() {
  const docsUrl = useBaseUrl('/docs/');
  const apiUrl = useBaseUrl('/api/');
  const logoUrl = useBaseUrl('/img/listenarr/logo-full.png');
  const [activeScreenshot, setActiveScreenshot] = useState(0);

  useEffect(() => {
    if (screenshots.length <= 1) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      startTransition(() => {
        setActiveScreenshot((current) => (current + 1) % screenshots.length);
      });
    }, 4500);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <header className={styles.hero}>
      <div className={styles.heroBackdrop} />
      <div className={clsx('container', styles.heroInner)}>
        <div className={styles.heroCopy}>
          <img src={logoUrl} alt="Listenarr" className={styles.heroLogo} />
          <h1>Simplify your audiobook experience</h1>
          <p className={styles.heroLead}>
            Centralize discovery, downloads, metadata, and library organization into one self-hosted application built for audiobook collectors.
          </p>
          <div className={styles.heroActions}>
            <Link className="button button--primary button--lg" to={docsUrl}>
              Read the docs
            </Link>
            <Link className={clsx('button button--secondary button--lg', styles.secondaryAction)} to={apiUrl}>
              Open API UI
            </Link>
          </div>
        </div>
        <div className={styles.heroPanel}>
          <div className={styles.heroFrame}>
            <div className={styles.heroCarousel}>
              {screenshots.map((shot, index) => (
                <img
                  key={shot.title}
                  src={useBaseUrl(shot.image)}
                  alt={shot.title}
                  aria-hidden={index !== activeScreenshot}
                  className={clsx(styles.heroSlide, index === activeScreenshot && styles.heroSlideActive)}
                  loading={index === 0 ? 'eager' : 'lazy'}
                />
              ))}
            </div>
            <div className={styles.heroMeta}>
              <strong>{screenshots[activeScreenshot].title}</strong>
              <div className={styles.heroIndicators} aria-label="Hero screenshots">
                {screenshots.map((shot, index) => (
                  <button
                    key={shot.title}
                    type="button"
                    className={clsx(styles.heroIndicator, index === activeScreenshot && styles.heroIndicatorActive)}
                    aria-label={`Show ${shot.title}`}
                    aria-pressed={index === activeScreenshot}
                    onClick={() => setActiveScreenshot(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function FeatureGrid() {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.sectionHeading}>
          <h2>Listenarr consolidates your audiobook automation workflow.</h2>
        </div>
        <div className={styles.cardGrid}>
          {features.map((feature) => (
            <article key={feature.title} className={styles.featureCard}>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function WorkflowStrip() {
  return (
    <section className={clsx(styles.section, styles.workflowSection)}>
      <div className="container">
        <div className={styles.workflowPanel}>
          <div>
            <h2>Build an audiobook pipeline that feels like one product, not five disconnected tools.</h2>
          </div>
          <ol className={styles.workflowList}>
            {workflowSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function ScreenshotGallery() {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.gallery}>
          {screenshots.map((shot) => (
            <figure key={shot.title} className={styles.galleryCard}>
              <img src={useBaseUrl(shot.image)} alt={shot.title} />
              <figcaption>{shot.title}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function ApiCallout() {
  const apiUrl = useBaseUrl('/api/');
  const repoUrl = metadata.sourceRepository;

  return (
    <section className={clsx(styles.section, styles.apiSection)}>
      <div className="container">
        <div className={styles.apiPanel}>
          <div>
            <h2>Use Listenarr's API to build your own integrations.</h2>
          </div>
          <div className={styles.apiActions}>
            <Link className="button button--primary button--lg" to={apiUrl}>
              View API documentation
            </Link>
            <Link className="button button--secondary button--lg" href={repoUrl}>
              View Listenarr source
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();

  return (
    <Layout title={siteConfig.title} description={siteConfig.tagline}>
      <HomepageHeader />
      <main>
        <FeatureGrid />
        <WorkflowStrip />
        <ScreenshotGallery />
        <ApiCallout />
      </main>
    </Layout>
  );
}
