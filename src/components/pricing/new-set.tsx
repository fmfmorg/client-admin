import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { useContext, useMemo, useRef, useState } from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from "@mui/material/ImageListItem"
import ImageListItemBar from "@mui/material/ImageListItemBar"
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Typography from '@mui/material/Typography';
import { useStore } from 'react-redux';
import { RootState } from '@store/store';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import { httpRequestHeader } from '@misc';
import { CsrfContext } from '@context'
import { IExternalItem, IInternalItemSpecification, IPurchaseRecordItem, ISkuMapItem } from 'src/interfaces';
import { newSetCreated, toggleNewSetDialog } from '@slices/products';
import { selectAllInternalSKUs } from './selectors';

const inputName = 'new-set-item'

const NewSetDialog = () => {
    const dispatch = useAppDispatch();
    const dialogOn = useAppSelector(state => !!state.productsReducer.newSetMode)
    const dialogOnClose = () => dispatch(toggleNewSetDialog())
    
    return (
        <Dialog open={dialogOn} onClose={dialogOnClose} fullWidth>
            <DialogTitle>Create New Set</DialogTitle>
            <Content />
        </Dialog>
    )
}

const Content = () => {
    const {csrfToken} = useContext(CsrfContext)
    const store = useStore()
    const dispatch = useAppDispatch();
    const dialogOnClose = () => dispatch(toggleNewSetDialog())
    const [itemIDs,setItemIDs] = useState([crypto.randomUUID()])
    const [setCost,setSetCost] = useState(0)
    const priceRef = useRef<HTMLInputElement>(null)
    const addItem = () => {
        setItemIDs(prev => [...prev,crypto.randomUUID()])
        setTimeoutCalCost()
    }
    const deleteItem = (itemID:string) => {
        setItemIDs(prev => prev.filter(e=>e !== itemID))
        setTimeoutCalCost()
    }
    const recalculateSetCost = () => {
        const inputs = document.getElementsByName(inputName) as NodeListOf<HTMLInputElement>
        const inputLen = inputs.length

        let cost = 0
        const state = store.getState() as RootState

        for (let i=0; i<inputLen; i++){
            const internalSKU = inputs.item(i).value
            if (!internalSKU) continue
            const item = (state.productsReducer.internalItems as IPurchaseRecordItem[]).find(e=>e.internalSkuID===internalSKU)
            if (!item) continue
            cost += item.costRmb
        }

        setSetCost(cost * 0.01)
    }
    const setTimeoutCalCost = () => setTimeout(recalculateSetCost,200)
    const clearOnClick = () => {
        setItemIDs([crypto.randomUUID()])
        setSetCost(0)
        if (!!priceRef.current) priceRef.current.value = ''
    }
    const createOnClick = async() => {
        const inputs = document.getElementsByName(inputName) as NodeListOf<HTMLInputElement>
        const inputLen = inputs.length

        let internalSKUs:string[] = []
        for (let i=0; i<inputLen; i++){
            const internalSKU = inputs.item(i).value
            if (!!internalSKU) internalSKUs = [...internalSKUs, internalSKU]
        }

        const finalSKUs = [...new Set(internalSKUs)]

        if (finalSKUs.length < 2) {
            clearOnClick()
            return
        }

        const priceTemp = +(priceRef.current?.value || '')
        const finalPrice = isNaN(priceTemp) ? 0 : priceTemp

        const resp = await fetch('/api/admin/pricing-create-new-set',{
            method:"POST",
            headers:httpRequestHeader(false,'client',true,csrfToken),
            body:JSON.stringify({internalSkuIDs:finalSKUs,price:Math.round(finalPrice * 100)})
        })

        if (!resp.ok) {
            const text = await resp.text()
            alert(text)
            return
        }

        const { externalSkuID } = await resp.json() as { externalSkuID: string }

        dispatch(newSetCreated({externalSkuID,internalSkuIDs:finalSKUs,price:finalPrice}))

        clearOnClick()
    }

    return (
        <>
        <DialogContent>
            <ImageList cols={2} sx={{overflow:'hidden'}}>
                {itemIDs.map(id=>(
                    <Item {...{key:id,itemID:id,addItem,deleteItem,setTimeoutCalCost}} />
                ))}
            </ImageList>
        </DialogContent>
        <DialogActions sx={{justifyContent:'space-between'}}>
            <Typography>Total Cost: <span style={{fontWeight:'bold'}}>¥{setCost.toFixed(2)}</span></Typography>
            <TextField 
                inputRef={priceRef}
                type='number'
                label='Price'
                size='small'
                slotProps={{
                    htmlInput:{step:0.01,min:0},
                    input:{
                        sx:{fontWeight:'bold'},
                        startAdornment:(
                            <InputAdornment position="start">
                                <Typography sx={{fontWeight:'bold'}}>£</Typography>
                            </InputAdornment>
                        ),
                    },
                }}
            />
            <Stack direction='row' columnGap={2}>
                <Button variant='outlined' color='error' onClick={clearOnClick}>Clear</Button>
                <Button variant='contained' onClick={createOnClick}>Create</Button>
                <Button variant='outlined' onClick={dialogOnClose}>Close</Button>
            </Stack>
        </DialogActions>
        </>
    )
}

