'use client'

import SignedInWrapper from "../signed-in-wrapper"
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { useEffect, useState } from "react";
import Stack from '@mui/material/Stack';
import ImageList from "@mui/material/ImageList";
import Product from "./product";
import FilterDialog from "./filter";
import EditDialog from "./edit";
import PurchaseQuantityControlBar from "./header";
import { initData, IState, preselectLatestPurchaseOrder } from "@slices/products";
import { selectProductIDs } from "./selectors";
// import { httpRequestHeader } from "@misc";

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
    const [loading,setLoading] = useState(true)
    const [loadingText,setLoadingText] = useState('LOADING...')

    // const init = async() => {
    //     try {
    //         const resp = await fetch('/api/admin/purchase-quantity-page-init',{
    //             headers:httpRequestHeader(false,'client',true,csrf),
    //             cache:'no-store',
    //         })
    //         const initialState = await resp.json() as IState
    //         dispatch(initData(initialState))
    //         setLoading(false)
    //     } catch (e) {
    //         const message = e instanceof Error ? e.message : String(e)
    //         setLoadingText(message)
    //     }
    // }

    useEffect(()=>{
        dispatch(preselectLatestPurchaseOrder())
        // init()
        dispatch(initData(initialState))
    },[])

    if (loading) return <div>{loadingText}</div>
    
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