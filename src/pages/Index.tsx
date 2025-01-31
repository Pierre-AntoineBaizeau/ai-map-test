import React, { useState } from 'react';
import Map from '../components/Map';
import ToiletDetails from '../components/ToiletDetails';

const Index = () => {
  const [selectedToilet, setSelectedToilet] = useState<any>(null);

  return (
    <div className="relative">
      <Map onToiletSelect={setSelectedToilet} />
      {selectedToilet && (
        <ToiletDetails
          toilet={selectedToilet}
          onClose={() => setSelectedToilet(null)}
        />
      )}
    </div>
  );
};

export default Index;