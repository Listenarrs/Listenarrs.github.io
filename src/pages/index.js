import {startTransition, useEffect, useRef, useState} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

import metadata from '@site/src/data/listenarr.generated.json';
import trendingBooks from '@site/src/data/audimeta.trending.json';
import styles from './index.module.css';

const capabilities = [
  {
    label: 'Downloads',
    title: 'Torrent and NZB client support',
    description:
      'Search connected indexers and send releases directly to qBittorrent, Transmission, SABnzbd, or NZBGet. Support for additional clients is on the way.',
  },
  {
    label: 'Indexers',
    title: 'Import indexers from Prowlarr',
    description:
      'Pull existing indexer definitions into Listenarr from Prowlarr so you do not have to recreate them one by one.',
  },
  {
    label: 'Metadata',
    title: 'Audimeta, Audnexus, and OpenLibrary metadata',
    description:
      'Enrich results with provider fallbacks for title matching, identifiers, authors, and cover recovery. Hardcover metadata support is planned.',
  },
  {
    label: 'Organization',
    title: 'Configurable naming patterns',
    description:
      'Define folder, single-file, and multi-file naming rules so imports land in a consistent library structure.',
  },
  {
    label: 'Profiles',
    title: 'Quality profiles and upgrade cutoffs',
    description:
      'Rank codecs and bitrates, prefer M4B for AAC workflows, and decide when Listenarr should stop upgrading a release.',
  },
  {
    label: 'Imports',
    title: 'Hardlink-aware imports',
    description:
      'Prefer hardlinks when the filesystem allows it, with copy fallbacks when drives or mounts make linking impossible.',
  },
  {
    label: 'Security',
    title: 'Authentication and API access',
    description:
      'Use session-based login and API-key flows.',
  },
  {
    label: 'Notifications',
    title: 'Send events through the services you already use',
    description:
      'Listenarr supports Telegram, Pushover, Pushbullet, Slack, NTFY, Zapier-style webhooks, generic webhooks, and Discord notifications. Support for other notification services is based on demand.',
  },
  {
    label: 'Discord',
    title: 'Run the built-in Discord request bot',
    description:
      'Register slash commands against your Listenarr server and optionally scope the bot to a specific guild or channel.',
  },
  {
    label: 'Deployment',
    title: 'Handle split paths across containers or other hosts',
    description:
      'Remote path mappings let Listenarr reconcile the paths your download clients see with the paths the library server can access.',
  },
  {
    label: 'Activity',
    title: 'Track queue state, imports, and activity in one place',
    description:
      'Watch active downloads, completion handling, and import status without bouncing between multiple tools.',
  },
  {
    label: 'Library',
    title: 'Manage root folders and reconcile existing files',
    description:
      'Route books into the right library roots, and keep large audiobook collections organized as they grow. Importing and matching for existing libraries is on the way.',
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

const discoveryHighlights = [
  'Follow an author across every release',
  'Jump into a genre rabbit hole',
  'Pick up a series and binge fast',
  'Turn a cover spark into a monitored grab',
];

const HERO_CAROUSEL_INTERVAL_MS = 4500;

function GitHubMark(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 .5C5.648.5.5 5.648.5 12a11.5 11.5 0 008 10.938c.584.107.8-.254.8-.566 0-.28-.011-1.205-.017-2.186-3.256.708-3.944-1.383-3.944-1.383-.533-1.355-1.302-1.716-1.302-1.716-1.064-.728.08-.713.08-.713 1.177.082 1.797 1.209 1.797 1.209 1.046 1.793 2.744 1.275 3.412.975.106-.757.409-1.274.744-1.567-2.6-.296-5.336-1.3-5.336-5.787 0-1.278.457-2.324 1.206-3.145-.121-.295-.523-1.488.114-3.102 0 0 .984-.315 3.223 1.201A11.18 11.18 0 0112 6.174c.99.005 1.988.134 2.919.394 2.238-1.516 3.221-1.201 3.221-1.201.638 1.614.236 2.807.115 3.102.751.821 1.205 1.867 1.205 3.145 0 4.498-2.741 5.487-5.348 5.777.42.362.794 1.073.794 2.163 0 1.563-.014 2.821-.014 3.205 0 .315.212.679.808.564A11.5 11.5 0 0023.5 12C23.5 5.648 18.352.5 12 .5z" />
    </svg>
  );
}

function HomepageHeader() {
  const docsUrl = useBaseUrl('/docs/getting-started/quick-start');
  const releasesUrl = 'https://github.com/Listenarrs/Listenarr/releases/latest';
  const logoUrl = useBaseUrl('/img/listenarr/logo-full.png');
  const heroScreenshotButtonRef = useRef(null);
  const carouselFrameRef = useRef(0);
  const carouselLastTimestampRef = useRef(0);
  const carouselProgressRef = useRef(0);
  const [activeScreenshot, setActiveScreenshot] = useState(0);
  const [carouselProgress, setCarouselProgress] = useState(0);
  const [isHeroHovered, setIsHeroHovered] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const resolvedScreenshots = [
    {
      ...screenshots[0],
      imageUrl: useBaseUrl(screenshots[0].image),
    },
    {
      ...screenshots[1],
      imageUrl: useBaseUrl(screenshots[1].image),
    },
    {
      ...screenshots[2],
      imageUrl: useBaseUrl(screenshots[2].image),
    },
  ];
  const activeShot = resolvedScreenshots[activeScreenshot];
  const isCarouselPaused = isHeroHovered || isLightboxOpen;

  const resetCarouselProgress = () => {
    carouselLastTimestampRef.current = 0;
    carouselProgressRef.current = 0;
    setCarouselProgress(0);
  };

  const showScreenshot = (nextIndex) => {
    resetCarouselProgress();
    startTransition(() => {
      setActiveScreenshot(nextIndex);
    });
  };

  const openLightbox = () => {
    setIsLightboxOpen(true);
  };

  const syncHoverStateWithHero = () => {
    const nextHoverState = heroScreenshotButtonRef.current?.matches(':hover') ?? false;
    setIsHeroHovered(nextHoverState);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    window.requestAnimationFrame(() => {
      syncHoverStateWithHero();
    });
  };

  useEffect(() => {
    if (resolvedScreenshots.length <= 1 || isCarouselPaused) {
      carouselLastTimestampRef.current = 0;
      return undefined;
    }

    const tick = (timestamp) => {
      if (!carouselLastTimestampRef.current) {
        carouselLastTimestampRef.current = timestamp;
      }

      const elapsed = timestamp - carouselLastTimestampRef.current;
      carouselLastTimestampRef.current = timestamp;

      const nextProgress = carouselProgressRef.current + elapsed / HERO_CAROUSEL_INTERVAL_MS;

      if (nextProgress >= 1) {
        carouselProgressRef.current = 0;
        setCarouselProgress(0);
        carouselLastTimestampRef.current = 0;
        startTransition(() => {
          setActiveScreenshot((current) => (current + 1) % resolvedScreenshots.length);
        });
      } else {
        carouselProgressRef.current = nextProgress;
        setCarouselProgress(nextProgress);
      }

      carouselFrameRef.current = window.requestAnimationFrame(tick);
    };

    carouselFrameRef.current = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(carouselFrameRef.current);
      carouselFrameRef.current = 0;
    };
  }, [isCarouselPaused, resolvedScreenshots.length]);

  useEffect(() => {
    if (!isLightboxOpen) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeLightbox();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isLightboxOpen]);

  return (
    <>
      <header className={styles.hero}>

        <div className={clsx('container', styles.heroInner)}>
          <div className={styles.heroCopy}>
            <h1>Simplify your audiobook experience</h1>
            <p className={styles.heroLead}>
              Centralize discovery, downloads, metadata, and library organization into one self-hosted application built for audiobook collectors.
            </p>
            <div className={styles.heroActions}>
              <Link className="button button--primary button--lg" to={docsUrl}>
                Quick Start
              </Link>
              <Link
                className={clsx('button button--secondary button--lg', styles.secondaryAction, styles.githubAction)}
                href={releasesUrl}>
                <GitHubMark />
                <span>Download</span>
              </Link>
            </div>
          </div>
          <div className={styles.heroPanel}>
            <div className={styles.heroFrame}>
              <button
                ref={heroScreenshotButtonRef}
                type="button"
                className={styles.heroCarouselButton}
                aria-label={`Expand ${activeShot.title} screenshot`}
                aria-haspopup="dialog"
                onClick={openLightbox}
                onMouseEnter={() => setIsHeroHovered(true)}
                onMouseLeave={() => setIsHeroHovered(false)}
                onFocus={() => setIsHeroHovered(true)}
                onBlur={() => setIsHeroHovered(false)}>
                <div className={styles.heroCarousel}>
                  {resolvedScreenshots.map((shot, index) => (
                    <img
                      key={shot.title}
                      src={shot.imageUrl}
                      alt={shot.title}
                      aria-hidden={index !== activeScreenshot}
                      className={clsx(styles.heroSlide, index === activeScreenshot && styles.heroSlideActive)}
                      loading={index === 0 ? 'eager' : 'lazy'}
                    />
                  ))}
                </div>
                <span className={styles.heroExpandHint}>Click to expand</span>
              </button>
              <div className={styles.heroMeta}>
                <strong>{activeShot.title}</strong>
                <div className={styles.heroIndicators} aria-label="Hero screenshots">
                  {resolvedScreenshots.map((shot, index) => (
                    <button
                      key={shot.title}
                      type="button"
                      className={clsx(styles.heroIndicator, index === activeScreenshot && styles.heroIndicatorActive)}
                      style={{'--hero-progress': index === activeScreenshot ? carouselProgress : 0}}
                      aria-label={`Show ${shot.title}`}
                      aria-pressed={index === activeScreenshot}
                      onClick={() => showScreenshot(index)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {isLightboxOpen ? (
        <div className={styles.heroLightboxBackdrop} role="presentation" onClick={closeLightbox}>
          <div
            className={styles.heroLightbox}
            role="dialog"
            aria-modal="true"
            aria-label={`${activeShot.title} screenshot preview`}
            onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className={styles.heroLightboxClose}
              aria-label="Close screenshot preview"
              onClick={closeLightbox}>
              x
            </button>
            <img src={activeShot.imageUrl} alt={activeShot.title} className={styles.heroLightboxImage} />
            <div className={styles.heroLightboxMeta}>
              <strong>{activeShot.title}</strong>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function CapabilitiesSection() {
  const cardRefs = useRef([]);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') {
      return undefined;
    }

    const cards = cardRefs.current.filter(Boolean);

    if (cards.length === 0) {
      return undefined;
    }

    const revealCard = (card) => {
      card.dataset.revealState = 'visible';
    };

    const hideCard = (card) => {
      card.dataset.revealState = 'hidden';
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || entry.intersectionRatio < 0.25) {
            return;
          }

          revealCard(entry.target);
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: [0.25],
      },
    );

    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const visiblePixels = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);
      const visibleRatio = Math.max(0, visiblePixels) / Math.max(rect.height, 1);

      if (visibleRatio >= 0.25) {
        revealCard(card);
      } else {
        hideCard(card);
        observer.observe(card);
      }
    });

    return () => {
      observer.disconnect();
      cards.forEach((card) => {
        delete card.dataset.revealState;
      });
    };
  }, []);

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.sectionHeading}>
          <h2>Built for the full audiobook workflow.</h2>
        </div>
        <div className={styles.cardGrid}>
          {capabilities.map((feature, index) => (
            <article
              key={feature.title}
              ref={(element) => {
                cardRefs.current[index] = element;
              }}
              className={styles.featureCard}
              style={{'--feature-delay': `${index * 70}ms`}}>
              <span className={styles.featureCardLabel}>{feature.label}</span>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function DiscoverySection() {
  const books = Array.isArray(trendingBooks?.books) ? trendingBooks.books.slice(0, 18) : [];
  const hasBooks = books.length > 0;

  return (
    <section className={clsx(styles.section, styles.discoverySection)}>
      <div className="container">
        <div className={styles.discoveryPanel}>
          {hasBooks ? (
            <div className={styles.discoveryCoverGrid} aria-hidden="true">
              {books.map((book, index) => (
                <img
                  key={book.asin}
                  src={book.imageUrl}
                  alt=""
                  loading="lazy"
                  className={styles.discoveryCover}
                  style={{
                    '--cover-offset': `${(index % 3) * 14}px`,
                    '--cover-rotation': `${((index % 5) - 2) * 1.3}deg`,
                  }}
                />
              ))}
            </div>
          ) : null}
          <div className={styles.discoveryOverlay} />
          <div className={styles.discoveryContent}>
            <h2>Find your next favorite author, genre, series, or binge quickly.</h2>
            <p>
              Pull fresh inspiration from trending audiobook covers, then let Listenarr turn that
              spark into monitored searches, grabs, and clean imports without breaking your flow.
            </p>
            <div className={styles.discoveryHighlightGrid}>
              {discoveryHighlights.map((item) => (
                <span key={item} className={styles.discoveryHighlight}>
                  {item}
                </span>
              ))}
            </div>
          </div>
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
            <h2>Use the API to build your own integrations.</h2>
          </div>
          <div className={styles.apiActions}>
            <Link className="button button--primary button--lg" to={apiUrl}>
              View API guide
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
        <DiscoverySection />
        <CapabilitiesSection />
        <ApiCallout />
      </main>
    </Layout>
  );
}
