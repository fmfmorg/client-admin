import AppBar from '@mui/material/AppBar';
import Stack from "@mui/material/Stack"
import Button from "@mui/material/Button"
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import UpdateIcon from '@mui/icons-material/Update';
import { useAppDispatch } from '@store/hooks';
import { labelsAddCurrentViewItemsWithLatestReceivedQuantity, toggleFilter } from '@slices/products';
import { useStore } from 'react-redux';
import { RootState } from '@store/store';
import { selectMultiProductIDs, selectSingleProductIDs } from "@components/pricing/selectors"

const Header = () => {
    const store = useStore()
    const dispatch = useAppDispatch()
    const filterBtnOnClick = () => dispatch(toggleFilter())
    const updateAllSinglesInView = () => {
        const state = store.getState() as RootState

        const showSingles = !!state.productsReducer.showSingles
        const singleIDs = selectSingleProductIDs(state)

        const showSets = !!state.productsReducer.showSets
        const setIDs = selectMultiProductIDs(state)

        let ids:string[] = []
        if (showSingles) ids = [...ids,...singleIDs]
        if (showSets) ids = [...ids,...setIDs]

        dispatch(labelsAddCurrentViewItemsWithLatestReceivedQuantity(ids))
    }
    
    return (
        <AppBar position='sticky'>
            <Stack direction='row' columnGap={2}>
                <Button variant='contained' startIcon={<FilterAltIcon />} onClick={filterBtnOnClick}>Filter</Button>
                <Button variant='contained' color='warning' startIcon={<UpdateIcon />} onClick={updateAllSinglesInView}>Current view, Latest Receipt Quantity</Button>
            </Stack>
        </AppBar>
    )
}

export default Header