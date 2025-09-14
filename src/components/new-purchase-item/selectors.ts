import { createSelector } from "@reduxjs/toolkit"
import { RootState } from "@store/store"

const state = (state:RootState) => state
export const selectInternalProductIDs = createSelector([state],state=>{
    const {internalItems} = state.productsReducer
    if (!internalItems) return []

    return [...new Set(internalItems.map(e => e.internalSkuID))].sort()
})