import Grid from '@mui/material/Grid2'
import Header from './header'
import { useAppSelector } from '@store/hooks'
import { IExternalItem } from 'src/interfaces'
import SingleProducts from './single-products'

const LabelsToPrint = () => {
    const hasSinglesToPrint = useAppSelector(state => !!(state.productsReducer.externalItems as IExternalItem[]).filter(e => !!e.labelQty).length)
    return (
        <Grid size={6} sx={{height:'100vh',overflowY:'auto'}}>
            <Header />
            {hasSinglesToPrint && <SingleProducts />}
        </Grid>
    )
}

export default LabelsToPrint