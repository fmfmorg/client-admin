import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import Stack from '@mui/material/Stack';
import { ChangeEvent } from 'react';
import { IInternalItemSpecification, IPurchaseRecordItem } from 'src/interfaces';
import { toggleEditDialog, updateQuantityPurchasedTemp, updateQuantityReceivedTemp } from '@slices/products';

const Product = ({id}:{id:string}) => {
    const imgSrc = useAppSelector(state => (state.productsReducer.internalItemSpecs as IInternalItemSpecification[]).find(e=>e.internalSkuID===id)?.image || '')
    const edited = useAppSelector(state => {
        const item = (state.productsReducer.internalItems as IPurchaseRecordItem[]).find(e => e.internalSkuID === id)
        return !!item ? item.quantity !== item.quantityTemp : false
    })
    const url = useAppSelector(state => (state.productsReducer.internalItemSpecs as IInternalItemSpecification[]).find(e => e.internalSkuID === id)?.page || '#')
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
    const qty = useAppSelector(state => (state.productsReducer.internalItems as IPurchaseRecordItem[]).find(e=>e.internalSkuID === id)?.quantity || 0).toString()
    return (
        <Stack direction='column'>
            <Typography variant='body2'>{id} - {qty}pc</Typography>
            <Stack direction='row' columnGap={1}>
                <EditQuantityReceived {...{id}} />
                <EditQuantityPurchased {...{id}} />
            </Stack>
        </Stack>
    )
}

const EditQuantityPurchased = ({id}:{id:string}) => {
    const dispatch = useAppDispatch()
    const initialQuantity = useAppSelector(state =>{
        const qty = (state.productsReducer.internalItems as IPurchaseRecordItem[]).find(e=>e.internalSkuID === id)?.purchaseQuantityTemp || 0
        return !!qty ? qty.toString() : ''
    })
    const onChange = (e:ChangeEvent<HTMLInputElement>) => {
        const qty = +e.target.value
        dispatch(updateQuantityPurchasedTemp({id,qty:isNaN(qty) ? 0 : qty}))
    }
    
    return (
        <TextField 
            fullWidth 
            label='Purchased' 
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

const EditQuantityReceived = ({id}:{id:string}) => {
    const dispatch = useAppDispatch()
    const initialQuantity = useAppSelector(state =>{
        const qty = (state.productsReducer.internalItems as IPurchaseRecordItem[]).find(e=>e.internalSkuID === id)?.quantityTemp || 0
        return !!qty ? qty.toString() : ''
    })
    const onChange = (e:ChangeEvent<HTMLInputElement>) => {
        const qty = +e.target.value
        dispatch(updateQuantityReceivedTemp({id,qty:isNaN(qty) ? 0 : qty}))
    }
    
    return (
        <TextField 
            fullWidth 
            label='Received' 
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