'use client'

import { IState } from "@slices/products";
// import { useState } from "react";
import Grid from '@mui/material/Grid2'

const PrintLabels = (
    {
        csrf,
        initialState,
    }:{
        csrf:string;
        initialState:IState;
    }
) => {
    // const [csrfToken, setCsrfToken] = useState(csrf)
    return (
        <Grid container direction='row'>
            <Grid size={6} sx={{height:'100vh',overflowY:'auto'}}>{Array(100).fill(null).map((_,i)=>(<p>{i}</p>))}</Grid>
            <Grid size={6} sx={{height:'100vh',overflowY:'auto'}}>{Array(100).fill(null).map((_,i)=>(<p>{i}</p>))}</Grid>
        </Grid>
    )
}

export default PrintLabels