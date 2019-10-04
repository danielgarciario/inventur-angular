import { Dictionary } from '@ngrx/entity';

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

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
  { cwar: 'RM1', lager: 'Rostock Mietlager' }
];

export const environment = {
  production: false,
  // apiURL: 'http://localhost:50998',
  apiURL: 'http://st-lilliput01.stock.local:50998',
  tokenaddress: 'stock_perminv_jwtToken',
  lagers: lagersdef,
  beowachlager: 'S36'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
