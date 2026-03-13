const lightCodeTheme = require('prism-react-renderer').themes.github;
const darkCodeTheme = require('prism-react-renderer').themes.dracula;

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Listenarr',
  tagline: 'Documentation, setup guides, and a bundled API UI for Listenarr.',
  favicon: 'img/listenarr/logo-icon.png',

  url: 'https://listenarrs.github.io',
  baseUrl: '/',

  organizationName: 'Listenarrs',
  projectName: 'listenarr.github.io',

  onBrokenLinks: 'throw',
  trailingSlash: true,

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          routeBasePath: 'docs',
          editUrl: 'https://github.com/Listenarrs/listenarr.github.io/tree/main/',
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/listenarr/social-card.png',
      navbar: {
        title: 'Listenarr',
        logo: {
          alt: 'Listenarr',
          src: 'img/listenarr/logo-icon.png',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'docsSidebar',
            position: 'left',
            label: 'Docs',
          },
          {
            href: '/api/',
            label: 'API',
            position: 'left',
          },
          {
            href: 'https://github.com/Listenarrs/Listenarr',
            className: 'header-github-link',
            label: 'GitHub',
            'aria-label': 'GitHub repository',
            position: 'right',
          },
          {
            href: 'https://discord.gg/CwZ2Sqp9NF',
            className: 'header-discord-link',
            label: 'Discord',
            'aria-label': 'Discord server',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Overview',
                to: '/docs/',
              },
              {
                label: 'Installation',
                to: '/docs/getting-started/installation/',
              },
              {
                label: 'API',
                href: '/api/',
              },
            ],
          },
          {
            title: 'Project',
            items: [
              {
                label: 'Listenarr Repo',
                href: 'https://github.com/Listenarrs/Listenarr',
              },
              {
                label: 'Releases',
                href: 'https://github.com/Listenarrs/Listenarr/releases',
              },
              {
                label: 'Issues',
                href: 'https://github.com/Listenarrs/Listenarr/issues',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Discord',
                href: 'https://discord.gg/CwZ2Sqp9NF',
              },
              {
                label: 'Discussions',
                href: 'https://github.com/Listenarrs/Listenarr/discussions',
              },
            ],
          },
        ],
        copyright: `Copyright ${new Date().getFullYear()} Listenarr`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
      colorMode: {
        defaultMode: 'dark',
        disableSwitch: true,
        respectPrefersColorScheme: false,
      },
      metadata: [
        {
          name: 'theme-color',
          content: '#2196f3',
        },
      ],
    }),
};

module.exports = config;
