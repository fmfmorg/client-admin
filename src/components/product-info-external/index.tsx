'use client'

import SignedInWrapper from "@components/signed-in-wrapper";
import { initData, IState } from "@slices/products";
import { useAppDispatch } from "@store/hooks";
import { useEffect } from "react";
import Content from "./content";

const ProductInfoExternal = (
    {
        csrf,
        initialState,
    }:{
        csrf:string;
        initialState:IState;
    }
) => {
    const dispatch = useAppDispatch();

    useEffect(()=>{
        dispatch(initData(initialState))
    },[])
    
    return (
        <SignedInWrapper {...{
            csrf,
            children:(<Content />)
        }} />
    )
}

export default ProductInfoExternal