import Grid from '@mui/material/Grid2'
import Header from './header'
import { useAppSelector } from '@store/hooks'
import { IExternalItem, ISkuMapItem } from 'src/interfaces'
import SingleProducts from './single-products'

const LabelsToPrint = () => {
    const hasSinglesToPrint = useAppSelector(state => {
        const externalSkuIDs = (state.productsReducer.externalItems as IExternalItem[]).map(e => e.externalSkuID)
        const singleSkuIDs = externalSkuIDs.filter(e => (state.productsReducer.skuMapItems as ISkuMapItem[]).filter(d => d.external === e).length === 1)
        return !!(state.productsReducer.externalItems as IExternalItem[]).filter(e => !!e.labelQty && singleSkuIDs.includes(e.externalSkuID)).length
    })
    const hasSetsToPrint = useAppSelector(state => {
        const externalSkuIDs = (state.productsReducer.externalItems as IExternalItem[]).map(e => e.externalSkuID)
        const singleSkuIDs = externalSkuIDs.filter(e => (state.productsReducer.skuMapItems as ISkuMapItem[]).filter(d => d.external === e).length > 1)
        return !!(state.productsReducer.externalItems as IExternalItem[]).filter(e => !!e.labelQty && singleSkuIDs.includes(e.externalSkuID)).length
    })
    return (
        <Grid size={6} sx={{height:'100vh',overflowY:'auto'}}>
            <Header />
            {hasSinglesToPrint && <SingleProducts />}
        </Grid>
    )
}

export default LabelsToPrint