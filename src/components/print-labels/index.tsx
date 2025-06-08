'use client'

import { initData, IState } from "@slices/products";
import { useEffect, useState } from "react";
import Grid from '@mui/material/Grid2'
import { csrfBroadcastChannel } from "@misc";
import { CsrfContext } from "@context";
import { useAppDispatch } from "@store/hooks";
import Catalogue from "./catalogue";

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

        dispatch(initData(initialState))
    },[])
    
    return (
        <CsrfContext.Provider value={{csrfToken}}>
            <Grid container direction='row'>
                <Grid size={6} sx={{height:'100vh',overflowY:'auto'}}>{Array(100).fill(null).map((_,i)=>(<p>{i}</p>))}</Grid>
                <Catalogue />
            </Grid>
        </CsrfContext.Provider>
    )
}

export default PrintLabels