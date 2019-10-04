import { createAction, props } from '@ngrx/store';
import { Sesion } from '../../models/sesion.model';
import { SesionPos } from 'src/app/models/sespos.model';
import { LagerOrt } from 'src/app/models/lagerort.model';
import { Kandidato } from 'src/app/models/kandidato.model';
import { Artikel } from 'src/app/models/artikel.model';
import { GezahltID } from 'src/app/models/Gezaehlt.model';
import { DialogGezhaltIDData } from 'src/app/sessions/components/position/newgezhaltid/posnewgezid.dialog.component';
import { ActivatedRoute } from '@angular/router';

export const LoadSesions = createAction('[Sesions] Loadsessions');

export const LoadSesionsSuccess = createAction(
  '[Sesions] Loadsessions success',
  props<{ nuevassesiones: Array<Sesion> }>()
);
export const SelectSesion = createAction(
  '[Sesions] Selected',
  props<{ selectedSesionId: number }>()
);
export const ConfirmDeleteSesion = createAction(
  '[Sesions] ConfirmDeleteSesion',
  props<{ sesionid: number }>()
);
export const MostarDialogCrearSesion = createAction(
  '[Sesions] MostrarDialogo Crear Sesion'
);
export const CrearSesion = createAction(
  '[Sesions] IntentaCrearSesion',
  props<{ empno: string; lager: string; comment: string }>()
);
export const CrearSesionSuccess = createAction(
  '[Sesions] Creada Sesion Sucess',
  props<{ nuevasesion: Sesion }>()
);
export const CrearSesionInventur = createAction(
  '[Sesions] Intenta Crear Sesion Inventur',
  props<{ empno: string; lager: string; comment: string; idinventur: number }>()
);
export const DeleteSesion = createAction(
  '[Sesions] DeleteSesion',
  props<{ sesionid: number }>()
);
export const DeleteSesionSuccess = createAction(
  '[Sesions] DeleteSesion Success',
  props<{ sesionid: number }>()
);
export const ConfirDeleteSesionPosicion = createAction(
  '[Sesions] ConfirmDeleteSesionPosicion',
  props<{ sesionid: number; posicionid: number }>()
);
export const DeleteSesionPosicion = createAction(
  '[Sesions] DeleteSesionPosicion',
  props<{ sesionid: number; posicionid: number }>()
);
export const DeleteSesionPosicionSuccess = createAction(
  '[Sesions] DeleteSesionPosicion',
  props<{ sesionid: number; posicionid: number }>()
);
export const DeleteSesionPosicionAcknowledge = createAction(
  '[Sesions] Informado Borrada Sesionn Posicion'
);

export const LoadPositions = createAction('[Sesions] Load SessionsPosition');

export const LoadPositionsSuccess = createAction(
  '[Sesions] Loadpostions success',
  props<{ nuevasposiciones: Array<SesionPos> }>()
);

export const TrySetSelectedPosition = createAction(
  '[Sesions] Try Select Selected Position',
  props<{ posicionid: number }>()
);

export const SetSelectPosition = createAction(
  '[Sesions] Select Selected Position',
  props<{ posicion: SesionPos }>()
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
export const AddSesionPosSuccessAcknowledge = createAction(
  '[Kandidatos] Acknowledge Add Sesion Pos Success'
);

export const TryAddSerialBestandToGezahltFailed = createAction(
  '[SesionPos] Try Add Ids Serial 2 Gezahlt Failed'
);
export const TryAddSerialBestandToGezahlt = createAction(
  '[SesionPos] Try Add Ids Serial 2 Gezahlt',
  props<{ idsespos: number; serl: string }>()
);
export const TryAddSerialBestandToGezahltSuccess = createAction(
  '[SesionPos] Try Add Ids Serial 2 Gezahlt Sucess',
  props<{ sespos: SesionPos }>()
);

export const TryResetGezhaltID = createAction(
  '[SesionPos] Try Reset Gezahlt Id',
  props<{ gezahltId: GezahltID }>()
);
export const TryResetGezhaltIDSucess = createAction(
  '[SesionPos] Try Reset Gezahlt Id Sucess',
  props<{ sespos: SesionPos }>()
);
export const TryResetGezahltIDFailed = createAction(
  '[SesionPos] Try Reset Gezahlt Failed'
);
export const ShowPosGezahlDetailID = createAction(
  '[SesionPos] Show Detailed GezhaltID',
  props<{ sespos: SesionPos; gezhaltid: GezahltID }>()
);
export const ChangePosGezahlDetailID = createAction(
  '[Dialog GezhaltID] AcceptChanges',
  props<{ gdid: DialogGezhaltIDData }>()
);
export const ChangePosGezhalDetailMasiv = createAction(
  '[SesionPos] Cambio en GezhaltPosition Masiv',
  props<{ npgezahlt: SesionPos }>()
);
export const ChangePosGzehalDetailIDSuccess = createAction(
  '[Dialog GezhaltID] AcceptChanges Success',
  props<{ sespos: SesionPos }>()
);

export const ConfirmDeleteGezahltID = createAction(
  '[Sesion Pos] Confirm Delete Gezahlt ID',
  props<{ posicion: SesionPos; gezahltId: GezahltID }>()
);

export const DeleteGezhaltID = createAction(
  '[Sesion Pos] Delete Gezahlt ID',
  props<{ posicion: SesionPos; gezahltId: GezahltID }>()
);
export const DeleteGezhaltIDSuccess = createAction(
  '[Sesion Pos] Delete Gezahlt ID Success',
  props<{ posicion: SesionPos }>()
);
export const DeleteGezhaltIDFailed = createAction(
  '[Sesion Pos] Delete Gezahlt ID Failed'
);
export const TrySaveGezhaltID = createAction(
  '[Sesion Pos] Try Save Gezhalt Position',
  props<{
    posicion: SesionPos;
    rutadestinoOK: string;
  }>()
);
export const SaveGezhaltIDSucess = createAction(
  '[Sesion Pos] Save Gezhalt Position Succes',
  props<{
    posicion: SesionPos;
    rutadestinoOK: string;
  }>()
);
export const SaveGezhaltIDFailed = createAction(
  '[Sesion Pos] Save Gezhalt Position Failed'
);
