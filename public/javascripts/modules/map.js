import axios from 'axios';
import { $ } from './bling';

const mapOptions = {
  center: {
    lat: 43.2,
    lng: -79.8,
  },
  zoom: 8,
};
//navigator.geolocation.getCurrentPosition

async function loadPlaces(map, lat = 43.2, lng = -79.8) {
  const { data: places } = await axios.get(
    `/api/stores/near?lat=${lat}&lng=${lng}`
  );

  if (!places.length) {
    return;
  }

  const bounds = new google.maps.LatLngBounds();
  const infoWindow = new google.maps.InfoWindow();

  const markers = places.map(place => {
    const [lng, lat] = place.location.coordinates;
    const position = {
      lat,
      lng,
    };
    bounds.extend(position);
    const marker = new google.maps.Marker({
      map,
      position,
    });
    marker.place = place;
    return marker;
  });

  markers.forEach(marker => {
    const { place } = marker;

    marker.addListener('click', () => {
      const html = `
        <div class="popup">
            <a href="/store/${place.slug}"></a>
            <img src="/uploads/${place.photo ||
              'store.png'}" alt="${place.name}" />
            <p>${place.name} - ${place.location.address}</p>
        </div>
        `;
      infoWindow.setContent(html);
      infoWindow.open(map, marker);
    });
  });

  map.setCenter(bounds.getCenter());
  map.fitBounds(bounds);
}

function makeMap(mapDiv) {
  if (!mapDiv) {
    return;
  }

  const map = new google.maps.Map(mapDiv, mapOptions);

  loadPlaces(map);

  const input = $('[name="geolocate"]');

  const autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace();
    loadPlaces(
      map,
      place.geometry.location.lat(),
      place.geometry.location.lng()
    );
  });
}

export default makeMap;
