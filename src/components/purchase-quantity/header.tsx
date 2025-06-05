import Stack from "@mui/material/Stack"
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import PublishIcon from '@mui/icons-material/Publish';
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { quantityPurchasedUpdated, quantityReceivedUpdated, toggleFilter, updateColumns } from "./slice";
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
    const hasQtyReceivedEdited = useAppSelector(state => !!state.purchaseQuantityReducer.internalItems.filter(e => e.quantity !== e.quantityTemp).length)
    const hasQtyPurchasedEdited = useAppSelector(state => !!state.purchaseQuantityReducer.internalItems.filter(e => e.purchaseQuantity !== e.purchaseQuantityTemp).length)
    const quantityReceivedUpdateOnClick = async () => {
        const state = store.getState() as RootState
        const items = state.purchaseQuantityReducer.internalItems.filter(e => e.quantity !== e.quantityTemp).map(e=>({
            internalSkuID:e.internalSkuID,
            qty:e.quantityTemp,
            movementID:e.movementID
        }))
        const resp = await fetch('/api/admin/purchase-update-quantity-received',{
            method:"POST",
            headers:httpRequestHeader(false,'client',true,csrfToken),
            body:JSON.stringify({items})
        })
        if (!resp.ok) {
            alert('Server error')
            return
        }
        dispatch(quantityReceivedUpdated())
    }

    const quantityPurchasedUpdateOnClick = async () => {
        const state = store.getState() as RootState
        const items = state.purchaseQuantityReducer.internalItems.filter(e => e.purchaseQuantity !== e.purchaseQuantityTemp).map(e=>({
            internalSkuID:e.internalSkuID,
            qty:e.purchaseQuantityTemp,
            movementID:e.movementID
        }))
        const resp = await fetch('/api/admin/purchase-update-quantity-purchased',{
            method:"POST",
            headers:httpRequestHeader(false,'client',true,csrfToken),
            body:JSON.stringify({items})
        })
        if (!resp.ok) {
            alert('Server error')
            return
        }
        dispatch(quantityPurchasedUpdated())
    }

    return (
        <Stack direction='row' columnGap={2}>
            <Stack direction='column'>
                <Typography>Columns</Typography>
                <Slider sx={{width:'150px'}} min={4} max={12} step={1} shiftStep={1} value={columns} onChange={sliderOnChange} />
            </Stack>
            <Button variant='contained' startIcon={<FilterAltIcon />} onClick={filterBtnOnClick}>Filter</Button>
            {hasQtyReceivedEdited && <Button variant="contained" color="error" startIcon={<PublishIcon />} onClick={quantityReceivedUpdateOnClick}>Update Quantity Received</Button>}
            {hasQtyPurchasedEdited && <Button variant="contained" color="warning" startIcon={<PublishIcon />} onClick={quantityPurchasedUpdateOnClick}>Update Quantity Purchased</Button>}
        </Stack>
    )
}

export default PurchaseQuantityControlBar