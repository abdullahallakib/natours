
// abdullahallakib
// password REG-1514834882akib

export const displyMap = (locations) => {
  mapboxgl.accessToken =
    "pk.eyJ1IjoiYWJkdWxsYWhhbGxha2liIiwiYSI6ImNsYm91d2Z0dzAyM2Mzb215YWZocGFwYXQifQ.Et5Z8bUi8pypeq4C-32lvA";

  var map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/abdullahallakib/clbov9o4d000315nz3xym69oj",
    scrollZoom: false,
    // center: [-118.78816, 34.251184],
    // zoom: 10,
    // interactive: false,
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    const el = document.createElement("div");
    el.className = "marker";

    new mapboxgl.Marker({
      element: el,
      anchor: "bottom",
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100,
    },
  });
};
