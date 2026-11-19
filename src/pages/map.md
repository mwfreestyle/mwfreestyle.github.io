---
title: Map
layout: base.njk
permalink: /map/
mainClass: map-page
extraCss:
  - /css/leaflet.css
  - /css/map.css
extraJs:
  - /js/leaflet.js
  - /js/map.js
---

# Map

Where to meet and where to find things on the hill.

<div id="map-canvas" data-places="{{ places.places | dump }}"></div>

<ul class="places-list">
{% for p in places.places %}
<li style="--c: {{ p.color }}"><strong>{{ p.name }}</strong>
<a href="https://www.google.com/maps/search/?api=1&amp;query={{ p.lat }},{{ p.lng }}"
   target="_blank" rel="noopener noreferrer">Directions</a>
{% if p.note %}<span class="place-note">{{ p.note }}</span>{% endif %}</li>
{% endfor %}
</ul>
