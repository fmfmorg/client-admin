import AppBar from '@mui/material/AppBar';
import Stack from "@mui/material/Stack"
import Button from "@mui/material/Button"
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { useAppDispatch } from '@store/hooks';
import { toggleFilter } from '@slices/products';

const Header = () => {
    const dispatch = useAppDispatch()
    const filterBtnOnClick = () => dispatch(toggleFilter())
    
    return (
        <AppBar position='sticky'>
            <Stack direction='row' columnGap={2}>
                <Button variant='contained' startIcon={<FilterAltIcon />} onClick={filterBtnOnClick}>Filter</Button>
            </Stack>
        </AppBar>
    )
}

export default Header