import { selectMetalColorList, selectProductTypeList, selectSupplierList } from "@components/pricing/selectors";
import { selectMovementList } from "@components/purchase-quantity/selectors";
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { FormEvent, useContext, useId, useRef, useState } from "react";
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { httpRequestHeader } from "@misc/http-request-header";
import { CsrfContext } from "@context";
import { NumberField } from "@base-ui-components/react/number-field";
import styles from './index.module.css';
import { MinusIcon, PlusIcon } from "@misc";
import { addNewPurchaseItem } from "@slices/products";

const NewItemForm = (
    {
        external,
        internal,
        updateExternal,
        updateInternal,
        uploadLoading,
    }:{
        external:string;
        internal:string;
        updateExternal:(v:string)=>void;
        updateInternal:(v:string)=>void;
        uploadLoading:(v:boolean)=>void;
    }
) => {
    const urlRef = useRef<HTMLInputElement>(null)
    const subitemNameRef = useRef<HTMLInputElement>(null)
    const costRef = useRef<HTMLInputElement>(null)

    const dispatch = useAppDispatch()

    const supplierList = useAppSelector(selectSupplierList)
    const [supplier,setSupplier] = useState(supplierList[0].id)
    const suppliersOnChange = (e:SelectChangeEvent<number>) => setSupplier(e.target.value as number)

    const productTypeList = useAppSelector(selectProductTypeList)
    const [productType,setProductType] = useState(productTypeList[0].id)
    const productTypesOnChange = (e:SelectChangeEvent<number>) => setProductType(e.target.value as number)

    const metalColorList = useAppSelector(selectMetalColorList)
    const [metalColor,setMetalColor] = useState(metalColorList[0].id)
    const metalColorsOnChange = (e:SelectChangeEvent<number>) => setMetalColor(e.target.value as number)

    const movementList = useAppSelector(selectMovementList)
    const [movement,setMovement] = useState(movementList[0].id)
    const movementIDsOnChange = (e:SelectChangeEvent<number>) => setMovement(e.target.value as number)

    const {csrfToken} = useContext(CsrfContext)
    const quantityFieldID = useId()

    const initialQuantity = useRef(3)
    const [quantity,setQuantity] = useState(initialQuantity.current)
    const quantityOnChange = (v: number | null, _: Event | undefined) => {
        if (v !== null) setQuantity(v)
    }

    const reset = () => {
        if (!costRef.current || !urlRef.current || !subitemNameRef.current) return
        setQuantity(initialQuantity.current)
        costRef.current.value = ''
        urlRef.current.value = ''
        subitemNameRef.current.value = ''
        uploadLoading(false)
    }

    const onSubmit = async(e:FormEvent) => {
        e.preventDefault()
        if (!costRef.current || !urlRef.current || !subitemNameRef.current) return

        uploadLoading(true)

        const costRMB = Math.round(+costRef.current.value.trim() * 100)
        const url = urlRef.current.value.trim()
        const subitemName = subitemNameRef.current.value.trim()

        const resp = await fetch('/api/admin/new-item-submit',{
            method:"POST",
            headers:httpRequestHeader(false,'client',true,csrfToken),
            body:JSON.stringify({
                external,
                internal,
                quantity,
                movement,
                costRMB,
                url,
                subitemName,
                supplier,
                productType,
                metalColor,
            })
        })

        if (!resp.ok){
            reset()
            const text = await resp.text()
            alert(text)
            return
        }

        dispatch(addNewPurchaseItem({
            externalID:external,
            internalID:internal,
            metalColorID:metalColor,
            productTypeID:productType,
            supplierID:supplier,
            page:url,
            variation:subitemName,
            costRmb:costRMB,
            movementID:movement,
            purchaseQuantity:quantity,
        }))

        const {_external,_internal} = await resp.json() as {_external:string;_internal:string;}
        updateExternal(_external)
        updateInternal(_internal)

        reset()
    }

    return (
        <Stack direction='column' spacing={2} component='form' onSubmit={onSubmit}>
            <Stack direction='row' spacing={2}>
                <Typography>External: {external}</Typography>
                <Typography>Internal: {internal}</Typography>
            </Stack>
            <Stack direction='row' spacing={2}>
                <FormControl fullWidth>
                    <InputLabel id='movement-id'>Date</InputLabel>
                    <Select labelId='movement-id' label='Order Date' value={movement} onChange={movementIDsOnChange}>
                        {movementList.map(({id,name})=>(<MenuItem key={id} value={id}>{name}</MenuItem>))}
                    </Select>
                </FormControl>
                <FormControl fullWidth>
                    <InputLabel id='supplier-id'>Suppliers</InputLabel>
                    <Select labelId='supplier-id' label='Suppliers' value={supplier} onChange={suppliersOnChange}>
                        {supplierList.map(({id,name})=>(<MenuItem key={id} value={id}>{name}</MenuItem>))}
                    </Select>
                </FormControl>
            </Stack>
            <Stack direction='row' spacing={2}>
                <FormControl fullWidth>
                    <InputLabel id='metal-color-id'>Metal Colour</InputLabel>
                    <Select labelId='metal-color-id' label='Metal Colour' value={metalColor} onChange={metalColorsOnChange}>
                        {metalColorList.map(({id,name})=>(<MenuItem key={id} value={id}>{name}</MenuItem>))}
                    </Select>
                </FormControl>
                <FormControl fullWidth>
                    <InputLabel id='product-type-id'>Product Type</InputLabel>
                    <Select labelId='product-type-id' label='Product Type' value={productType} onChange={productTypesOnChange}>
                        {productTypeList.map(({id,name})=>(<MenuItem key={id} value={id}>{name}</MenuItem>))}
                    </Select>
                </FormControl>
            </Stack>
            <Stack direction='row' spacing={2}>
                <TextField fullWidth label='URL' required inputRef={urlRef} />
                <TextField fullWidth label='Subitem Name' inputRef={subitemNameRef} />
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
            <Button type='submit' variant="contained" fullWidth>Submit</Button>
        </Stack>
    )
}

export default NewItemForm