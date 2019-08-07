import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { SesionPos } from 'src/app/models/sespos.model';

export interface SessionPosState extends EntityState<SesionPos> {
  loadingPositions: boolean;
  addDialogShow: boolean;
  deleteDialogShow: boolean;
  selectedSessionPos: SesionPos;
}

function getSessionPosicionId(sp: SesionPos): number {
  return sp.idsespos;
}
function ordenaPorFechasSesionPosicion(a: SesionPos, b: SesionPos): number {
  return a.checkedam < b.checkedam ? 1 : -1;
}

export const posicionsadapter: EntityAdapter<SesionPos> = createEntityAdapter<
  SesionPos
>({
  selectId: getSessionPosicionId,
  sortComparer: ordenaPorFechasSesionPosicion
});

export const positionInitialState: SessionPosState = posicionsadapter.getInitialState(
  {
    loadingPositions: false,
    addDialogShow: false,
    deleteDialogShow: false,
    selectedSessionPos: null
  }
);

export const {
  selectAll: getAllPositions,
  selectEntities: getPositionsEntities,
  selectIds: getPositionsIds,
  selectTotal: getPostionsTotal
} = posicionsadapter.getSelectors();
