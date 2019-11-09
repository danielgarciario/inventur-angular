import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Kandidato } from 'src/app/models/kandidato.model';

export interface KandidatosState extends EntityState<Kandidato> {
  loadingKandidatos: boolean;
  selectedKandidate: Kandidato;
}

function getKandidatoId(k: Kandidato): string {
  return k.lagerort.regal + k.lagerort.lagerplatz + k.articulo.artikelnr;
}

export const kandidatosadapter: EntityAdapter<Kandidato> = createEntityAdapter<
  Kandidato
>({ selectId: getKandidatoId });

export const kandidatoInitialState: KandidatosState = kandidatosadapter.getInitialState(
  {
    loadingKandidatos: false,
    selectedKandidate: null
  }
);

export const {
  selectAll: getAllKandidatos,
  selectEntities: getKandidatosEntities,
  // selectIds: getPositionsIds,
  selectTotal: getKandidatosTotal
} = kandidatosadapter.getSelectors();
