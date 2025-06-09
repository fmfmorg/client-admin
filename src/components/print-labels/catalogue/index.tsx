import Grid from '@mui/material/Grid2'
import Header from './header'
import { useAppSelector } from '@store/hooks'
import SingleProducts from './single-products'

const Catalogue = () => {
    const showSingles = useAppSelector(state => !!state.productsReducer.showSingles)
    const showSets = useAppSelector(state => !!state.productsReducer.showSets)
    
    return (
        <Grid size={6} sx={{height:'100vh',overflowY:'auto',borderLeft:'2px solid #777'}}>
            <Header />
            {showSingles && <SingleProducts />}
        </Grid>
    )
}
export default Catalogue