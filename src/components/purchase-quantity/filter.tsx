import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useAppDispatch, useAppSelector } from "@store/hooks"
import { selectMetalColorList, selectMovementList, selectProductTypeList, selectSupplierList, toggleFilter, updateMovements, updateProductType, updateShowMetalColor, updateSuppliers } from './purchaseQuantitySlice';
import Stack from '@mui/material/Stack';
import { JSX } from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Grid2'

const Row = ({children}:{children:JSX.Element}) => (
    <Stack direction='row' spacing={1} width='100%'>{children}</Stack>
)

const FilterDialog = () => {
    const dispatch = useAppDispatch();
    const filterOn = useAppSelector(state => state.purchaseQuantityReducer.filterMode)
    const filterOnClose = () => dispatch(toggleFilter())

    const supplierList = useAppSelector(selectSupplierList)
    const showSuppliers = useAppSelector(state => state.purchaseQuantityReducer.showSuppliers)
    const suppliersOnChange = (e:SelectChangeEvent<number[]>) => dispatch(updateSuppliers(e.target.value as number[]))

    const movementList = useAppSelector(selectMovementList)
    const showMovementIDs = useAppSelector(state => state.purchaseQuantityReducer.showMovementIDs)
    const movementIDsOnChange = (e:SelectChangeEvent<number[]>) => dispatch(updateMovements(e.target.value as number[]))

    const metalColorList = useAppSelector(selectMetalColorList)
    const showMetalColors = useAppSelector(state => state.purchaseQuantityReducer.showMetalColors)
    const metalColorsOnChange = (e:SelectChangeEvent<number[]>) => dispatch(updateShowMetalColor(e.target.value as number[]))

    const productTypeList = useAppSelector(selectProductTypeList)
    const showProductTypes = useAppSelector(state => state.purchaseQuantityReducer.showProductTypes)
    const productTypesOnChange = (e:SelectChangeEvent<number[]>) => dispatch(updateProductType(e.target.value as number[]))

    return (
        <Dialog open={filterOn} onClose={filterOnClose}>
            <DialogTitle>Filter</DialogTitle>
            <DialogContent>
                <Stack direction='column' marginTop={1} rowGap={2}>
                    <Grid container direction='row' width='100%'>
                        <Grid size={4}>
                            <FormControl fullWidth>
                                <InputLabel id='movement-id'>Suppliers</InputLabel>
                                <Select multiple labelId='movement-id' label='Movements' value={showMovementIDs} onChange={movementIDsOnChange}>
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
                    <Row>
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
                    </Row>
                </Stack>
            </DialogContent>
        </Dialog>
    )
}

export default FilterDialog