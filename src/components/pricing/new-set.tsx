import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { selectAllInternalSKUs, toggleNewSetDialog } from './slice';
import { useState } from 'react';
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

const inputName = 'new-set-item'

const NewSetDialog = () => {
    const dispatch = useAppDispatch();
    const store = useStore()
    const dialogOn = useAppSelector(state => state.pricingReducer.newSetMode)
    const dialogOnClose = () => dispatch(toggleNewSetDialog())
    const [itemIDs,setItemIDs] = useState([crypto.randomUUID()])
    const [setCost,setSetCost] = useState(0)
    const recalculateSetCost = () => {
        const inputs = document.getElementsByName(inputName) as NodeListOf<HTMLInputElement>
        const inputLen = inputs.length

        let cost = 0
        const state = store.getState() as RootState

        for (let i=0; i<inputLen; i++){
            const internalSKU = inputs.item(i).value
            if (!internalSKU) continue
            const item = state.pricingReducer.internalCosts.find(e=>e.internalSkuID===internalSKU)
            if (!item) continue
            cost += item.costRmb
        }

        setSetCost(cost * 0.01)
    }
    const setTimeoutCalCost = () => setTimeout(recalculateSetCost,200)
    const addItem = () => {
        setItemIDs(prev => [...prev,crypto.randomUUID()])
        setTimeoutCalCost()
    }
    const deleteItem = (itemID:string) => {
        setItemIDs(prev => prev.filter(e=>e !== itemID))
        setTimeoutCalCost()
    }
    
    return (
        <Dialog open={dialogOn} onClose={dialogOnClose} fullWidth>
            <DialogTitle>Create New Set</DialogTitle>
            <DialogContent>
                <ImageList cols={2} sx={{overflow:'hidden'}}>
                    {itemIDs.map(id=>(
                        <Item {...{key:id,itemID:id,addItem,deleteItem}} />
                    ))}
                </ImageList>
            </DialogContent>
            <DialogActions sx={{justifyContent:'space-between'}}>
                <Typography sx={{fontWeight:'bold'}}>Total Cost: ¥{setCost.toFixed(2)}</Typography>
                <Stack direction='row' columnGap={2}>
                    <Button variant='contained'>Create Set</Button>
                    <Button variant='outlined'>Close</Button>
                </Stack>
            </DialogActions>
        </Dialog>
    )
}

const Item = (
    {
        itemID,
        addItem,
        deleteItem,
    }:{
        itemID:string;
        addItem:()=>void;
        deleteItem:(s:string)=>void;
    }
) => {
    const [internalSKU,setInternalSKU] = useState<string | null>(null)
    const updateSKU = (s:string|null) => setInternalSKU(s)
    const imgSrc = useAppSelector(state => !!internalSKU ? state.pricingReducer.internalItemSpecs.find(e=>e.internalSkuID===internalSKU)?.image || '' : '')
    const url = useAppSelector(state => !!internalSKU ? state.pricingReducer.internalItemSpecs.find(e=>e.internalSkuID===internalSKU)?.page || '#' : '#')
    
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
                title={<ImageContent {...{internalSKU,updateSKU,addItem,deleteItem:()=>deleteItem(itemID)}} />}
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
    }:{
        internalSKU:string|null;
        updateSKU:(s:string|null)=>void;
        addItem:()=>void;
        deleteItem:()=>void;
    }
) => {
    const allInternalSKUs = useAppSelector(selectAllInternalSKUs)
    const onChange = (_:any,newValue:string|null) => {
        const prevInternalSKU = structuredClone(internalSKU)
        updateSKU(newValue)
        if (!prevInternalSKU) addItem()
        if (!newValue) deleteItem()
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
    const cost = useAppSelector(state => ((state.pricingReducer.internalCosts.find(e=>e.internalSkuID === internalSKU)?.costRmb || 0) * 0.01).toFixed(2))
    const currentSingleItemPrice = useAppSelector(state => {
        const externalSKUs = state.pricingReducer.skuMapItems.filter(e=>e.internal===internalSKU).map(e=>e.external)
        const uniqueExternalSKUs = [...new Set(externalSKUs)]
        const externalSKU = uniqueExternalSKUs.find(e=>externalSKUs.filter(f=>f===e).length === 1)
        return !!externalSKU ? state.pricingReducer.externalPrices.find(e=>e.externalSkuID===externalSKU)?.price || 0 : 0
    })

    return (
        <Typography>¥{cost} - £{currentSingleItemPrice}</Typography>
    )
}

export default NewSetDialog