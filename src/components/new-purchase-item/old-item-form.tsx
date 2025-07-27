import Stack from "@mui/material/Stack"
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { useAppSelector } from "@store/hooks"
import { selectInternalProductIDs } from "./selectors"
import { FormEvent, useContext, useEffect, useId, useRef, useState } from "react";
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

const OldItemForm = (
    {
        uploadLoading,
    }:{
        uploadLoading:(v:boolean)=>void;
    }
) => {
    const quantityFieldID = useId()
    const productIDs = useAppSelector(selectInternalProductIDs)
    const initialProductID = useRef('')
    const [productID,setProductID] = useState(initialProductID.current)
    const initialQuantity = useRef(3)
    const [quantity,setQuantity] = useState(initialQuantity.current)
    const onChange = (_:any,v:string|null) => {
        if (!!v) setProductID(v)
    }
    const quantityOnChange = (v: number | null, _: Event | undefined) => {
        if (v !== null) setQuantity(v)
    }

    const movementList = useAppSelector(selectMovementList)
    const [movement,setMovement] = useState(0)
    const movementIDsOnChange = (e:SelectChangeEvent<number>) => setMovement(e.target.value as number)

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
            <Button type='submit' variant="contained" disabled={!productID} fullWidth>Submit</Button>
        </Stack>
    )
}

export default OldItemForm