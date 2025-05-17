import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useAppDispatch, useAppSelector } from "@store/hooks"
import { toggleFilter } from './purchaseQuantitySlice';

const FilterDialog = () => {
    const dispatch = useAppDispatch();
    const filterOn = useAppSelector(state => state.purchaseQuantityReducer.filterMode)
    const filterOnClose = () => dispatch(toggleFilter())

    return (
        <Dialog open={filterOn} onClose={filterOnClose}>
            <DialogTitle>Filter</DialogTitle>
            <DialogContent>
                
            </DialogContent>
        </Dialog>
    )
}

export default FilterDialog