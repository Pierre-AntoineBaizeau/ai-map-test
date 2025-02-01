import React, { useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Clock, MapPin, Accessibility, Building } from 'lucide-react';
import { ToiletDetails as ToiletDetailsType } from '../types/toilet';

interface ToiletDetailsProps {
  toilet: ToiletDetailsType;
  onClose: () => void;
}

const ToiletDetails: React.FC<ToiletDetailsProps> = ({ toilet, onClose }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  let touchStart = 0;

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleTouchStart = (e: TouchEvent) => {
      touchStart = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStart) return;

      const touchEnd = e.touches[0].clientY;
      const diff = touchEnd - touchStart;

      if (diff > 50) {
        onClose();
        touchStart = 0;
      }
    };

    card.addEventListener('touchstart', handleTouchStart);
    card.addEventListener('touchmove', handleTouchMove);

    return () => {
      card.removeEventListener('touchstart', handleTouchStart);
      card.removeEventListener('touchmove', handleTouchMove);
    };
  }, [onClose]);

  return (
    <div ref={cardRef} className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-lg animate-slide-up z-50">
      <div className="p-6">
        <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-4" />
        
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-semibold">{toilet.name}</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>

        <div className="flex gap-2 mb-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary/10 text-primary">
            {toilet.type}
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-secondary text-secondary-foreground">
            {toilet.horaire}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center">
            <Building className="w-5 h-5 text-gray-500 mr-2" />
            <span>{toilet.arrondissement}</span>
          </div>
          <div className="flex items-center">
            <Accessibility className="w-5 h-5 text-gray-500 mr-2" />
            <span>{toilet.accessible ? 'Accessible' : 'Non accessible'}</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-5 h-5 text-gray-500 mr-2" />
            <span>{toilet.horaire}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="w-5 h-5 text-gray-500 mr-2" />
            <span>{toilet.arrondissement}</span>
          </div>
        </div>

        <Button 
          className="w-full" 
          onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${toilet.lat},${toilet.lng}`)}
        >
          Get Directions
        </Button>
      </div>
    </div>
  );
};

export default ToiletDetails;