import mapboxgl from 'mapbox-gl';
import { ToiletData, ToiletDetails } from '../../types/toilet';

export const createToiletMarker = (
  map: mapboxgl.Map,
  toilet: ToiletData,
  onSelect: (toilet: ToiletDetails) => void
): mapboxgl.Marker => {
  const marker = new mapboxgl.Marker({
    color: '#0D9488'
  })
    .setLngLat([toilet.geo_point_2d.lon, toilet.geo_point_2d.lat])
    .addTo(map);

  marker.getElement().addEventListener('click', () => {
    onSelect({
      id: toilet.adresse,
      name: toilet.adresse,
      type: toilet.type,
      horaire: toilet.horaire,
      accessible: toilet.acces_pmr === 'Oui',
      lat: toilet.geo_point_2d.lat,
      lng: toilet.geo_point_2d.lon,
      arrondissement: toilet.arrondissement
    });
  });

  return marker;
};