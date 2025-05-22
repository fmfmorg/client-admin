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
    filterMode:boolean;
    newSetMode:boolean;
    showSingles:boolean;
    showSets:boolean;
    showPricedItems:boolean;
    showNonPricedItems:boolean;
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
    filterMode:false,
    newSetMode:false,
    showSingles:true,
    showSets:true,
    showPricedItems:true,
    showNonPricedItems:true,
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
        pricesUpdated:(state,_:PayloadAction<undefined>)=>{
            const items = state.externalPrices.filter(e=> e.price !== e.priceTemp)

            for (const item of items){
                item.price = item.priceTemp
            }
        },
        updateColumns:(state,action:PayloadAction<number>)=>{
            state.columns = action.payload
        },
        toggleFilter:(state,_:PayloadAction<undefined>) => {state.filterMode = !state.filterMode},
        toggleNewSetDialog:(state,_:PayloadAction<undefined>) => {state.newSetMode = !state.newSetMode},
        updateShowMetalColor:(state,action:PayloadAction<number[]>)=>{
            state.showMetalColors = [...action.payload]
        },
        updateProductType:(state,action:PayloadAction<number[]>)=>{
            state.showProductTypes = [...action.payload]
        },
        toggleShowSingles:(state,_:PayloadAction<undefined>)=>{
            state.showSingles = !state.showSingles
        },
        toggleShowSets:(state,_:PayloadAction<undefined>)=>{
            state.showSets = !state.showSets
        },
        toggleShowPricedItems:(state,_:PayloadAction<undefined>)=>{
            state.showPricedItems = !state.showPricedItems
        },
        toggleShowNonPricedItems:(state,_:PayloadAction<undefined>)=>{
            state.showNonPricedItems = !state.showNonPricedItems
        },
        newSetCreated:(state,action:PayloadAction<{externalSkuID:string;internalSkuIDs:string[];price:number}>)=>{
            const skuMapItems:ISkuMapItem[] = action.payload.internalSkuIDs.map(e=>({external:action.payload.externalSkuID,internal:e}))
            state.skuMapItems = [...state.skuMapItems, ...skuMapItems]

            state.externalPrices = [...state.externalPrices,{
                externalSkuID:action.payload.externalSkuID,
                price:action.payload.price,
                priceTemp:action.payload.price,
            }]
        },
    },
})

const state = (state:RootState) => state
export const selectSingleProductIDs = createSelector([state],(state)=>{
    if (!state.pricingReducer.showPricedItems && !state.pricingReducer.showNonPricedItems) return []

    let itemSpecs = [...state.pricingReducer.internalItemSpecs]
    if (!!state.pricingReducer.showMetalColors.length) itemSpecs = itemSpecs.filter(e => state.pricingReducer.showMetalColors.includes(e.metalColorID))
    if (!!state.pricingReducer.showProductTypes.length) itemSpecs = itemSpecs.filter(e => state.pricingReducer.showProductTypes.includes(e.productTypeID))
    // if (!!state.pricingReducer.showSuppliers.length) itemSpecs = itemSpecs.filter(e => state.pricingReducer.showSuppliers.includes(e.supplierID))

    const itemSpecsIDs = itemSpecs.map(e => e.internalSkuID)
    const matchingMapItems = state.pricingReducer.skuMapItems.filter(e=>itemSpecsIDs.includes(e.internal))
    if (!matchingMapItems.length) return []

    const uniqueExternalSkuIDs = [...new Set(matchingMapItems.map(e=>e.external))]
    const matchingSKUs = uniqueExternalSkuIDs.filter(e=>matchingMapItems.filter(f=>f.external===e).length === 1)
    
    if (state.pricingReducer.showPricedItems && state.pricingReducer.showNonPricedItems) return matchingSKUs
    else {
        const priceList = state.pricingReducer.externalPrices.filter(e=>matchingSKUs.includes(e.externalSkuID))          
        if (state.pricingReducer.showPricedItems) return priceList.filter(e=>!!e.price).map(e=>e.externalSkuID)
        else return priceList.filter(e=>!e.price).map(e=>e.externalSkuID)
    }
})
export const selectMultiProductIDs = createSelector([state],(state)=>{
    if (!state.pricingReducer.showPricedItems && !state.pricingReducer.showNonPricedItems) return []

    let itemSpecs = [...state.pricingReducer.internalItemSpecs]
    if (!!state.pricingReducer.showMetalColors.length) itemSpecs = itemSpecs.filter(e => state.pricingReducer.showMetalColors.includes(e.metalColorID))
    if (!!state.pricingReducer.showProductTypes.length) itemSpecs = itemSpecs.filter(e => state.pricingReducer.showProductTypes.includes(e.productTypeID))
    // if (!!state.pricingReducer.showSuppliers.length) itemSpecs = itemSpecs.filter(e => state.pricingReducer.showSuppliers.includes(e.supplierID))

    const itemSpecsIDs = itemSpecs.map(e => e.internalSkuID)
    const matchingMapItems = state.pricingReducer.skuMapItems.filter(e=>itemSpecsIDs.includes(e.internal))
    if (!matchingMapItems.length) return []

    const uniqueExternalSkuIDs = [...new Set(matchingMapItems.map(e=>e.external))]
    const matchingSKUs = uniqueExternalSkuIDs.map(e=>({id:e,count:matchingMapItems.filter(f=>f.external===e).length})).filter(e=>e.count > 1).map(e=>e.id)
    const priceList = state.pricingReducer.externalPrices.filter(e=>matchingSKUs.includes(e.externalSkuID)).sort((a,b)=>a.price - b.price)

    if (state.pricingReducer.showPricedItems && state.pricingReducer.showNonPricedItems) return priceList.map(e=>e.externalSkuID)
    else {
        if (state.pricingReducer.showPricedItems) return priceList.filter(e=>!!e.price).map(e=>e.externalSkuID)
        else return priceList.filter(e=>!e.price).map(e=>e.externalSkuID)
    }
})
export const selectMetalColorList = createSelector([state],state=>state.pricingReducer.metalColors)
export const selectProductTypeList = createSelector([state],state=> {
    const subTypeList = state.pricingReducer.productSubTypes
    return state.pricingReducer.productTypeMapItems.map(({id,subTypeID}) => {
        const name = subTypeList.find(e => e.id === subTypeID)?.name || ''
        return {id,name}
    })
})
export const selectAllInternalSKUs = createSelector([state],state=>state.pricingReducer.internalCosts.map(e=>e.internalSkuID).sort())

export const {
    initData,
    updatePriceTemp,
    pricesUpdated,
    updateColumns,
    toggleFilter,
    toggleNewSetDialog,
    updateShowMetalColor,
    updateProductType,
    toggleShowSets,
    toggleShowSingles,
    toggleShowPricedItems,
    toggleShowNonPricedItems,
    newSetCreated,
} = slice.actions
export default slice.reducer