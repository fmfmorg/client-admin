import { CsrfContext } from "@context"
import { useAppDispatch, useAppSelector } from "@store/hooks"
import { useContext } from "react"
import { useStore } from "react-redux"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import Slider from "@mui/material/Slider"
import Button from "@mui/material/Button"
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import PublishIcon from '@mui/icons-material/Publish';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { RootState } from "@store/store"
import { httpRequestHeader } from "@misc"
import { IExternalItem } from "src/interfaces"
import { pricesUpdated, toggleFilter, toggleNewSetDialog, updateColumns } from "@slices/products"

const Header = () => {
    const store = useStore()
    const dispatch = useAppDispatch()
    const {csrfToken} = useContext(CsrfContext)
    const columns = useAppSelector(state => state.productsReducer.columns)
    const sliderOnChange = (_:any, newValue: number | number[]) => dispatch(updateColumns(newValue as number))
    const filterBtnOnClick = () => dispatch(toggleFilter())
    const newSetBtnOnClick = () => dispatch(toggleNewSetDialog())
    const hasPriceEdited = useAppSelector(state => !!(state.productsReducer.externalItems as IExternalItem[]).filter(e => e.price !== e.priceTemp).length)
    const priceUpdateOnClick = async() => {
        const state = store.getState() as RootState
        const items = (state.productsReducer.externalItems as IExternalItem[]).filter(e=>e.price !== e.priceTemp).map(({externalSkuID,priceTemp})=>({externalSkuID,price:priceTemp}))
        const resp = await fetch('/api/admin/pricing-update-prices',{
            method:"POST",
            headers:httpRequestHeader(false,'client',true,csrfToken),
            body:JSON.stringify({items})
        })
        if (!resp.ok){
            const text = await resp.text()
            alert(text)
            return
        }
        dispatch(pricesUpdated())
    }

    return (
        <Stack direction='row' columnGap={2}>
            <Stack direction='column'>
                <Typography>Columns</Typography>
                <Slider sx={{width:'150px'}} min={4} max={8} step={1} shiftStep={1} value={columns} onChange={sliderOnChange} />
            </Stack>
            <Button variant='contained' startIcon={<FilterAltIcon />} onClick={filterBtnOnClick}>Filter</Button>
            <Button variant="contained" color='secondary' startIcon={<AddCircleIcon />} onClick={newSetBtnOnClick}>New Set</Button>
            {hasPriceEdited && <Button variant="contained" color="error" startIcon={<PublishIcon />} onClick={priceUpdateOnClick}>Update Prices</Button>}
        </Stack>
    )
}

export default Header