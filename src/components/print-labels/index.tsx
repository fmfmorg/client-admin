'use client'

import { initData, IState, toggleShowNonPricedItems } from "@slices/products";
import { useEffect, useState } from "react";
import Grid from '@mui/material/Grid2'
import { csrfBroadcastChannel } from "@misc";
import { CsrfContext } from "@context";
import { useAppDispatch } from "@store/hooks";
import Catalogue from "./catalogue";
import LabelsToPrint from "./labels-to-print";

const PrintLabels = (
    {
        csrf,
        initialState,
    }:{
        csrf:string;
        initialState:IState;
    }
) => {
    const dispatch = useAppDispatch();
    const [csrfToken, setCsrfToken] = useState(csrf)
    
    useEffect(()=>{
        const csrfBcChannel = csrfBroadcastChannel()
        csrfBcChannel.postMessage(csrfToken)
        csrfBcChannel.onmessage = (ev:MessageEvent<string>) => setCsrfToken(ev.data)

        dispatch(toggleShowNonPricedItems())
        dispatch(initData(initialState))
    },[])
    
    return (
        <CsrfContext.Provider value={{csrfToken}}>
            <Grid container direction='row'>
                <LabelsToPrint />
                <Catalogue />
            </Grid>
        </CsrfContext.Provider>
    )
}

export default PrintLabels