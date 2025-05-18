import Stack from "@mui/material/Stack"
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import PublishIcon from '@mui/icons-material/Publish';
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { toggleFilter, updateColumns } from "./purchaseQuantitySlice";

const PurchaseQuantityControlBar = () => {
    const columns = useAppSelector(state => state.purchaseQuantityReducer.columns)
    const dispatch = useAppDispatch()
    const sliderOnChange = (_:any, newValue: number | number[]) => dispatch(updateColumns(newValue as number))
    const filterBtnOnClick = () => dispatch(toggleFilter())
    const hasQtyEdited = useAppSelector(state => !!state.purchaseQuantityReducer.internalItems.filter(e => e.quantity !== e.quantityTemp).length)

    return (
        <Stack direction='row' columnGap={2}>
            <Stack direction='column'>
                <Typography>Columns</Typography>
                <Slider sx={{width:'150px'}} min={4} max={12} step={1} shiftStep={1} value={columns} onChange={sliderOnChange} />
            </Stack>
            <Button variant='contained' startIcon={<FilterAltIcon />} onClick={filterBtnOnClick}>Filter</Button>
        {hasQtyEdited && <Button variant="contained" color="error" startIcon={<PublishIcon />}>Filter</Button>}
        </Stack>
    )
}

export default PurchaseQuantityControlBar