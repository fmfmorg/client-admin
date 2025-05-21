'use client'

import { useAppDispatch, useAppSelector } from "@store/hooks";
import { initData, IState, selectMultiProductIDs, selectSingleProductIDs } from "./slice";
import { useEffect } from "react";
import SignedInWrapper from "@components/signed-in-wrapper";
import Stack from "@mui/material/Stack";
import ImageList from "@mui/material/ImageList";
import SingleProduct from "./single-products";
import Header from "./header";
import FilterDialog from "./filter";
import SingleProducts from "./single-products";

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
    const showSingles = useAppSelector(state => state.pricingReducer.showSingles)
    // const multiIDs = useAppSelector(selectMultiProductIDs)
    
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
                </Stack>
                <FilterDialog />
                </>
            ),
            header:<Header />
        }} />
    )
}

export default Pricing