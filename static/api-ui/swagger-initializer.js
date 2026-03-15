window.onload = async function () {
  let specConfig = { url: './openapi.json' };

  try {
    const response = await fetch('./openapi.json');
    if (!response.ok) {
      throw new Error(`Unable to load ./openapi.json: ${response.status}`);
    }

    const spec = await response.json();
    specConfig = {
      spec: {
        ...spec,
        info: {
          ...(spec.info || {}),
          description: ''
        }
      }
    };
  } catch (error) {
    console.error('Failed to preload Listenarr OpenAPI spec for Swagger UI.', error);
  }

  window.ui = SwaggerUIBundle({
    ...specConfig,
    dom_id: '#swagger-ui',
    deepLinking: true,
    presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
    layout: 'StandaloneLayout'
  });
};
