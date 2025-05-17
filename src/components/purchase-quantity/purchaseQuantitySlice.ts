import { createSelector, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '@store/store';
import { IInternalItemSpecification, IInternalMovementRecord, IProductTypeMapItem, IPurchaseRecordItem, ISpecification } from 'src/interfaces';

export interface IState {
    internalItems:IPurchaseRecordItem[];
    inventoryMovements:IInternalMovementRecord[];
    internalItemSpecs:IInternalItemSpecification[];
    metalColors:ISpecification[];
    productMainTypes:ISpecification[];
    productSubTypes:ISpecification[];
    productTypeMapItems:IProductTypeMapItem[];
    suppliers:ISpecification[];
}

export type IStateMaster = IState & {
    columns:number;
    editItemID:string;
    filterMode:boolean;
    showMovementIDs:number[];
    showMetalColors:number[];
    showProductTypes:number[];
    showSuppliers:number[];
}

export const initialState:IStateMaster = {
    internalItems:[],
    inventoryMovements:[],
    internalItemSpecs:[],
    metalColors:[],
    productMainTypes:[],
    productSubTypes:[],
    productTypeMapItems:[],
    suppliers:[],
    columns:5,
    editItemID:'',
    filterMode:false,
    showMovementIDs:[],
    showMetalColors:[],
    showProductTypes:[],
    showSuppliers:[],
}

const slice = createSlice({
    name:'purchaseQuantity',
    initialState,
    reducers:{
        initData:(state,action:PayloadAction<IState>)=>{
            state.internalItems = [...action.payload.internalItems]
            state.inventoryMovements = [...action.payload.inventoryMovements]
            state.internalItemSpecs = [...action.payload.internalItemSpecs]
            state.metalColors = [...action.payload.metalColors]
            state.productMainTypes = [...action.payload.productMainTypes]
            state.productSubTypes = [...action.payload.productSubTypes]
            state.productTypeMapItems = [...action.payload.productTypeMapItems]
            state.suppliers = [...action.payload.suppliers]
        },
        updateColumns:(state,action:PayloadAction<number>)=>{
            state.columns = action.payload
        },
        toggleEditDialog:(state,action:PayloadAction<string>)=>{
            state.editItemID = action.payload
        },
        updateQuantityTemp:(state,action:PayloadAction<{id:string;qty:number}>)=>{
            const item = state.internalItems.find(e => e.internalSkuID === action.payload.id)
            if (!!item) item.quantityTemp = action.payload.qty
        },
        toggleFilter:(state,_:PayloadAction<undefined>) => {state.filterMode = !state.filterMode},
        updateSuppliers:(state,action:PayloadAction<number[]>)=>{
            state.showSuppliers = [...action.payload]
        },
        updateMovements:(state,action:PayloadAction<number[]>)=>{
            state.showMovementIDs = [...action.payload]
        },
        updateShowMetalColor:(state,action:PayloadAction<number[]>)=>{
            state.showMetalColors = [...action.payload]
        },
    },
})

const state = (state:RootState) => state
export const selectProductIDs = createSelector([state],(state)=>{
    let items = [...state.purchaseQuantityReducer.internalItems]
    // const initialCount = items.length

    return items.map(e=>e.internalSkuID)
})
export const selectSupplierList = createSelector([state],state=>state.purchaseQuantityReducer.suppliers)
export const selectMovementList = createSelector([state],state=>{
    const movements = state.purchaseQuantityReducer.inventoryMovements.filter(e => e.movementTypeID === 1)
    return movements.map(e => ({id:e.movementID,name:new Date(e.receiptDT).toLocaleDateString('en',{dateStyle:'short'})}))
})
export const selectMetalColorList = createSelector([state],state=>state.purchaseQuantityReducer.metalColors)

export const {
    initData,
    updateColumns,
    toggleEditDialog,
    updateQuantityTemp,
    toggleFilter,
    updateSuppliers,
    updateMovements,
    updateShowMetalColor,
} = slice.actions
export default slice.reducer