export interface ToiletData {
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

export interface ToiletDetails {
  id: string;
  name: string;
  type: string;
  horaire: string;
  accessible: boolean;
  lat: number;
  lng: number;
  arrondissement: string;
}