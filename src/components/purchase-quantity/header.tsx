import Stack from "@mui/material/Stack"
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import PublishIcon from '@mui/icons-material/Publish';
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { toggleFilter, updateColumns } from "./purchaseQuantitySlice";
import { useStore } from "react-redux";
import { RootState } from "@store/store";
import { CsrfContext } from "@context";
import { useContext } from "react";
import { httpRequestHeader } from "@misc";

const PurchaseQuantityControlBar = () => {
    const store = useStore()
    const dispatch = useAppDispatch()
    const {csrfToken} = useContext(CsrfContext)
    const columns = useAppSelector(state => state.purchaseQuantityReducer.columns)
    const sliderOnChange = (_:any, newValue: number | number[]) => dispatch(updateColumns(newValue as number))
    const filterBtnOnClick = () => dispatch(toggleFilter())
    const hasQtyEdited = useAppSelector(state => !!state.purchaseQuantityReducer.internalItems.filter(e => e.quantity !== e.quantityTemp).length)
    const quantityUpdateOnClick = async () => {
        const state = store.getState() as RootState
        const items = state.purchaseQuantityReducer.internalItems.filter(e => e.quantity !== e.quantityTemp).map(e=>({
            internalSkuID:e.internalSkuID,
            qty:e.quantityTemp,
            movementID:e.movementID
        }))
        const resp = await fetch('/api/admin/purchase-quantity-update',{
            method:"POST",
            headers:httpRequestHeader(false,'client',true,csrfToken),
            body:JSON.stringify({items})
        })
        if (!resp.ok) return
        
    }

    return (
        <Stack direction='row' columnGap={2}>
            <Stack direction='column'>
                <Typography>Columns</Typography>
                <Slider sx={{width:'150px'}} min={4} max={12} step={1} shiftStep={1} value={columns} onChange={sliderOnChange} />
            </Stack>
            <Button variant='contained' startIcon={<FilterAltIcon />} onClick={filterBtnOnClick}>Filter</Button>
        {hasQtyEdited && <Button variant="contained" color="error" startIcon={<PublishIcon />} onClick={quantityUpdateOnClick}>Update Quantity</Button>}
        </Stack>
    )
}

export default PurchaseQuantityControlBar