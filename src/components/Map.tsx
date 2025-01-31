import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from './ui/button';
import { Locate } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

interface MapProps {
  onToiletSelect: (toilet: any) => void;
}

const Map: React.FC<MapProps> = ({ onToiletSelect }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const { toast } = useToast();

  // Temporary data for demonstration
  const dummyToilets = [
    { id: 1, lat: -33.8688, lng: 151.2093, type: 'public', name: 'Central Station Restroom' },
    { id: 2, lat: -33.8568, lng: 151.2153, type: 'private', name: 'Shopping Center Facilities' },
  ];

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map only if we have the token
    if (!mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [151.2093, -33.8688], // Sydney
      zoom: 13,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add markers for dummy toilets
    dummyToilets.forEach(toilet => {
      const marker = new mapboxgl.Marker({
        color: toilet.type === 'public' ? '#0D9488' : '#1E40AF'
      })
        .setLngLat([toilet.lng, toilet.lat])
        .addTo(map.current!);

      // Add click event to marker
      marker.getElement().addEventListener('click', () => {
        onToiletSelect(toilet);
      });
    });

    return () => {
      map.current?.remove();
    };
  }, [mapboxToken, onToiletSelect]);

  const getCurrentLocation = () => {
    if (!map.current) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        map.current?.flyTo({
          center: [longitude, latitude],
          zoom: 15,
          duration: 2000
        });
      },
      () => {
        toast({
          title: "Location Error",
          description: "Unable to get your current location",
          variant: "destructive"
        });
      }
    );
  };

  return (
    <div className="relative w-full h-screen">
      {!mapboxToken && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Enter Mapbox Token</h3>
            <input
              type="text"
              className="w-full p-2 border rounded mb-4"
              placeholder="Enter your Mapbox public token"
              onChange={(e) => setMapboxToken(e.target.value)}
            />
            <p className="text-sm text-gray-500 mb-2">
              Get your token from <a href="https://mapbox.com" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">mapbox.com</a>
            </p>
          </div>
        </div>
      )}
      <div ref={mapContainer} className="absolute inset-0" />
      <Button
        onClick={getCurrentLocation}
        className="absolute bottom-24 right-4 bg-white hover:bg-gray-100 text-gray-800"
        size="icon"
      >
        <Locate className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default Map;