import { createSelector } from "@reduxjs/toolkit"
import { RootState } from "@store/store"
import { IExternalItem, IProductTypeMapItem, IPurchaseRecordItem, ISkuMapItem } from "src/interfaces"

const state = (state:RootState) => state

const getUniqueExternalSkus = (state:RootState) => {
    const {internalItemSpecs,showMetalColors,showProductTypes,showSuppliers,skuMapItems,showMovementIDs,internalItems} = state.productsReducer
    if (!internalItemSpecs || !showMetalColors || !showProductTypes || !showSuppliers || !skuMapItems || !showMovementIDs || !internalItems) return []

    let itemSpecs = [...internalItemSpecs]
    if (!!showMetalColors.length) itemSpecs = itemSpecs.filter(e => showMetalColors.includes(e.metalColorID))
    if (!!showProductTypes.length) itemSpecs = itemSpecs.filter(e => showProductTypes.includes(e.productTypeID))
    if (!!showSuppliers.length) itemSpecs = itemSpecs.filter(e => showSuppliers.includes(e.supplierID))
    if (!!showMovementIDs.length) {
        const matchingInternalSkus = internalItems.filter(e => showMovementIDs.includes(e.movementID)).map(e => e.internalSkuID)
        itemSpecs = itemSpecs.filter(e => matchingInternalSkus.includes(e.internalSkuID))
    }

    const itemSpecsIDs = itemSpecs.map(e => e.internalSkuID)
    const matchingMapItems = skuMapItems.filter(e=>itemSpecsIDs.includes(e.internal))
    if (!matchingMapItems.length) return []

    return [...new Set(matchingMapItems.map(e=>e.external))]
}

export const selectSingleProductIDs = createSelector([state],(state)=>{
    const uniqueExternalSkuIDs = getUniqueExternalSkus(state)
    if (!uniqueExternalSkuIDs.length) return []

    const matchingSKUs = uniqueExternalSkuIDs.filter(e=>(state.productsReducer.skuMapItems as ISkuMapItem[]).filter(f=>f.external===e).length === 1)
    
    if (state.productsReducer.showPricedItems && state.productsReducer.showNonPricedItems) return matchingSKUs.sort().reverse()
    else {
        const priceList = (state.productsReducer.externalItems as IExternalItem[]).filter(e=>matchingSKUs.includes(e.externalSkuID))         
        if (state.productsReducer.showPricedItems) return priceList.filter(e=>!!e.price).map(e=>e.externalSkuID).sort().reverse()
        else return priceList.filter(e=>!e.price).map(e=>e.externalSkuID).sort().reverse()
    }
})
export const selectMultiProductIDs = createSelector([state],(state)=>{
    const uniqueExternalSkuIDs = getUniqueExternalSkus(state)
    if (!uniqueExternalSkuIDs.length) return []

    const matchingSKUs = uniqueExternalSkuIDs.map(e=>({id:e,count:(state.productsReducer.skuMapItems as ISkuMapItem[]).filter(f=>f.external===e).length})).filter(e=>e.count > 1).map(e=>e.id)
    const priceList = (state.productsReducer.externalItems as IExternalItem[]).filter(e=>matchingSKUs.includes(e.externalSkuID)).sort((a,b)=>a.price - b.price)

    if (state.productsReducer.showPricedItems && state.productsReducer.showNonPricedItems) return priceList.map(e=>e.externalSkuID).sort().reverse()
    else {
        if (state.productsReducer.showPricedItems) return priceList.filter(e=>!!e.price).map(e=>e.externalSkuID).sort().reverse()
        else return priceList.filter(e=>!e.price).map(e=>e.externalSkuID).sort().reverse()
    }
})
export const selectMetalColorList = createSelector([state],state=>state.productsReducer.metalColors || [])
export const selectProductTypeList = createSelector([state],state=> {
    const subTypeList = state.productsReducer.productSubTypes || []
    return (state.productsReducer.productTypeMapItems as IProductTypeMapItem[]).map(({id,subTypeID}) => {
        const name = subTypeList.find(e => e.id === subTypeID)?.name || ''
        return {id,name}
    })
})
export const selectSupplierList = createSelector([state],state=>state.productsReducer.suppliers || [])
export const selectAllInternalSKUs = createSelector([state],state=>(state.productsReducer.internalItems as IPurchaseRecordItem[]).map(e=>e.internalSkuID).sort())