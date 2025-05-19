'use client'

import { useAppDispatch, useAppSelector } from "@store/hooks";
import { initData, IState, selectMultiProductIDs, selectSingleProductIDs } from "./slice";
import { useEffect } from "react";
import SignedInWrapper from "@components/signed-in-wrapper";
import Stack from "@mui/material/Stack";
import ImageList from "@mui/material/ImageList";
import SingleProduct from "./single-product";
import Header from "./header";

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
    const columns = useAppSelector(state => state.purchaseQuantityReducer.columns)
    const singleIDs = useAppSelector(selectSingleProductIDs)
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
                    <ImageList cols={columns} sx={{overflow:'hidden'}} gap={8}>
                        {singleIDs.map(id=>(
                            <SingleProduct key={id} id={id} />
                        ))}
                    </ImageList>
                </Stack>
                </>
            ),
            header:<Header />
        }} />
    )
}

export default Pricing