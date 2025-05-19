import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { useAppDispatch, useAppSelector } from "@store/hooks"
import { ChangeEvent } from "react"
import { updatePriceTemp } from "./slice"
import TextField from "@mui/material/TextField"
import InputAdornment from "@mui/material/InputAdornment"

const ProductField = ({id}:{id:string}) => {
    const currentPrice = useAppSelector(state => (state.pricingReducer.externalPrices.find(e => e.externalSkuID === id)?.price || 0).toFixed(2))
    const cost = useAppSelector(state => {
        const costs = state.pricingReducer.skuMapItems.filter(e => e.external === id).map(e => state.pricingReducer.internalCosts.find(f => f.internalSkuID === e.internal)?.costRmb || 0)
        return !!costs.length ? costs.reduce((a,b)=>a+b,0) * 0.01 : 0
    })
    return (
        <Stack direction='column'>
            <Typography variant='body2'>{id} - ¥{cost} - £{currentPrice}</Typography>
            <EditPriceField {...{id}} />
        </Stack>
    )
}

const EditPriceField = ({id}:{id:string}) => {
    const dispatch = useAppDispatch()
    const initialPrice = useAppSelector(state => {
        const price = state.pricingReducer.externalPrices.find(e=>e.externalSkuID === id)?.priceTemp || 0
        return !!price ? price.toString() : ''
    })
    const onChange = (e:ChangeEvent<HTMLInputElement>) => {
        const price = +e.target.value
        dispatch(updatePriceTemp({id,price:isNaN(price) ? 0 : price}))
    }
    
    return (
        <TextField 
            fullWidth 
            label='Price' 
            type='number' 
            defaultValue={initialPrice} 
            slotProps={{
                htmlInput:{step:0.01,min:0},
                input:{
                    sx:{color:'#fff', fontWeight:'bold'},
                    slotProps:{input:{sx:{borderColor:'#fff',borderWidth:2}}},
                    startAdornment:<InputAdornment position="start" sx={{color:'#fff',fontWeight:'bold'}}>£</InputAdornment>,
                },
                inputLabel:{sx:{fontWeight:'bold',color:'#fff'}},
            }} 
            sx={{marginTop:1}} 
            onChange={onChange}
            size='small'
            
        />
    )
}

export default ProductField