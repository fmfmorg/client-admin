import { createSelector, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '@store/store';
import { IExternalItemPrice, IInternalItemSpecification, IProductTypeMapItem, IPurchaseRecordItem, ISkuMapItem, ISpecification } from 'src/interfaces';

export interface IState {
    internalCosts:IPurchaseRecordItem[];
    internalItemSpecs:IInternalItemSpecification[];
    metalColors:ISpecification[];
    productMainTypes:ISpecification[];
    productSubTypes:ISpecification[];
    productTypeMapItems:IProductTypeMapItem[];
    suppliers:ISpecification[];
    skuMapItems:ISkuMapItem[];
    externalPrices:IExternalItemPrice[];
}

export type IStateMaster = IState & {
    columns:number;
    showMetalColors:number[];
    showProductTypes:number[];
    showSuppliers:number[];
}

export const initialState:IStateMaster = {
    internalCosts:[],
    internalItemSpecs:[],
    metalColors:[],
    productMainTypes:[],
    productSubTypes:[],
    productTypeMapItems:[],
    suppliers:[],
    skuMapItems:[],
    externalPrices:[],
    columns:5,
    showMetalColors:[],
    showProductTypes:[],
    showSuppliers:[],
}

const slice = createSlice({
    name:'pricing',
    initialState,
    reducers:{
        initData:(state,action:PayloadAction<IState>)=>{
            state.internalCosts = [...action.payload.internalCosts]
            state.skuMapItems = [...action.payload.skuMapItems]
            state.internalItemSpecs = [...action.payload.internalItemSpecs]
            state.metalColors = [...action.payload.metalColors]
            state.productMainTypes = [...action.payload.productMainTypes]
            state.productSubTypes = [...action.payload.productSubTypes]
            state.productTypeMapItems = [...action.payload.productTypeMapItems]
            state.suppliers = [...action.payload.suppliers]
            state.externalPrices = [...action.payload.externalPrices]
        },
        updatePriceTemp:(state,action:PayloadAction<{id:string;price:number;}>)=>{
            const item = state.externalPrices.find(e => e.externalSkuID === action.payload.id)
            if (!!item) item.priceTemp = action.payload.price
        },
    },
})

const state = (state:RootState) => state
export const selectSingleProductIDs = createSelector([state],(state)=>{
    let itemSpecs = [...state.pricingReducer.internalItemSpecs]
    if (!!state.pricingReducer.showMetalColors.length) itemSpecs = itemSpecs.filter(e => state.pricingReducer.showMetalColors.includes(e.metalColorID))
    if (!!state.pricingReducer.showProductTypes.length) itemSpecs = itemSpecs.filter(e => state.pricingReducer.showProductTypes.includes(e.productTypeID))
    if (!!state.pricingReducer.showSuppliers.length) itemSpecs = itemSpecs.filter(e => state.pricingReducer.showSuppliers.includes(e.supplierID))

    const itemSpecsIDs = itemSpecs.map(e => e.internalSkuID)
    const matchingMapItems = state.pricingReducer.skuMapItems.filter(e=>itemSpecsIDs.includes(e.internal))
    if (!matchingMapItems.length) return []

    const uniqueExternalSkuIDs = [...new Set(matchingMapItems.map(e=>e.external))]
    return uniqueExternalSkuIDs.filter(e=>matchingMapItems.filter(f=>f.external===e).length === 1)
})
export const selectMultiProductIDs = createSelector([state],(state)=>{
    let itemSpecs = [...state.pricingReducer.internalItemSpecs]
    if (!!state.pricingReducer.showMetalColors.length) itemSpecs = itemSpecs.filter(e => state.pricingReducer.showMetalColors.includes(e.metalColorID))
    if (!!state.pricingReducer.showProductTypes.length) itemSpecs = itemSpecs.filter(e => state.pricingReducer.showProductTypes.includes(e.productTypeID))
    if (!!state.pricingReducer.showSuppliers.length) itemSpecs = itemSpecs.filter(e => state.pricingReducer.showSuppliers.includes(e.supplierID))

    const itemSpecsIDs = itemSpecs.map(e => e.internalSkuID)
    const matchingMapItems = state.pricingReducer.skuMapItems.filter(e=>itemSpecsIDs.includes(e.internal))
    if (!matchingMapItems.length) return []

    const uniqueExternalSkuIDs = [...new Set(matchingMapItems.map(e=>e.external))]
    return uniqueExternalSkuIDs.map(e=>({id:e,count:matchingMapItems.filter(f=>f.external===e).length})).filter(e=>e.count > 1).sort((a,b)=>a.count - b.count).map(e=>e.id)
})

export const {
    initData,
    updatePriceTemp,
} = slice.actions
export default slice.reducer