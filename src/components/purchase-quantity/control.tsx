import Stack from "@mui/material/Stack"
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { updateColumns } from "./purchaseQuantitySlice";

const PurchaseQuantityControlBar = () => {
    const columns = useAppSelector(state => state.purchaseQuantityReducer.columns)
    const dispatch = useAppDispatch()
    const sliderOnChange = (_:any, newValue: number | number[]) => dispatch(updateColumns(newValue as number))

    return (
        <Stack direction='row' columnGap={2}>
            <Stack direction='column'>
                <Typography>Columns</Typography>
                <Slider sx={{width:'150px'}} min={4} max={12} step={1} shiftStep={1} value={columns} onChange={sliderOnChange} />
            </Stack>
        </Stack>
    )
}

export default PurchaseQuantityControlBar