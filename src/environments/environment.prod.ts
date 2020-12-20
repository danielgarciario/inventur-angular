export interface LagerDefinition {
  cwar: string;
  lager: string;
}

export const lagersdef: Array<{ cwar: string; lager: string }> = [
  { cwar: 'S36', lager: 'Siek Haupt Lager' },
  { cwar: 'S38', lager: 'Siek Laden Lager' },
  { cwar: 'SM1', lager: 'Siek Mietlager' },
  { cwar: 'S34', lager: 'Siek Montagewagen' },
  { cwar: 'SB1', lager: 'Stock B.I.G. Lager' },
  { cwar: 'B01', lager: 'Berlin Haupt Lager' },
  { cwar: 'B02', lager: 'Berlin Montagewagen' },
  { cwar: 'BM1', lager: 'Berlin Mietlager' },
  { cwar: 'R01', lager: 'Rostock Haupt Lager' },
  { cwar: 'R02', lager: 'Rostock Montagewagen' },
  { cwar: 'RM1', lager: 'Rostock Mietlager' },
];
export const beowlagersdef: Array<LagerDefinition> = [
  { cwar: 'S36', lager: 'Siek Zentral Lager' },
  { cwar: 'R01', lager: 'Rostock Lager' },
];

export const beobenutzer: Array<string> = [
  '444',
  '167',
  '19',
  '361',
  '463',
  '392',
];

export const environment = {
  production: true,
  // apiURL: 'http://localhost:50998',
  apiURL: 'http://st-lilliput01.stock.local:50998',
  tokenaddress: 'stock_perminv_jwtToken',
  beolageraddress: 'stock_beobachtung_lager',
  lagers: lagersdef,
  beowachlagers: beowlagersdef,
  beowachlager: 'S36',
  beousers: beobenutzer,
  magickey: 'F4',
};
