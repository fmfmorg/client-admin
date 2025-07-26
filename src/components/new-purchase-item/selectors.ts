import { createSelector } from "@reduxjs/toolkit"
import { RootState } from "@store/store"

const state = (state:RootState) => state
export const selectInternalProductIDs = createSelector([state],state=>{
    const {internalItems} = state.productsReducer
    if (!internalItems) return []

    return internalItems.map(e => e.internalSkuID)
})
export const selectMovements = createSelector([state],state=>{
    const {inventoryMovements} = state.productsReducer
    if (!inventoryMovements) return []
    return inventoryMovements
})