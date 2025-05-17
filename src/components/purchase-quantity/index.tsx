'use client'

import SignedInWrapper from "../signed-in-wrapper"
import { initData, IState, selectProductIDs } from "./purchaseQuantitySlice";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { useEffect } from "react";
import Stack from '@mui/material/Stack';

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

    useEffect(()=>{
        dispatch(initData(initialState))
    },[])
    
    return (
        <SignedInWrapper {...{csrf}}>
            <Stack direction='column'>
                <pre>{JSON.stringify(ids)}</pre>
                {/* <ImageList cols={4} sx={{overflow:'hidden'}} gap={8}>
                    <></>
                </ImageList> */}
            </Stack>
        </SignedInWrapper>
    )
}

export default UpdatePurchaseQuantity