const Item = (
    {
        itemID,
        addItem,
        deleteItem,
        setTimeoutCalCost,
    }:{
        itemID:string;
        addItem:()=>void;
        deleteItem:(s:string)=>void;
        setTimeoutCalCost:()=>void;
    }
) => {
    const [internalSKU,setInternalSKU] = useState<string | null>(null)
    const updateSKU = (s:string|null) => setInternalSKU(s)
    const imgSrc = useMemo(()=> !!internalSKU ? `${process.env.NEXT_PUBLIC_FM_ADMIN_IMAGE_URL_PREFIX}${internalSKU}.avif` : '',[internalSKU])
    // const imgSrc = useAppSelector(state => !!internalSKU ? (state.productsReducer.internalItemSpecs as IInternalItemSpecification[]).find(e=>e.internalSkuID===internalSKU)?.image || '' : '')
    const url = useAppSelector(state => !!internalSKU ? (state.productsReducer.internalItemSpecs as IInternalItemSpecification[]).find(e=>e.internalSkuID===internalSKU)?.page || '#' : '#')
    
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
                title={<ImageContent {...{internalSKU,updateSKU,addItem,deleteItem:()=>deleteItem(itemID),setTimeoutCalCost}} />}
                sx={{display:'flex'}}
            />
        </ImageListItem>
    )
}

const ImageContent = (
    {
        internalSKU,
        updateSKU,
        addItem,
        deleteItem,
        setTimeoutCalCost,
    }:{
        internalSKU:string|null;
        updateSKU:(s:string|null)=>void;
        addItem:()=>void;
        deleteItem:()=>void;
        setTimeoutCalCost:()=>void;
    }
) => {
    const allInternalSKUs = useAppSelector(selectAllInternalSKUs)
    const onChange = (_:any,newValue:string|null) => {
        const prevInternalSKU = structuredClone(internalSKU)
        updateSKU(newValue)
        if (!prevInternalSKU) addItem()
        else if (!newValue) deleteItem()
        else setTimeoutCalCost()
    }

    return (
        <Stack direction='row' columnGap={1}>
            <Stack direction='column' rowGap={1} sx={{flexGrow:1}}>
                <Autocomplete 
                    options={allInternalSKUs}
                    value={internalSKU}
                    onChange={onChange}
                    fullWidth
                    sx={{marginTop:1,'.MuiAutocomplete-inputRoot':{color:'white'}}} 
                    renderInput={params => (
                        <TextField 
                            {...params} 
                            label='Internal SKU #' 
                            slotProps={{
                                inputLabel:{sx:{color:'#fff'}},
                            }}
                            name={inputName}
                        />
                    )}
                    size='small'
                />
                {!!internalSKU && <DataLine {...{internalSKU}} />}
            </Stack>
            {!!internalSKU && <IconButton onClick={deleteItem} sx={{flex:'none'}}>
                <DeleteIcon htmlColor='#ff0000' />
            </IconButton>}
        </Stack>
    )
}

const DataLine = ({internalSKU}:{internalSKU:string}) => {
    const cost = useAppSelector(state => (((state.productsReducer.internalItems as IPurchaseRecordItem[]).find(e=>e.internalSkuID === internalSKU)?.costRmb || 0) * 0.01).toFixed(2))
    const currentSingleItemPrice = useAppSelector(state => {
        const externalSKUs = (state.productsReducer.skuMapItems as ISkuMapItem[]).filter(e=>e.internal===internalSKU).map(e=>e.external)
        const uniqueExternalSKUs = [...new Set(externalSKUs)]
        const externalSKU = uniqueExternalSKUs.find(e=>externalSKUs.filter(f=>f===e).length === 1)
        return !!externalSKU ? (state.productsReducer.externalItems as IExternalItem[]).find(e=>e.externalSkuID===externalSKU)?.price || 0 : 0
    })

    return (
        <Typography>¥{cost} - £{currentSingleItemPrice}</Typography>
    )
}

export default NewSetDialog