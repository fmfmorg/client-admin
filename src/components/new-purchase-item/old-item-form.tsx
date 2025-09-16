import Stack from "@mui/material/Stack"
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { useAppSelector } from "@store/hooks"
import { selectInternalProductIDs } from "./selectors"
import { ChangeEvent, FormEvent, useContext, useEffect, useId, useMemo, useRef, useState } from "react";
import styles from './index.module.css';
import { NumberField } from '@base-ui-components/react/number-field';
import { httpRequestHeader, MinusIcon, PlusIcon } from "@misc";
import Button from "@mui/material/Button";
import { selectMovementList } from "@components/purchase-quantity/selectors";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import { CsrfContext } from "@context";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Grid from '@mui/material/Grid2'
import { IProductSupplierItem, IPurchaseRecordItem, ISpecification } from "src/interfaces";
import { useStore } from "react-redux";
import { RootState } from "@store/store";
import { selectSupplierList } from "@components/pricing/selectors";

const OldItemForm = (
    {
        uploadLoading,
        _productSupplierItems,
    }:{
        uploadLoading:(v:boolean)=>void;
        _productSupplierItems:IProductSupplierItem[];
    }
) => {
    const store = useStore()
    const quantityFieldID = useId()
    const newSupplierLabelID = useId()
    const currentSupplierLabelID = useId()

    const urlRef = useRef<HTMLInputElement>(null)
    const subitemNameRef = useRef<HTMLInputElement>(null)

    const productIDs = useAppSelector(selectInternalProductIDs)
    const initialProductID = useRef('')
    const productSupplierItems = useRef(new Map<number,number>(_productSupplierItems.map(e => ([e.productSupplierID,e.supplierID]))))
    const [productID,setProductID] = useState(initialProductID.current)
    const initialQuantity = useRef(3)
    const [quantity,setQuantity] = useState(initialQuantity.current)
    const onChange = (_:any,v:string|null) => {
        if (!!v) setProductID(v)
    }
    const quantityOnChange = (v: number | null, _: NumberField.Root.ChangeEventDetails) => {
        if (v !== null) setQuantity(v)
    }

    const currentSupplierList = useMemo(()=>{
        if (!productID) return []

        const state = store.getState() as RootState

        const purchaseRecords = (state.productsReducer.internalItems as IPurchaseRecordItem[]).filter(e => e.internalSkuID === productID)
        if (!purchaseRecords.length) return []

        const productSupplierIDs = [...new Set(purchaseRecords.sort((a,b)=>b.movementID - a.movementID).map(e => e.productSupplierID))]

        let arr:ISpecification[] = []

        for (const ps of productSupplierIDs){
            const supplierID = productSupplierItems.current.get(ps)
            if (!supplierID) continue

            const supplier = (state.productsReducer.suppliers as ISpecification[]).find(e => e.id === supplierID)
            if (!supplier) continue

            arr = [...arr,{id:ps,name:supplier.name}]
        }

        return arr
    },[productID])

    const [currentSupplier,setCurrentSupplier] = useState(0)
    const currentSupplierOnSelect = (e:SelectChangeEvent<number>) => setCurrentSupplier(e.target.value as number)

    const movementList = useAppSelector(selectMovementList)
    const [movement,setMovement] = useState(0)
    const [isNewSupplier,setIsNewSupplier] = useState(false)


    const newSupplierList = useAppSelector(selectSupplierList)
    const [newSupplier,setNewSupplier] = useState(newSupplierList[0].id)
    // const newSuppliersOnChange = (e:SelectChangeEvent<number>) => setNewSupplier(e.target.value as number)

    const movementIDsOnChange = (e:SelectChangeEvent<number>) => setMovement(e.target.value as number)
    const toggleNewSupplier = (e:ChangeEvent<HTMLInputElement>) => setIsNewSupplier(e.target.checked)

    const costRef = useRef<HTMLInputElement>(null)
    const {csrfToken} = useContext(CsrfContext)

    const reset = () => {
        if (!costRef.current) return
        setProductID(initialProductID.current)
        setQuantity(initialQuantity.current)
        costRef.current.value = ''
        uploadLoading(false)
    }

    const onSubmit = async(e:FormEvent) => {
        e.preventDefault()
        if (!costRef.current) return

        uploadLoading(true)

        const resp = await fetch('/api/admin/old-item-submit',{
            method:"POST",
            headers:httpRequestHeader(false,'client',true,csrfToken),
            body:JSON.stringify({
                productID,
                quantity,
                movement,
                costRMB:Math.round(+costRef.current.value.trim() * 100)
            })
        })

        if (!resp.ok){
            reset()
            const text = await resp.text()
            alert(text)
            return
        }

        reset()
    }

    useEffect(()=>{
        if (!!movementList.length) setMovement(movementList[0].id)
    },[movementList])

    useEffect(()=>{
        if (!!currentSupplierList.length) setCurrentSupplier(currentSupplierList[0].id);
        else setCurrentSupplier(0);
    },[currentSupplierList])

    return (
        <Stack direction='column' spacing={2} component='form' onSubmit={onSubmit}>
            <Stack direction='row' spacing={2}>
                <FormControl fullWidth>
                    <InputLabel id='movement-id'>Date</InputLabel>
                    <Select labelId='movement-id' label='Order Date' value={movement} onChange={movementIDsOnChange}>
                        {movementList.map(({id,name})=>(<MenuItem key={id} value={id}>{name}</MenuItem>))}
                    </Select>
                </FormControl>
                <Autocomplete 
                    disablePortal
                    renderInput={(params) => <TextField {...params} label="Product ID" />}
                    options={productIDs}
                    fullWidth
                    onChange={onChange}
                    value={productID}
                />
            </Stack>
            <Stack direction='row' spacing={2}>
                <TextField fullWidth label='Cost RMB' type='number' inputRef={costRef} slotProps={{htmlInput:{step:0.01}}} required />
                <NumberField.Root required id={quantityFieldID} value={quantity} className={styles.Field} min={1} step={1} onValueChange={quantityOnChange}>
                    <NumberField.Group className={styles.Group}>
                        <NumberField.Decrement className={styles.Decrement}>
                            <MinusIcon />
                        </NumberField.Decrement>
                        <NumberField.Input className={styles.Input} />
                        <NumberField.Increment className={styles.Increment}>
                            <PlusIcon />
                        </NumberField.Increment>
                    </NumberField.Group>
                </NumberField.Root>
            </Stack>
            <Grid container direction='row'>
                <Grid size={6}>
                    <FormControlLabel control={<Checkbox onChange={toggleNewSupplier} checked={isNewSupplier} />} label='New Item' sx={{width:'fit-content'}} />
                </Grid>
                {!isNewSupplier && !!currentSupplier && <Grid size={6}>
                    <FormControl fullWidth>
                        <InputLabel id={currentSupplierLabelID}>Supplier</InputLabel>
                        <Select
                            labelId={currentSupplierLabelID}
                            value={currentSupplier}
                            label='Supplier'
                            onChange={currentSupplierOnSelect}
                        >
                            {currentSupplierList.map(e => <MenuItem key={e.id} value={e.id}>{e.name}</MenuItem>)}
                        </Select>
                    </FormControl>
                </Grid>}
                {/* {isNewSupplier && <Grid size={6}>
                    <FormControl fullWidth>
                        <InputLabel id={newSupplierLabelID}>Suppliers</InputLabel>
                        <Select labelId={newSupplierLabelID} label='Suppliers' value={newSupplier} onChange={newSuppliersOnChange}>
                            {newSupplierList.map(({id,name})=>(<MenuItem key={id} value={id}>{name}</MenuItem>))}
                        </Select>
                    </FormControl>    
                </Grid>} */}
            </Grid>
            <Stack direction='row' spacing={2} display={isNewSupplier ? 'flex' : 'none'}>
                <TextField fullWidth label='URL' required inputRef={urlRef} />
                <TextField fullWidth label='Subitem Name' inputRef={subitemNameRef} />
            </Stack>
            <Button type='submit' variant="contained" disabled={!productID} fullWidth>Submit</Button>
        </Stack>
    )
}

export default OldItemForm