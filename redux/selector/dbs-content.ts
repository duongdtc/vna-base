import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@store/all-reducers';

export const selectListSpecializeNews = createSelector(
  (state: RootState) => state.dbsContent,
  dbsContent => dbsContent.SpecializedNews,
);

export const selectOutStandingPolicy = createSelector(
  (state: RootState) => state.dbsContent,
  dbsContent => dbsContent.OutStandingPolicy,
);

export const selectLoadingSpecializeNews = createSelector(
  (state: RootState) => state.dbsContent,
  dbsContent => dbsContent.loadingSpecializeNews,
);

export const selectLoadingPolicy = createSelector(
  (state: RootState) => state.dbsContent,
  dbsContent => dbsContent.loadingPolicy,
);

export const selectDetailDBSContent = (id: string) =>
  createSelector(
    (state: RootState) => state.dbsContent,
    dbsContent => dbsContent.detailContent[id],
  );
