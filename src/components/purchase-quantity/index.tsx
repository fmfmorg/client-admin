'use client'

import SignedInWrapper from "../signed-in-wrapper"
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { useEffect } from "react";
import Stack from '@mui/material/Stack';
import ImageList from "@mui/material/ImageList";
import Product from "./product";
import FilterDialog from "./filter";
import EditDialog from "./edit";
import PurchaseQuantityControlBar from "./header";
import { initData, IState, preselectLatestPurchaseOrder } from "@slices/products";
import { selectProductIDs } from "./selectors";

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
    const columns = useAppSelector(state => state.productsReducer.columns)

    useEffect(()=>{
        dispatch(preselectLatestPurchaseOrder())
        dispatch(initData(initialState))
    },[])
    
    return (
        <SignedInWrapper {...{
            csrf,
            children:(
                <>
                <Stack direction='column'>
                    <ImageList cols={columns} sx={{overflow:'hidden'}} gap={8}>
                        {ids.map(id=>(
                            <Product key={id} id={id} />
                        ))}
                    </ImageList>
                </Stack>
                <FilterDialog />
                <EditDialog />
                </>
            ),
            header:<PurchaseQuantityControlBar />
        }} />
    )
}

export default UpdatePurchaseQuantity