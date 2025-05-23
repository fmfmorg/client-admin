import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { toggleEditDialog, updateQuantityTemp } from './slice';
import Stack from '@mui/material/Stack';
import { ChangeEvent } from 'react';

const Product = ({id}:{id:string}) => {
    const imgSrc = useAppSelector(state => state.purchaseQuantityReducer.internalItemSpecs.find(e=>e.internalSkuID===id)?.image || '')
    const edited = useAppSelector(state => {
        const item = state.purchaseQuantityReducer.internalItems.find(e => e.internalSkuID === id)
        return !!item ? item.quantity !== item.quantityTemp : false
    })
    const url = useAppSelector(state => state.purchaseQuantityReducer.internalItemSpecs.find(e => e.internalSkuID === id)?.page || '#')
    return (
        <ImageListItem sx={{aspectRatio: "1 / 1"}}>
            <a style={{height:'100%'}} href={url} target='_blank'>
                <img 
                    src={imgSrc} 
                    loading='lazy'
                    width='100%'
                    style={{objectFit:'cover',objectPosition:'center',width:'100%',height:'100%'}}
                />
            </a>
            <ImageListItemBar 
                title={<Description id={id} />}
                sx={{display:'flex',backgroundColor:edited ? 'rgba(138, 30, 30, 0.5)' : 'rgba(0, 0, 0, 0.5)'}}
                actionIcon={<EditBtn id={id} />}
            />
        </ImageListItem>
    )
}

const Description = ({id}:{id:string}) => {
    const qty = useAppSelector(state => state.purchaseQuantityReducer.internalItems.find(e=>e.internalSkuID === id)?.quantity || 0).toString()
    return (
        <Stack direction='column'>
            <Typography variant='body2'>{id} - {qty}pc</Typography>
            <EditQuantityField {...{id}} />
        </Stack>
    )
}

const EditQuantityField = ({id}:{id:string}) => {
    const dispatch = useAppDispatch()
    const initialQuantity = useAppSelector(state =>{
        const qty = state.purchaseQuantityReducer.internalItems.find(e=>e.internalSkuID === id)?.quantityTemp || 0
        return !!qty ? qty.toString() : ''
    })
    const onChange = (e:ChangeEvent<HTMLInputElement>) => {
        const qty = +e.target.value
        dispatch(updateQuantityTemp({id,qty:isNaN(qty) ? 0 : qty}))
    }
    
    return (
        <TextField 
            fullWidth 
            label='Quantity' 
            type='number' 
            defaultValue={initialQuantity} 
            slotProps={{
                htmlInput:{step:1,min:0},
                input:{sx:{color:'#fff', fontWeight:'bold'},slotProps:{input:{sx:{borderColor:'#fff',borderWidth:2}}}},
                inputLabel:{sx:{fontWeight:'bold',color:'#fff'}},
            }} 
            sx={{marginTop:1}} 
            onChange={onChange}
            size='small'
        />
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