import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IExternalItem, IInternalItemSpecification, IInternalMovementRecord, IProductTypeMapItem, IPurchaseRecordItem, ISkuMapItem, ISpecification } from "src/interfaces";

export interface IState {
    internalItems?:IPurchaseRecordItem[];
    inventoryMovements?:IInternalMovementRecord[];
    internalItemSpecs?:IInternalItemSpecification[];
    metalColors?:ISpecification[];
    productMainTypes?:ISpecification[];
    productSubTypes?:ISpecification[];
    productTypeMapItems?:IProductTypeMapItem[];
    suppliers?:ISpecification[];
    skuMapItems?:ISkuMapItem[];
    externalItems?:IExternalItem[];
    columns?:number;
    filterMode?:boolean;
    showMovementIDs?:number[];
    showMetalColors?:number[];
    showProductTypes?:number[];
    showSuppliers?:number[];
    showSingles?:boolean;
    showSets?:boolean;
    showPricedItems?:boolean;
    showNonPricedItems?:boolean;
    editItemID?:string;
    newSetMode?:boolean;
    preselectLatestPurchaseOrder:boolean;
}

export const initialState:IState = {
    internalItems:[],
    inventoryMovements:[],
    internalItemSpecs:[],
    metalColors:[],
    productMainTypes:[],
    productSubTypes:[],
    productTypeMapItems:[],
    suppliers:[],
    skuMapItems:[],
    externalItems:[],
    columns:5,
    filterMode:false,
    showMovementIDs:[],
    showMetalColors:[],
    showProductTypes:[],
    showSuppliers:[],
    showSingles:true,
    showSets:true,
    showPricedItems:true,
    showNonPricedItems:true,
    editItemID:'',
    newSetMode:false,
    preselectLatestPurchaseOrder:false,
}

