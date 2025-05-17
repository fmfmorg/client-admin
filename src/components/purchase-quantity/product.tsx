import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { toggleEditDialog } from './purchaseQuantitySlice';
import Stack from '@mui/material/Stack';

const Product = ({id}:{id:string}) => {
    const imgSrc = useAppSelector(state => state.purchaseQuantityReducer.internalItemSpecs.find(e=>e.internalSkuID===id)?.image || '')
    return (
        <ImageListItem sx={{aspectRatio: "1 / 1"}}>
            <img 
                src={imgSrc} 
                loading='lazy'
                width='100%'
                style={{objectFit:'cover',objectPosition:'center',width:'100%',height:'100%'}}
            />
            <ImageListItemBar 
                title={<Description id={id} />}
                sx={{display:'flex'}}
                actionIcon={<EditBtn id={id} />}
            />
        </ImageListItem>
    )
}

const Description = ({id}:{id:string}) => (
    <Stack direction='column'>
        <Typography variant='body2'>{id}</Typography>
        <EditQuantityField {...{id}} />
    </Stack>
)

const EditQuantityField = ({id}:{id:string}) => {
    const initialQuantity = useAppSelector(state =>{
        const qty = state.purchaseQuantityReducer.internalItems.find(e=>e.internalSkuID === id)?.quantityTemp || 0
        return !!qty ? qty.toString() : ''
    })
    
    return (
        <TextField fullWidth label='Quantity' type='number' defaultValue={initialQuantity} slotProps={{htmlInput:{step:1}}} sx={{marginTop:1}} />
    )
}

const EditBtn = ({id}:{id:string}) => {
    const dispatch = useAppDispatch();
    const onClick = () => dispatch(toggleEditDialog(id))

    return (
        <IconButton onClick={onClick}>
            <EditIcon htmlColor='#fff' />
        </IconButton>
    )
}

export default Product