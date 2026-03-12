/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docsSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Getting Started',
      items: [
        'getting-started/installation',
        'getting-started/first-run',
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
        'reference/api-ui',
        'reference/development',
      ],
    },
  ],
};

module.exports = sidebars;
