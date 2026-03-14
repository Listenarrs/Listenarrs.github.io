window.onload = async function () {
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
