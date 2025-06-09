import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "@store/store";
import { IExternalItem, ISkuMapItem } from "src/interfaces";

const state = (state:RootState) => state
const getSelectedSKUs = (state:RootState) => {
    let items = (state.productsReducer.externalItems as IExternalItem[]).filter(e => !!e.labelQty)
    if (!items.length) return []
    return items.sort((a,b)=>a.dtUpdated - b.dtUpdated).map(e => e.externalSkuID)
}
export const selectSingleProductIDs = createSelector([state],state => {
    const skus = getSelectedSKUs(state)
    if (!skus.length) return []
    const mapItems = state.productsReducer.skuMapItems as ISkuMapItem[]
    return skus.filter(e => mapItems.filter(d => d.external === e).length === 1)
})
export const selectSetProductIDs = createSelector([state],state => {
    const skus = getSelectedSKUs(state)
    if (!skus.length) return []
    const mapItems = state.productsReducer.skuMapItems as ISkuMapItem[]
    return skus.filter(e => mapItems.filter(d => d.external === e).length > 1)
})