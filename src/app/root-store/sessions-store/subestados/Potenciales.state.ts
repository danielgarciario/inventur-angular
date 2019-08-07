import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Artikel } from 'src/app/models/artikel.model';
import { SessionsState } from './Sesions.state';

export interface PotencialesState extends EntityState<Artikel> {
  loadingPotencials: boolean;
  selectedPotencial: Artikel;
}

function getpotencialId(a: Artikel): string {
  return a.artikelnr;
}

export const potencialadapter: EntityAdapter<Artikel> = createEntityAdapter<
  Artikel
>({
  selectId: getpotencialId
});

export const potencialInitialState: PotencialesState = potencialadapter.getInitialState(
  {
    loadingPotencials: false,
    selectedPotencial: null
  }
);

export const {
  selectAll: getAllPotencials,
  selectEntities: getPotencialsEntities,
  selectIds: getPotencialId,
  selectTotal: getPotencialsTotal
} = potencialadapter.getSelectors();
