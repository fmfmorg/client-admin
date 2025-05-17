import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { useAppSelector } from '@store/hooks';

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
                // actionIcon={deleteMode ? <DeleteCheckbox id={id} /> : <EditBtn id={id} />}
            />
        </ImageListItem>
    )
}

const Description = ({id}:{id:string}) => {
    const editQuantity = useAppSelector(state => state.purchaseQuantityReducer.editQuantity)

    return editQuantity ? <EditQuantityField {...{id}} /> : <Typography variant='body2'>{id}</Typography>
}

const EditQuantityField = ({id}:{id:string}) => {
    const initialQuantity = useAppSelector(state => state.purchaseQuantityReducer.internalItems.find(e=>e.internalSkuID === id)?.quantityTemp.toString() || '')
    
    return (
        <TextField fullWidth label='Quantity' type='number' defaultValue={initialQuantity} slotProps={{htmlInput:{step:1}}} sx={{paddingTop:1}} />
    )
}

export default Product