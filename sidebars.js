/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docsSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Getting Started',
      items: [
        'getting-started/quick-start',
        'getting-started/installation',
        'getting-started/first-run',
      ],
    },
    {
      type: 'category',
      label: 'Configuration',
      items: [
        'configuration/root-folders',
        'configuration/download-clients',
        'configuration/indexers',
        'configuration/quality-profiles',
        'configuration/notifications',
        'configuration/discord-bot',
        'configuration/general-settings',
      ],
    },
    {
      type: 'category',
      label: 'Product Tour',
      items: [
        'product-tour/features',
      ],
    },
    {
      type: 'category',
      label: 'Reference',
      items: [
        'reference/api',
        'reference/development',
      ],
    },
  ],
};

module.exports = sidebars;
