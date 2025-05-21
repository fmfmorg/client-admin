import { CsrfContext } from "@context"
import { useAppDispatch, useAppSelector } from "@store/hooks"
import { useContext } from "react"
import { useStore } from "react-redux"
import { toggleFilter, toggleNewSetDialog, updateColumns } from "./slice"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import Slider from "@mui/material/Slider"
import Button from "@mui/material/Button"
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import PublishIcon from '@mui/icons-material/Publish';
import AddCircleIcon from '@mui/icons-material/AddCircle';

const Header = () => {
    const store = useStore()
    const dispatch = useAppDispatch()
    const {csrfToken} = useContext(CsrfContext)
    const columns = useAppSelector(state => state.pricingReducer.columns)
    const sliderOnChange = (_:any, newValue: number | number[]) => dispatch(updateColumns(newValue as number))
    const filterBtnOnClick = () => dispatch(toggleFilter())
    const newSetBtnOnClick = () => dispatch(toggleNewSetDialog())
    const hasPriceEdited = useAppSelector(state => !!state.pricingReducer.externalPrices.filter(e => e.price !== e.priceTemp).length)
    const priceUpdateOnClick = async() => {}

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