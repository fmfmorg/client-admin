import Grid from '@mui/material/Grid2'
import AppBar from '@mui/material/AppBar';

const Catalogue = () => {
    return (
        <Grid size={6} sx={{height:'100vh',overflowY:'auto',borderLeft:'2px solid #777'}}>
            <AppBar position='sticky'>AppBar</AppBar>
            {Array(100).fill(null).map((_,i)=>(<p>{i}</p>))}
        </Grid>
    )
}
export default Catalogue