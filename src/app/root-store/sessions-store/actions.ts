import { createAction, props } from '@ngrx/store';
import { Sesion } from '../../models/sesion.model';
import { SesionPos } from 'src/app/models/sespos.model';
import { LagerOrt } from 'src/app/models/lagerort.model';
import { Kandidato } from 'src/app/models/kandidato.model';
import { Artikel } from 'src/app/models/artikel.model';

export const LoadSesions = createAction('[Sesions] Loadsessions');

export const LoadSesionsSuccess = createAction(
  '[Sesions] Loadsessions success',
  props<{ nuevassesiones: Array<Sesion> }>()
);
export const SelectSesion = createAction(
  '[Sesions] Selected',
  props<{ selectedSesionId: number }>()
);
export const LoadPositions = createAction('[Sesions] Load SessionsPosition');

export const LoadPositionsSuccess = createAction(
  '[Sesions] Loadpostions success',
  props<{ nuevasposiciones: Array<SesionPos> }>()
);

export const BuscaCandidatosLagerOrt = createAction(
  '[Kandidatos] BuscaCandidatos por Lagerort',
  props<{ localizacion: LagerOrt }>()
);
export const CandidatosLagerOrtSuccess = createAction(
  '[Kandidatos] BuscaCandidatos por Lagerort sucess',
  props<{ nuevosCandidatos: Array<Kandidato> }>()
);

export const BuscaCandidatosItem = createAction(
  '[Kandidatos] BuscaCandidatos por Item',
  props<{ item: string; lager: string }>()
);
export const BuscaCandidatosItemSuccess = createAction(
  '[Kandidatos] BuscaCandidatos por Item Success',
  props<{ nuevosCandidatos: Array<Kandidato> }>()
);

export const buscaArticulos = createAction(
  '[Busca Articulos] Empieza a buscar Articulos',
  props<{ busqueda: string }>()
);
export const buscaArticulosSucess = createAction(
  '[Busca Articulo] Ejecutada sucess',
  props<{ nuevospotenciales: Array<Artikel> }>()
);
export const seleccionaArticulo = createAction(
  '[Busca Articulo] Selecciona Articulo',
  props<{ articuloseleccionado: Artikel }>()
);
export const seleccionaCandidato = createAction(
  '[Kandidatos] Seleccionado Kandidato',
  props<{ selectKandidato: Kandidato }>()
);
export const TryingToAddSesionPos = createAction(
  '[Kandidatos] Trying To Add Session Pos'
);
export const AddSesionPosSuccess = createAction(
  '[Kandidatos] Add Sesion Pos Success',
  props<{ nuevasespos: SesionPos }>()
);
export const AddSesionPosFailed = createAction(
  '[Kandidatos] Add Session Pos Failed'
);
