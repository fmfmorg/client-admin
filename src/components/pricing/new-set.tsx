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

const NewSetDialog = () => {
    const dispatch = useAppDispatch();
    const dialogOn = useAppSelector(state => state.pricingReducer.newSetMode)
    const dialogOnClose = () => dispatch(toggleNewSetDialog())
    const [itemIDs,setItemIDs] = useState([crypto.randomUUID()])
    const addItem = () => setItemIDs(prev => [...prev,crypto.randomUUID()])
    const deleteItem = (itemID:string) => setItemIDs(prev => prev.filter(e=>e !== itemID))
    
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
            <DialogActions></DialogActions>
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
                title={<Info {...{internalSKU,updateSKU,addItem,deleteItem:()=>deleteItem(itemID)}} />}
                sx={{display:'flex'}}
            />
        </ImageListItem>
    )
}

const Info = (
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
                    sx={{marginTop:1}} 
                    slotProps={{paper:{sx:{color:'red'}}}}
                    renderInput={params => (
                        <TextField 
                            {...params} 
                            label='Internal SKU #' 
                            slotProps={{
                                inputLabel:{sx:{color:'#fff'}},
                            }} 
                        />
                    )}
                />
            </Stack>
            {!!internalSKU && <IconButton onClick={deleteItem} sx={{flex:'none'}}>
                <DeleteIcon htmlColor='#fff' />
            </IconButton>}
        </Stack>
    )
}

export default NewSetDialog