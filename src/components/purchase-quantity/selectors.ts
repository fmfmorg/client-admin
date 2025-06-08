import { createSelector } from "@reduxjs/toolkit"
import { RootState } from "@store/store"

const state = (state:RootState) => state
export const selectProductIDs = createSelector([state],(state)=>{
    const {internalItemSpecs,internalItems,showMetalColors,showProductTypes,showSuppliers,showMovementIDs} = state.productsReducer
    if (!internalItemSpecs || !internalItems || !showMetalColors || !showProductTypes || !showSuppliers || !showMovementIDs) return []

    let items = [...internalItems]

    let itemSpecs = [...internalItemSpecs]
    if (!!showMetalColors.length) itemSpecs = itemSpecs.filter(e => showMetalColors.includes(e.metalColorID))
    if (!!showProductTypes.length) itemSpecs = itemSpecs.filter(e => showProductTypes.includes(e.productTypeID))
    if (!!showSuppliers.length) itemSpecs = itemSpecs.filter(e => showSuppliers.includes(e.supplierID))

    const itemSpecsIDs = itemSpecs.map(e => e.internalSkuID)

    items = items.filter(e => itemSpecsIDs.includes(e.internalSkuID))

    if (!!showMovementIDs.length) items = items.filter(e => showMovementIDs.includes(e.movementID as number))

    return items.map(e=>e.internalSkuID)
})
export const selectSupplierList = createSelector([state],state=>state.productsReducer.suppliers || [])
export const selectMovementList = createSelector([state],state=>{
    if (!state.productsReducer.inventoryMovements) return []
    const movements = state.productsReducer.inventoryMovements.filter(e => e.movementTypeID === 1)
    return movements.map(e => ({id:e.movementID,name:new Date(e.receiptDT).toLocaleDateString('en-GB',{dateStyle:'short'})}))
})
export const selectMetalColorList = createSelector([state],state=>state.productsReducer.metalColors || [])
export const selectProductTypeList = createSelector([state],state=> {
    if (!state.productsReducer.productTypeMapItems || !state.productsReducer.productSubTypes) return []
    const subTypeList = state.productsReducer.productSubTypes
    return state.productsReducer.productTypeMapItems.map(({id,subTypeID}) => {
        const name = subTypeList.find(e => e.id === subTypeID)?.name || ''
        return {id,name}
    })
})