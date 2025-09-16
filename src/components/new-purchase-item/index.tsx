'use client'

import SignedInWrapper from "@components/signed-in-wrapper";
import { initData, IState, preselectLatestPurchaseOrder } from "@slices/products";
import { useAppDispatch } from "@store/hooks";
import { useEffect } from "react";
import Form from "./master-form";
import { IProductSupplierItem } from "src/interfaces";

const NewPurchaseItem = (
    {
        csrf,
        _external,
        _internal,
        initialState,
        _productSupplierItems,
    }:{
        csrf:string;
        _external:string;
        _internal:string;
        initialState:IState;
        _productSupplierItems:IProductSupplierItem[];
    }
) => {
    const dispatch = useAppDispatch();

    useEffect(()=>{
        dispatch(preselectLatestPurchaseOrder())
        dispatch(initData(initialState))
    },[])

    return (
        <SignedInWrapper {...{
            csrf,
            children:<Form {...{_external,_internal,_productSupplierItems}} />
        }} />
    )
}

export default NewPurchaseItem