const slice = createSlice({
    name:'products',
    initialState,
    reducers:{
        initData:(state,action:PayloadAction<IState>)=>{
            if (!!action.payload.internalItems && !!action.payload.internalItems.length) state.internalItems = [...action.payload.internalItems];
            if (!!action.payload.internalItemSpecs && !!action.payload.internalItemSpecs.length) state.internalItemSpecs = [...action.payload.internalItemSpecs];
            if (!!action.payload.metalColors && !!action.payload.metalColors.length) state.metalColors = [...action.payload.metalColors];
            if (!!action.payload.productMainTypes && !!action.payload.productMainTypes.length) state.productMainTypes = [...action.payload.productMainTypes];
            if (!!action.payload.productSubTypes && !!action.payload.productSubTypes.length) state.productSubTypes = [...action.payload.productSubTypes];
            if (!!action.payload.productTypeMapItems && !!action.payload.productTypeMapItems.length) state.productTypeMapItems = [...action.payload.productTypeMapItems];
            if (!!action.payload.suppliers && !!action.payload.suppliers.length) state.suppliers = [...action.payload.suppliers];
            if (!!action.payload.skuMapItems && !!action.payload.skuMapItems.length) state.skuMapItems = [...action.payload.skuMapItems];
            if (!!action.payload.externalItems && !!action.payload.externalItems.length) state.externalItems = [...action.payload.externalItems];
            if (!!action.payload.showMovementIDs && !!action.payload.showMovementIDs.length) state.showMovementIDs = [...action.payload.showMovementIDs];
            if (!!action.payload.showMetalColors && !!action.payload.showMetalColors.length) state.showMetalColors = [...action.payload.showMetalColors];
            if (!!action.payload.showProductTypes && !!action.payload.showProductTypes.length) state.showProductTypes = [...action.payload.showProductTypes];
            if (!!action.payload.showSuppliers && !!action.payload.showSuppliers.length) state.showSuppliers = [...action.payload.showSuppliers];
            if (!!action.payload.inventoryMovements && !!action.payload.inventoryMovements.length) {
                state.inventoryMovements = [...action.payload.inventoryMovements];
                if (state.preselectLatestPurchaseOrder && (!state.showMovementIDs || !state.showMovementIDs.length)) {
                    let purchaseOrders = state.inventoryMovements.filter(e => e.movementTypeID === 1)
                    if (!!purchaseOrders.length) {
                        purchaseOrders.sort((a,b)=>b.receiptDT - a.receiptDT)
                        state.showMovementIDs = [purchaseOrders[0].movementID]
                    }
                }
            }
        },
        updatePriceTemp:(state,action:PayloadAction<{id:string;price:number;}>)=>{
            if (!state.externalItems) return
            const item = state.externalItems.find(e => e.externalSkuID === action.payload.id)
            if (!!item) item.priceTemp = action.payload.price
        },
        updateQuantityReceivedTemp:(state,action:PayloadAction<{id:number;qty:number}>)=>{
            if (!state.internalItems) return
            const item = state.internalItems.find(e => e.id === action.payload.id)
            if (!!item) item.quantityTemp = action.payload.qty
        },
        updateQuantityPurchasedTemp:(state,action:PayloadAction<{id:number;qty:number}>)=>{
            if (!state.internalItems) return
            const item = state.internalItems.find(e => e.id === action.payload.id)
            if (!!item) item.purchaseQuantityTemp = action.payload.qty
        },
        pricesUpdated:(state,_:PayloadAction<undefined>)=>{
            if (!state.externalItems) return
            const items = state.externalItems.filter(e=> e.price !== e.priceTemp)

            for (const item of items){
                item.price = item.priceTemp
            }
        },
        updateColumns:(state,action:PayloadAction<number>)=>{
            state.columns = action.payload
        },
        toggleFilter:(state,_:PayloadAction<undefined>) => {state.filterMode = !state.filterMode},
        updateShowMetalColor:(state,action:PayloadAction<number[]>)=>{
            state.showMetalColors = [...action.payload]
        },
        updateProductType:(state,action:PayloadAction<number[]>)=>{
            state.showProductTypes = [...action.payload]
        },
        updateSuppliers:(state,action:PayloadAction<number[]>)=>{
            state.showSuppliers = [...action.payload]
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
            if (!state.skuMapItems || !state.externalItems) return
            const skuMapItems:ISkuMapItem[] = action.payload.internalSkuIDs.map(e=>({external:action.payload.externalSkuID,internal:e}))
            state.skuMapItems = [...state.skuMapItems, ...skuMapItems]

            state.externalItems = [...state.externalItems,{
                externalSkuID:action.payload.externalSkuID,
                price:action.payload.price,
                priceTemp:action.payload.price,
                labelQty:0,
                dtUpdated:0,
            }]
        },
        updateItemSpec:(state,action:PayloadAction<{
            metalColor:number;
            productType:number;
            imgPath:string;
        }>)=>{
            if (!state.internalItemSpecs) return
            const item = state.internalItemSpecs.find(e => e.internalSkuID === state.editItemID)
            if (!item) return
            item.metalColorID = action.payload.metalColor
            item.productTypeID = action.payload.productType
            item.image = action.payload.imgPath
        },
        quantityReceivedUpdated:(state,_:PayloadAction<undefined>)=>{
            if (!state.internalItems) return
            const items = state.internalItems.filter(e => e.quantity !== e.quantityTemp)

            for (const item of items){
                item.quantity = item.quantityTemp
            }
        },
        quantityPurchasedUpdated:(state,_:PayloadAction<undefined>)=>{
            if (!state.internalItems) return
            const items = state.internalItems.filter(e => e.purchaseQuantity !== e.purchaseQuantityTemp)

            for (const item of items){
                item.purchaseQuantity = item.purchaseQuantityTemp
            }
        },
        toggleEditDialog:(state,action:PayloadAction<string>)=>{
            state.editItemID = action.payload
        },
        updateMovements:(state,action:PayloadAction<number[]>)=>{
            state.showMovementIDs = [...action.payload]
        },
        toggleNewSetDialog:(state,_:PayloadAction<undefined>) => {state.newSetMode = !state.newSetMode},
        updateLabelQty:(state,action:PayloadAction<{id:string,qty:number}>)=>{
            if (!state.externalItems) return
            const item = state.externalItems.find(e => e.externalSkuID === action.payload.id)
            if (!item) return
            if (!item.labelQty) item.dtUpdated = Date.now()
            item.labelQty = action.payload.qty
        },
        preselectLatestPurchaseOrder:(state,_:PayloadAction<undefined>)=>{
            state.preselectLatestPurchaseOrder = true
        },
        labelsAddCurrentViewItemsWithLatestReceivedQuantity:(state,action:PayloadAction<string[]>)=>{
            if (!action.payload.length || !state.inventoryMovements || !state.internalItems || !state.skuMapItems || !state.externalItems) return
            const dt = Date.now()
            const externalSkuIDs = action.payload
            const skuMapItems = state.skuMapItems
            let purchaseOrders = state.inventoryMovements.filter(e => e.movementTypeID === 1) 
            purchaseOrders.sort((a,b)=>b.receiptDT - a.receiptDT)
            const latestPurchaseOrderID = purchaseOrders[0].movementID
            const internalSKUs = state.internalItems.filter(e => e.movementID === latestPurchaseOrderID)
            if (!internalSKUs.length) return

            for (const externalSkuID of externalSkuIDs) {
                const item = state.externalItems.find(e => e.externalSkuID === externalSkuID)
                if (!item) continue

                const matchingInternalSKUs = skuMapItems.filter(e => e.external === externalSkuID).map(e => e.internal)
                if (!matchingInternalSKUs.length) continue
                const minQtyReceived = Math.min(...internalSKUs.filter(e => matchingInternalSKUs.includes(e.internalSkuID)).map(e => e.quantity))
                if (!minQtyReceived) continue
                if (!item.labelQty) item.dtUpdated = dt
                item.labelQty = minQtyReceived
            }
        },
    },
})

export const {
    initData,
    updateColumns,
    updateItemSpec,
    updatePriceTemp,
    updateProductType,
    updateQuantityPurchasedTemp,
    updateQuantityReceivedTemp,
    updateShowMetalColor,
    updateSuppliers,
    pricesUpdated,
    quantityReceivedUpdated,
    quantityPurchasedUpdated,
    toggleFilter,
    toggleShowNonPricedItems,
    toggleShowPricedItems,
    toggleShowSets,
    toggleShowSingles,
    newSetCreated,
    toggleEditDialog,
    updateMovements,
    toggleNewSetDialog,
    updateLabelQty,
    preselectLatestPurchaseOrder,
    labelsAddCurrentViewItemsWithLatestReceivedQuantity,
} = slice.actions
export default slice.reducer