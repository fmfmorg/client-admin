'use client'

import { useAppDispatch, useAppSelector } from "@store/hooks";
import { useEffect } from "react";
import SignedInWrapper from "@components/signed-in-wrapper";
import Stack from "@mui/material/Stack";
import Header from "./header";
import FilterDialog from "./filter";
import SingleProducts from "./single-products";
import NewSetDialog from "./new-set";
import SetProducts from "./set-products";
import { initData, IState } from "@slices/products";

const Pricing = (
    {
        csrf,
        initialState,
    }:{
        csrf:string;
        initialState:IState;
    }
) => {
    const dispatch = useAppDispatch();
    const showSingles = useAppSelector(state => !!state.productsReducer.showSingles)
    const showSets = useAppSelector(state => !!state.productsReducer.showSets)
    
    useEffect(()=>{
        dispatch(initData(initialState))
    },[])
    
    return (
        <SignedInWrapper {...{
            csrf,
            children:(
                <>
                <Stack direction='column'>
                    {showSingles && <SingleProducts />}
                    {showSets && <SetProducts />}
                </Stack>
                <FilterDialog />
                <NewSetDialog />
                </>
            ),
            header:<Header />
        }} />
    )
}

export default Pricing