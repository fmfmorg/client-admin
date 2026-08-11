'use client'

import { useAppDispatch, useAppSelector } from "@store/hooks";
import { useEffect, useState } from "react";
import SignedInWrapper from "@components/signed-in-wrapper";
import Stack from "@mui/material/Stack";
import Header from "./header";
import FilterDialog from "./filter";
import SingleProducts from "./single-products";
import NewSetDialog from "./new-set";
import SetProducts from "./set-products";
import { initData, IState, updateMovements } from "@slices/products";
import ShowListContext from "./context";

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
    const showSingles = useAppSelector(state => !!state.productsReducer.showSingles)
    const showSets = useAppSelector(state => !!state.productsReducer.showSets)

    const [showList,setShowList] = useState(false)
    const updateShowList = (v:boolean) => setShowList(v)
    
    useEffect(()=>{
        dispatch(initData(initialState))
        dispatch(updateMovements([]))
    },[])
    
    return (
        <SignedInWrapper {...{
            csrf,
            children:(
                <>
                {showList && <Stack direction='column'>
                    {showSingles && <SingleProducts />}
                    {showSets && <SetProducts />}
                </Stack>}
                <ShowListContext value={{updateShowList}}>
                    <FilterDialog />
                </ShowListContext>
                <NewSetDialog />
                </>
            ),
            header:<Header />
        }} />
    )
}

export default Pricing