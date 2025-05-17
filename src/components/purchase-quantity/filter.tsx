import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useAppDispatch, useAppSelector } from "@store/hooks"
import { selectSupplierList, toggleFilter, updateSuppliers } from './purchaseQuantitySlice';
import Stack from '@mui/material/Stack';
import { JSX } from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

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

    return (
        <Dialog open={filterOn} onClose={filterOnClose}>
            <DialogTitle>Filter</DialogTitle>
            <DialogContent>
                <Stack direction='column' marginTop={1} rowGap={2}>
                    <FormControl fullWidth>
                        <InputLabel id='supplier-id'>Suppliers</InputLabel>
                        <Select multiple labelId='supplier-id' label='Suppliers' value={showSuppliers} onChange={suppliersOnChange}>
                            {supplierList.map(({id,name})=>(<MenuItem key={id} value={id}>{name}</MenuItem>))}
                        </Select>
                    </FormControl>
                </Stack>
            </DialogContent>
        </Dialog>
    )
}

export default FilterDialog