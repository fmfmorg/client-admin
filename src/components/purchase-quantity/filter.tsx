import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useAppDispatch, useAppSelector } from "@store/hooks"
import Stack from '@mui/material/Stack';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Grid2'
import Button from '@mui/material/Button';
import { RowEqualWidth } from '@misc';
import { selectMetalColorList, selectMovementList, selectProductIDs, selectProductTypeList, selectSupplierList } from './selectors';
import { toggleFilter, updateMovements, updateProductType, updateShowMetalColor, updateSuppliers } from '@slices/products';

const FilterDialog = () => {
    const count = useAppSelector(selectProductIDs).length

    const dispatch = useAppDispatch();
    const filterOn = useAppSelector(state => !!state.productsReducer.filterMode)
    const filterOnClose = () => dispatch(toggleFilter())

    const supplierList = useAppSelector(selectSupplierList)
    const showSuppliers = useAppSelector(state => state.productsReducer.showSuppliers)
    const suppliersOnChange = (e:SelectChangeEvent<number[]>) => dispatch(updateSuppliers(e.target.value as number[]))

    const movementList = useAppSelector(selectMovementList)
    const showMovementIDs = useAppSelector(state => state.productsReducer.showMovementIDs)
    const movementIDsOnChange = (e:SelectChangeEvent<number[]>) => dispatch(updateMovements(e.target.value as number[]))

    const metalColorList = useAppSelector(selectMetalColorList)
    const showMetalColors = useAppSelector(state => state.productsReducer.showMetalColors)
    const metalColorsOnChange = (e:SelectChangeEvent<number[]>) => dispatch(updateShowMetalColor(e.target.value as number[]))

    const productTypeList = useAppSelector(selectProductTypeList)
    const showProductTypes = useAppSelector(state => state.productsReducer.showProductTypes)
    const productTypesOnChange = (e:SelectChangeEvent<number[]>) => dispatch(updateProductType(e.target.value as number[]))

    return (
        <Dialog open={filterOn} onClose={filterOnClose} fullWidth>
            <DialogTitle>Filter</DialogTitle>
            <DialogContent>
                <Stack direction='column' marginTop={1} rowGap={2}>
                    <Grid container direction='row' columnSpacing={2} width='100%'>
                        <Grid size={4}>
                            <FormControl fullWidth>
                                <InputLabel id='movement-id'>Date</InputLabel>
                                <Select multiple labelId='movement-id' label='Date' value={showMovementIDs} onChange={movementIDsOnChange}>
                                    {movementList.map(({id,name})=>(<MenuItem key={id} value={id}>{name}</MenuItem>))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid size={8}>
                            <FormControl fullWidth>
                                <InputLabel id='supplier-id'>Suppliers</InputLabel>
                                <Select multiple labelId='supplier-id' label='Suppliers' value={showSuppliers} onChange={suppliersOnChange}>
                                    {supplierList.map(({id,name})=>(<MenuItem key={id} value={id}>{name}</MenuItem>))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
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
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={filterOnClose}>Show {count} items</Button>
            </DialogActions>
        </Dialog>
    )
}

export default FilterDialog