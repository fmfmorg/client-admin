import AppBar from '@mui/material/AppBar';
import Stack from "@mui/material/Stack"
import Button from "@mui/material/Button"
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import UpdateIcon from '@mui/icons-material/Update';
import { useAppDispatch } from '@store/hooks';
import { labelsAddCurrentViewItemsWithLatestReceivedQuantity, toggleFilter } from '@slices/products';
import { useStore } from 'react-redux';
import { RootState } from '@store/store';
import { selectSetProductIDs, selectSingleProductIDs } from '../labels-to-print/selectors';

const Header = () => {
    const store = useStore()
    const dispatch = useAppDispatch()
    const filterBtnOnClick = () => dispatch(toggleFilter())
    const updateAllSinglesInView = () => {
        const state = store.getState() as RootState

        const singleIDs = selectSingleProductIDs(state)
        const setIDs = selectSetProductIDs(state)

        if (!singleIDs.length && !setIDs.length) return

        dispatch(labelsAddCurrentViewItemsWithLatestReceivedQuantity([...singleIDs,...setIDs]))
    }
    
    return (
        <AppBar position='sticky'>
            <Stack direction='row' columnGap={2}>
                <Button variant='contained' color='info' startIcon={<FilterAltIcon />} onClick={filterBtnOnClick}>Filter</Button>
                <Button variant='contained' color='warning' startIcon={<UpdateIcon />} onClick={updateAllSinglesInView}>Current view, Latest Receipt Quantity</Button>
            </Stack>
        </AppBar>
    )
}

export default Header