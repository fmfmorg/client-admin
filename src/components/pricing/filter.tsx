import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { 
    selectMetalColorList, 
    selectProductTypeList, 
    toggleFilter, 
    toggleShowNonPricedItems, 
    toggleShowPricedItems, 
    toggleShowSets, 
    toggleShowSingles, 
    updateProductType, 
    updateShowMetalColor, 
} from './slice';
import Stack from '@mui/material/Stack';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { RowEqualWidth } from '@misc';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';

const FilterDialog = () => {
    const dispatch = useAppDispatch();
    const filterOn = useAppSelector(state => state.pricingReducer.filterMode)
    const filterOnClose = () => dispatch(toggleFilter())

    const metalColorList = useAppSelector(selectMetalColorList)
    const showMetalColors = useAppSelector(state => state.pricingReducer.showMetalColors)
    const metalColorsOnChange = (e:SelectChangeEvent<number[]>) => dispatch(updateShowMetalColor(e.target.value as number[]))

    const productTypeList = useAppSelector(selectProductTypeList)
    const showProductTypes = useAppSelector(state => state.pricingReducer.showProductTypes)
    const productTypesOnChange = (e:SelectChangeEvent<number[]>) => dispatch(updateProductType(e.target.value as number[]))

    const showSingles = useAppSelector(state => state.pricingReducer.showSingles)
    const showSinglesOnChange = () => dispatch(toggleShowSingles());

    const showSets = useAppSelector(state => state.pricingReducer.showSets)
    const showSetsOnChange = () => dispatch(toggleShowSets());

    const showPricedItems = useAppSelector(state => state.pricingReducer.showPricedItems)
    const showPricedItemsOnChange = () => dispatch(toggleShowPricedItems());

    const showNonPricedItems = useAppSelector(state => state.pricingReducer.showNonPricedItems)
    const showNonPricedItemsOnChange = () => dispatch(toggleShowNonPricedItems());

    return (
        <Dialog open={filterOn} onClose={filterOnClose} fullWidth>
            <DialogTitle>Filter</DialogTitle>
            <DialogContent>
                <Stack direction='column' marginTop={1} rowGap={2}>
                    <RowEqualWidth>
                        <>
                        <FormControl fullWidth>
                            <InputLabel id='metal-color-id'>Metal Colour</InputLabel>
                            <Select multiple labelId='metal-color-id' label='Metal Colour' value={showMetalColors} onChange={metalColorsOnChange}>
                                {metalColorList.map(({id,name})=>(<MenuItem key={id} value={id}>{name}</MenuItem>))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel id='product-type-id'>Product Type</InputLabel>
                            <Select multiple labelId='product-type-id' label='Product Type' value={showProductTypes} onChange={productTypesOnChange}>
                                {productTypeList.map(({id,name})=>(<MenuItem key={id} value={id}>{name}</MenuItem>))}
                            </Select>
                        </FormControl>
                        </>
                    </RowEqualWidth>
                    <RowEqualWidth>
                        <>
                        <FormControlLabel control={<Checkbox defaultChecked={showSingles} onChange={showSinglesOnChange} />} label="Show Singles" />
                        <FormControlLabel control={<Checkbox defaultChecked={showSets} onChange={showSetsOnChange} />} label="Show Sets" />
                        </>
                    </RowEqualWidth>
                    <RowEqualWidth>
                        <>
                        <FormControlLabel control={<Checkbox defaultChecked={showPricedItems} onChange={showPricedItemsOnChange} />} label="Show Priced Items" />
                        <FormControlLabel control={<Checkbox defaultChecked={showNonPricedItems} onChange={showNonPricedItemsOnChange} />} label="Show Non Priced Items" />
                        </>
                    </RowEqualWidth>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={filterOnClose}>Close Filter</Button>
            </DialogActions>
        </Dialog>
    )
}

export default FilterDialog