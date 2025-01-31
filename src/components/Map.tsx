import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from './ui/button';
import { Locate } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

interface MapProps {
  onToiletSelect: (toilet: any) => void;
}

interface ToiletData {
  type: string;
  adresse: string;
  arrondissement: string;
  horaire: string;
  acces_pmr: string;
  geo_point_2d: {
    lon: number;
    lat: number;
  };
}

const Map: React.FC<MapProps> = ({ onToiletSelect }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const userMarker = useRef<mapboxgl.Marker | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const { toast } = useToast();
  const [toilets, setToilets] = useState<ToiletData[]>([]);

  const fetchToilets = async () => {
    try {
      const response = await fetch('https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/sanisettesparis/records?limit=20');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Fetched toilets:', data.results);
      setToilets(data.results);
    } catch (error) {
      console.error('Error fetching toilets:', error);
      toast({
        title: "Error",
        description: "Failed to fetch toilet locations",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchToilets();
  }, []);

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
    
    if (userMarker.current) {
      userMarker.current.remove();
    }

    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [2.3522, 48.8566], // Paris coordinates
      zoom: 13,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Create user location marker
    userMarker.current = new mapboxgl.Marker({
      color: '#4B5563',
      scale: 0.8
    });

    // Wait for map to load before adding markers
    map.current.on('load', () => {
      // Add markers for toilets
      toilets.forEach(toilet => {
        if (toilet.geo_point_2d && toilet.geo_point_2d.lon && toilet.geo_point_2d.lat) {
          const marker = new mapboxgl.Marker({
            color: '#0D9488'
          })
            .setLngLat([toilet.geo_point_2d.lon, toilet.geo_point_2d.lat])
            .addTo(map.current!);

          // Add click event to marker
          marker.getElement().addEventListener('click', () => {
            onToiletSelect({
              id: toilet.adresse,
              name: toilet.adresse,
              type: 'public',
              horaire: toilet.horaire,
              accessible: toilet.acces_pmr === 'Oui',
              lat: toilet.geo_point_2d.lat,
              lng: toilet.geo_point_2d.lon,
            });
          });

          markersRef.current.push(marker);
        }
      });
    });

    return () => {
      markersRef.current.forEach(marker => marker.remove());
      if (userMarker.current) {
        userMarker.current.remove();
      }
      map.current?.remove();
    };
  }, [mapboxToken, toilets, onToiletSelect]);

  const getCurrentLocation = () => {
    if (!map.current) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        // Update user marker position
        if (userMarker.current) {
          userMarker.current
            .setLngLat([longitude, latitude])
            .addTo(map.current!);
        }

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