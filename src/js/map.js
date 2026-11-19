(function () {
  var el = document.getElementById("map-canvas");
  if (!el || typeof L === "undefined") return;

  var places;
  try {
    places = JSON.parse(el.dataset.places);
  } catch (e) {
    return;
  }
  if (!places.length) return;

  var map = L.map(el, { maxZoom: 18, zoomSnap: 0.5 });

  var osm = L.tileLayer(
    "https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution: "&copy; OpenStreetMap contributors"
  });

  var imagery = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/" +
    "World_Imagery/MapServer/tile/{z}/{y}/{x}", {
    maxZoom: 18,
    attribution: "Imagery &copy; Esri, Maxar, Earthstar Geographics"
  });

  var pistes = L.tileLayer(
    "https://tiles.opensnowmap.org/pistes/{z}/{x}/{y}.png", {
    maxZoom: 18,
    zIndex: 2,
    attribution: '<a href="https://www.opensnowmap.org">' +
      "OpenSnowMap.org</a>"
  });

  osm.addTo(map);
  pistes.addTo(map);

  L.control.layers(
    { "Map": osm, "Aerial": imagery },
    { "Ski runs": pistes },
    { collapsed: false }
  ).addTo(map);

  var points = places.map(function (p) {
    var box = document.createElement("div");
    var name = document.createElement("strong");
    name.textContent = p.name;
    box.appendChild(name);
    if (p.note) {
      box.appendChild(document.createElement("br"));
      box.appendChild(document.createTextNode(p.note));
    }

    var dot = document.createElement("span");
    dot.style.background = p.color || "#555";
    var icon = L.divIcon({
      className: "pin",
      html: dot,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
      popupAnchor: [0, -14]
    });

    L.marker([p.lat, p.lng], { icon: icon })
      .bindPopup(box)
      .addTo(map);
    return [p.lat, p.lng];
  });

  map.fitBounds(points, { padding: [20, 20] });
})();
