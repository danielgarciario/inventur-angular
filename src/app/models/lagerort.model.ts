export interface LagerOrt {
  lager: string;
  lagerplatz: string;
}

export interface Localizador extends LagerOrt {
  regal: string;
}
