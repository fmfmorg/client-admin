'use client'

import { useAppDispatch, useAppSelector } from "@store/hooks";
import { initData, IState } from "./slice";
import { useEffect } from "react";
import SignedInWrapper from "@components/signed-in-wrapper";
import Stack from "@mui/material/Stack";
import Header from "./header";
import FilterDialog from "./filter";
import SingleProducts from "./single-products";
import NewSetDialog from "./new-set";

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
                <NewSetDialog />
                </>
            ),
            header:<Header />
        }} />
    )
}

export default Pricing