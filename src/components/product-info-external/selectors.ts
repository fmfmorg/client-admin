import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "@store/store";
import { IExternalItem } from "src/interfaces";

const state = (state:RootState) => state

export const externalIdSelector = createSelector([state],state=> (['',(state.productsReducer.externalItems as IExternalItem[]).map(e => e.externalSkuID).sort()]))