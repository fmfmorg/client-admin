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

export const initialState:IState = {
    internalItems:[],
    inventoryMovements:[],
    internalItemSpecs:[],
    metalColors:[],
    productMainTypes:[],
    productSubTypes:[],
    productTypeMapItems:[],
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
} = slice.actions
export default slice.reducer