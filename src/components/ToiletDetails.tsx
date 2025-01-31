import React from 'react';
import { Button } from './ui/button';
import { Star, Clock, DollarSign, Accessibility } from 'lucide-react';

interface ToiletDetailsProps {
  toilet: any;
  onClose: () => void;
}

const ToiletDetails: React.FC<ToiletDetailsProps> = ({ toilet, onClose }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-lg animate-slide-up z-50">
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
            {toilet.type === 'public' ? 'Public' : 'Private'}
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-secondary text-secondary-foreground">
            <Clock className="w-4 h-4 mr-1" /> Open
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center">
            <DollarSign className="w-5 h-5 text-gray-500 mr-2" />
            <span>Free</span>
          </div>
          <div className="flex items-center">
            <Accessibility className="w-5 h-5 text-gray-500 mr-2" />
            <span>Accessible</span>
          </div>
          <div className="flex items-center">
            <Star className="w-5 h-5 text-yellow-400 mr-2" />
            <span>4.5 (28 reviews)</span>
          </div>
        </div>

        <Button className="w-full" onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${toilet.lat},${toilet.lng}`)}>
          Get Directions
        </Button>
      </div>
    </div>
  );
};

export default ToiletDetails;