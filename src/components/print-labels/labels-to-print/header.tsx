import AppBar from '@mui/material/AppBar';
import Stack from "@mui/material/Stack"
import Button from "@mui/material/Button"
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import { labelsClearQuantities } from '@slices/products';
import { useAppDispatch } from '@store/hooks';
import { useStore } from 'react-redux';
import { RootState } from '@store/store';
import { selectSetProductIDs, selectSingleProductIDs } from './selectors';

const Header = () => {
    const store = useStore()
    const dispatch = useAppDispatch()
    const clearLabelQty = () => dispatch(labelsClearQuantities())
    const exportCSV = () => {
        const state = store.getState() as RootState
        if (!state.productsReducer.externalItems) return
        
        const singleIDs = selectSingleProductIDs(state)
        const setIDs = selectSetProductIDs(state)
        const idsToPrint = [...singleIDs,...setIDs]

        let csvRows:string[] = ['BARCODE,PRICE']

        const externalItems = state.productsReducer.externalItems

        for (const id of idsToPrint){
            const item = externalItems.find(e => e.externalSkuID === id)
            if (!item || !item.labelQty || !item.price) continue

            for (let i=0; i<item.labelQty; i++){
                csvRows.push(`${item.externalSkuID},£${item.price.toFixed(2)}`)
            }
        }

        const csvContent = csvRows.join('\n')
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `${Date.now()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    return (
        <AppBar position='sticky'>
            <Stack direction='row' columnGap={2}>
                <Button variant='contained' color='error' startIcon={<DeleteIcon />} onClick={clearLabelQty}>Clear</Button>
                <Button variant='contained' color='info' startIcon={<DownloadIcon />} onClick={exportCSV}>Download CSV</Button>
            </Stack>
        </AppBar>
    )
}

export default Header