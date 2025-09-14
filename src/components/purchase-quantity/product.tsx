import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import Stack from '@mui/material/Stack';
import { ChangeEvent } from 'react';
import { IPurchaseRecordItem } from 'src/interfaces';
import { toggleEditDialog, updateQuantityPurchasedTemp, updateQuantityReceivedTemp } from '@slices/products';

const Product = ({id}:{id:number}) => {
    const imgSrc = useAppSelector(state => {
        const internalSkuID = (state.productsReducer.internalItems as IPurchaseRecordItem[]).find(e => e.id === id)?.internalSkuID || ''
        return !!internalSkuID ? `${process.env.NEXT_PUBLIC_FM_ADMIN_IMAGE_URL_PREFIX}${internalSkuID}.avif` : ''
        // return (state.productsReducer.internalItemSpecs as IInternalItemSpecification[]).find(e=>e.internalSkuID===internalSkuID)?.image || ''
    })
    const edited = useAppSelector(state => {
        const item = (state.productsReducer.internalItems as IPurchaseRecordItem[]).find(e => e.id === id)
        return !!item ? item.quantity !== item.quantityTemp : false
    })
    const url = useAppSelector(state => (state.productsReducer.internalItems as IPurchaseRecordItem[]).find(e => e.id === id)?.page || '#')
    const internalSkuID = useAppSelector(state => (state.productsReducer.internalItems as IPurchaseRecordItem[]).find(e => e.id === id)?.internalSkuID || '')
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
                actionIcon={<EditBtn id={internalSkuID} />}
            />
        </ImageListItem>
    )
}

const Description = ({id}:{id:number}) => {
    const qty = useAppSelector(state => (state.productsReducer.internalItems as IPurchaseRecordItem[]).find(e=>e.id === id)?.quantity || 0).toString()
    const internalSkuID = useAppSelector(state => (state.productsReducer.internalItems as IPurchaseRecordItem[]).find(e => e.id === id)?.internalSkuID || '')
    return (
        <Stack direction='column'>
            <Typography variant='body2'>{internalSkuID} - {qty}pc</Typography>
            <Stack direction='row' columnGap={1}>
                <EditQuantityReceived {...{id}} />
                <EditQuantityPurchased {...{id}} />
            </Stack>
        </Stack>
    )
}

const EditQuantityPurchased = ({id}:{id:number}) => {
    const dispatch = useAppDispatch()
    const initialQuantity = useAppSelector(state =>{
        const qty = (state.productsReducer.internalItems as IPurchaseRecordItem[]).find(e=>e.id === id)?.purchaseQuantityTemp || 0
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

const EditQuantityReceived = ({id}:{id:number}) => {
    const dispatch = useAppDispatch()
    const initialQuantity = useAppSelector(state =>{
        const qty = (state.productsReducer.internalItems as IPurchaseRecordItem[]).find(e=>e.id === id)?.quantityTemp || 0
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