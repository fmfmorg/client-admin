import Stack from "@mui/material/Stack"
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { useAppSelector } from "@store/hooks"
import { selectInternalProductIDs } from "./selectors"
import { FormEvent, useId, useRef, useState } from "react";
import styles from './index.module.css';
import { NumberField } from '@base-ui-components/react/number-field';
import { MinusIcon, PlusIcon } from "@misc";
import Button from "@mui/material/Button";

const OldItemForm = () => {
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
    const onSubmit = (e:FormEvent) => {
        e.preventDefault()

        setProductID(initialProductID.current)
        setQuantity(initialQuantity.current)
    }

    return (
        <Stack direction='column' spacing={1} component='form' onSubmit={onSubmit}>
            <Stack direction='row' spacing={1}>
                <Autocomplete 
                    disablePortal
                    renderInput={(params) => <TextField {...params} label="Product ID" />}
                    options={productIDs}
                    fullWidth
                    onChange={onChange}
                />
                <NumberField.Root id={quantityFieldID} value={quantity} className={styles.Field} min={1} step={1} onValueChange={quantityOnChange}>
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