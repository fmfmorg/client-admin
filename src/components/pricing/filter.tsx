import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import Stack from '@mui/material/Stack';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { RowEqualWidth } from '@misc';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from "@mui/material/TextField";
import { toggleFilter, toggleShowNonPricedItems, toggleShowPricedItems, toggleShowSets, toggleShowSingles, updateProductType, updateShowMetalColor, updateSuppliers } from '@slices/products';
import { selectMetalColorList, selectProductTypeList, selectSupplierList } from './selectors';
import { useContext, useState } from 'react';
import ShowListContext from './context';
import { ISpecification } from '../../interfaces';

const FilterDialog = () => {
    const dispatch = useAppDispatch();
    const {updateShowList} = useContext(ShowListContext)
    const filterOnClose = () => dispatch(toggleFilter())

    const metalColorList = useAppSelector(selectMetalColorList)
    const showMetalColors = useAppSelector(state => state.productsReducer.showMetalColors || [])
    const [metalColors,setMetalColors] = useState<number[]>(showMetalColors)
    const metalColorsOnChange = (e:SelectChangeEvent<number[]>) => setMetalColors([...e.target.value as number[]])//dispatch(updateShowMetalColor(e.target.value as number[]))

    const productTypeList = useAppSelector(selectProductTypeList)
    const showProductTypes = useAppSelector(state => state.productsReducer.showProductTypes || [])
    const [productTypes,setProductTypes] = useState<number[]>(showProductTypes)
    const productTypesOnChange = (e:SelectChangeEvent<number[]>) => setProductTypes([...e.target.value as number[]]) //dispatch(updateProductType(e.target.value as number[]))

    const supplierList = useAppSelector(selectSupplierList)
    const showSuppliers = useAppSelector(state => {
        if (!state.productsReducer.suppliers || !state.productsReducer.suppliers.length || !state.productsReducer.showSuppliers || !state.productsReducer.showSuppliers.length) return []
        const s = state.productsReducer.showSuppliers
        return state.productsReducer.suppliers.filter(e => s.includes(e.id))
    })
    const [suppliers,setSuppliers] = useState<ISpecification[]>(showSuppliers)
    const suppliersOnChange = (_: unknown, v: ISpecification[] | null) => setSuppliers(!!v ? [...v] : []) //dispatch(updateSuppliers(!!v ? v.map(e => e.id) : []))

    const _showSingles = useAppSelector(state => state.productsReducer.showSingles)
    const [showSingles,setShowSingles] = useState(_showSingles);
    const showSinglesOnChange = () => setShowSingles(!showSingles) //dispatch(toggleShowSingles());

    const _showSets = useAppSelector(state => state.productsReducer.showSets)
    const [showSets,setShowSets] = useState(_showSets)
    const showSetsOnChange = () => setShowSets(showSets!) //dispatch(toggleShowSets());

    const _showPricedItems = useAppSelector(state => state.productsReducer.showPricedItems)
    const [showPricedItems,setShowPricedItems] = useState(_showPricedItems)
    const showPricedItemsOnChange = () => setShowPricedItems(!showPricedItems) //dispatch(toggleShowPricedItems());

    const _showNonPricedItems = useAppSelector(state => state.productsReducer.showNonPricedItems)
    const [showNonPricedItems,setShowNonPricedItems] = useState(_showNonPricedItems)
    const showNonPricedItemsOnChange = () => setShowNonPricedItems(!showNonPricedItems) //dispatch(toggleShowNonPricedItems());


    const updateList = () => {
        dispatch(updateShowMetalColor(metalColors))
        dispatch(updateProductType(productTypes))
        dispatch(updateSuppliers(suppliers.map(e => e.id)))

        if (_showSingles !== showSingles) dispatch(toggleShowSingles());
        if (_showSets !== showSets) dispatch(toggleShowSets());
        if (_showPricedItems !== showPricedItems) dispatch(toggleShowPricedItems());
        if (_showNonPricedItems !== showNonPricedItems) dispatch(toggleShowNonPricedItems());

        updateShowList(true)
        filterOnClose()
    }



    return (
        <Dialog open={true} onClose={filterOnClose} fullWidth>
            <DialogTitle>Filter</DialogTitle>
            <DialogContent>
                <Stack direction='column' sx={{marginTop:1,rowGap:2}}>
                    <FormControl fullWidth>
                        {/* <InputLabel id='supplier-id'>Suppliers</InputLabel>
                        <Select multiple labelId='supplier-id' label='Suppliers' value={showSuppliers} onChange={suppliersOnChange}>
                            {supplierList.map(({id,name})=>(<MenuItem key={id} value={id}>{name}</MenuItem>))}
                        </Select> */}
                        <Autocomplete 
                            options={supplierList}
                            getOptionLabel={e => e.name}
                            renderInput={p => <TextField {...p} label='Suppliers' />}
                            multiple
                            value={suppliers}
                            onChange={suppliersOnChange}
                        />
                    </FormControl>
                    <RowEqualWidth>
                        <>
                        <FormControl fullWidth>
                            <InputLabel id='metal-color-id'>Metal Colour</InputLabel>
                            <Select multiple labelId='metal-color-id' label='Metal Colour' value={metalColors} onChange={metalColorsOnChange}>
                                {metalColorList.map(({id,name})=>(<MenuItem key={id} value={id}>{name}</MenuItem>))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel id='product-type-id'>Product Type</InputLabel>
                            <Select multiple labelId='product-type-id' label='Product Type' value={productTypes} onChange={productTypesOnChange}>
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
                <Button onClick={updateList}>Update List</Button>
            </DialogActions>
        </Dialog>
    )
}

export default FilterDialog