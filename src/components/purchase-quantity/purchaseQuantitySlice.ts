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
}

export type IStateMaster = IState & {
    columns:number;
    editItemID:string;
    filterMode:boolean;
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
    columns:5,
    editItemID:'',
    filterMode:false,
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
    },
})

const state = (state:RootState) => state
export const selectProductIDs = createSelector([state],(state)=>{
    let items = [...state.purchaseQuantityReducer.internalItems]
    // const initialCount = items.length

    return items.map(e=>e.internalSkuID)
})

export const {
    initData,
    updateColumns,
    toggleEditDialog,
    updateQuantityTemp,
    toggleFilter,
} = slice.actions
export default slice.reducer