import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { selectMetalColorList, selectProductTypeList, selectSupplierList, toggleEditDialog } from './purchaseQuantitySlice';
import { ChangeEvent, JSX, useEffect, useState } from 'react';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import { useStore } from 'react-redux';
import { RootState } from '@store/store';
import TextField from '@mui/material/TextField';

const Row = ({children}:{children:JSX.Element}) => (
    <Stack direction='row' spacing={1} width='100%'>{children}</Stack>
)

const EditDialog = () => {
    const dispatch = useAppDispatch()
    const store = useStore()
    const editItemID = useAppSelector(state => state.purchaseQuantityReducer.editItemID)
    const dialogOnClose = () => dispatch(toggleEditDialog(''))

    const supplierList = useAppSelector(selectSupplierList)
    const [supplier,setSupplier] = useState(1)
    const supplierOnChange = (ev:SelectChangeEvent<number>) => setSupplier(ev.target.value as number)

    const metalColorList = useAppSelector(selectMetalColorList)
    const [metalColor,setMetalColor] = useState(1)
    const metalColorOnChange = (ev:SelectChangeEvent<number>) => setMetalColor(ev.target.value as number)

    const productTypeList = useAppSelector(selectProductTypeList)
    const [productType,setProductType] = useState(1)
    const productTypeOnChange = (ev:SelectChangeEvent<number>) => setProductType(ev.target.value as number)

    const [imgPath,setImgPath] = useState('')
    const imgPathOnChange = (e:ChangeEvent<HTMLInputElement>) => setImgPath(e.target.value)

    useEffect(()=>{
        if (!editItemID) return
        const state = store.getState() as RootState
        setSupplier(state.purchaseQuantityReducer.internalItemSpecs.find(e => e.internalSkuID === editItemID)?.supplierID || 1)
        setMetalColor(state.purchaseQuantityReducer.internalItemSpecs.find(e => e.internalSkuID === editItemID)?.metalColorID || 1)
        setProductType(state.purchaseQuantityReducer.internalItemSpecs.find(e => e.internalSkuID === editItemID)?.productTypeID || 1)
        setImgPath(state.purchaseQuantityReducer.internalItemSpecs.find(e => e.internalSkuID === editItemID)?.image || '')
    },[editItemID])

    return (
        <Dialog open={!!editItemID} onClose={dialogOnClose} fullWidth>
            <DialogTitle>Edit {editItemID}</DialogTitle>
            <DialogContent>
                <Stack direction='column' rowGap={2} marginTop={1} component='form' onSubmit={()=>{}}>
                    <Row>
                        <>
                        <FormControl fullWidth required>
                            <InputLabel id='metal-color-id'>Metal Colour</InputLabel>
                            <Select required labelId='metal-color-id' label='Metal Colour' value={metalColor} onChange={metalColorOnChange}>
                                {metalColorList.map(({id,name})=>(<MenuItem key={id} value={id}>{name}</MenuItem>))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth required>
                            <InputLabel id='product-type-id'>Product Type</InputLabel>
                            <Select required labelId='product-type-id' label='Product Type' value={productType} onChange={productTypeOnChange}>
                                {productTypeList.map(({id,name})=>(<MenuItem key={id} value={id}>{name}</MenuItem>))}
                            </Select>
                        </FormControl>
                        </>
                    </Row>
                    <Row>
                        <>
                        <FormControl fullWidth required>
                            <InputLabel id='supplier-id'>Supplier</InputLabel>
                            <Select required labelId='supplier-id' label='Supplier' value={supplier} onChange={supplierOnChange}>
                                {supplierList.map(({id,name})=>(<MenuItem key={id} value={id}>{name}</MenuItem>))}
                            </Select>
                        </FormControl>
                        <TextField fullWidth label="Image URL" value={imgPath} onChange={imgPathOnChange} />
                        </>
                    </Row>
                </Stack>
            </DialogContent>
        </Dialog>
    )
}

export default EditDialog