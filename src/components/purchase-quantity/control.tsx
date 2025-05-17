import Stack from "@mui/material/Stack"
import Slider from '@mui/material/Slider';
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { updateColumns } from "./purchaseQuantitySlice";

const PurchaseQuantityControlBar = () => {
    const columns = useAppSelector(state => state.purchaseQuantityReducer.columns)
    const dispatch = useAppDispatch()
    const sliderOnChange = (_:any, newValue: number | number[]) => dispatch(updateColumns(newValue as number))

    return (
        <Stack direction='row' columnGap={2}>
            <Slider sx={{width:'200px',marginRight:2}} min={6} max={16} step={1} shiftStep={1} value={columns} onChange={sliderOnChange} />
        </Stack>
    )
}

export default PurchaseQuantityControlBar