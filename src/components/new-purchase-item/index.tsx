'use client'

import SignedInWrapper from "@components/signed-in-wrapper";
import { initData, IState, preselectLatestPurchaseOrder } from "@slices/products";
import { useAppDispatch } from "@store/hooks";
import { useEffect } from "react";
import Form from "./master-form";

const NewPurchaseItem = (
    {
        csrf,
        _external,
        _internal,
        initialState,
    }:{
        csrf:string;
        _external:string;
        _internal:string;
        initialState:IState;
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
            children:<Form {...{_external,_internal}} />
        }} />
    )
}

export default NewPurchaseItem