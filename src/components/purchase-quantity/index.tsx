'use client'

import SignedInWrapper from "../signed-in-wrapper"
import { initData, IState, selectProductIDs } from "./purchaseQuantitySlice";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { useEffect } from "react";
import Stack from '@mui/material/Stack';
import ImageList from "@mui/material/ImageList";
import Product from "./product";
import FilterDialog from "./filter";

const UpdatePurchaseQuantity = (
    {
        csrf,
        initialState,
    }:{
        csrf:string;
        initialState:IState;
    }
) => {
    const dispatch = useAppDispatch();
    const ids = useAppSelector(selectProductIDs)
    const columns = useAppSelector(state => state.purchaseQuantityReducer.columns)

    useEffect(()=>{
        dispatch(initData(initialState))
    },[])
    
    return (
        <SignedInWrapper {...{csrf,isPurchaseQuantityPage:true}}>
            <Stack direction='column'>
                <ImageList cols={columns} sx={{overflow:'hidden'}} gap={8}>
                    {ids.map(id=>(
                        <Product key={id} id={id} />
                    ))}
                </ImageList>
            </Stack>
            <FilterDialog />
        </SignedInWrapper>
    )
}

export default UpdatePurchaseQuantity