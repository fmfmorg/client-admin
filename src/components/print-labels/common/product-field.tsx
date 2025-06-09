import { useAppDispatch, useAppSelector } from "@store/hooks"
import { IExternalItem } from "src/interfaces"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { NumberField } from '@base-ui-components/react/number-field';
import styles from './index.module.css';
import { MinusIcon, PlusIcon } from "@misc"
import { updateLabelQty } from "@slices/products"

const EditQtyField = ({id}:{id:string}) => {
    const dispatch = useAppDispatch()
    const defaultQty = useAppSelector(state => (state.productsReducer.externalItems as IExternalItem[]).find(e => e.externalSkuID === id)?.labelQty || 0)
    const onChange = (value: number | null, e: Event | undefined) => dispatch(updateLabelQty({id,qty:!!value ? value : 0}));

    return (
        <NumberField.Root value={defaultQty} className={styles.Field} min={0} step={1} onValueChange={onChange}>
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
    )
}

const ProductField = ({id}:{id:string}) => {
    const currentPrice = useAppSelector(state => ((state.productsReducer.externalItems as IExternalItem[]).find(e => e.externalSkuID === id)?.price || 0).toFixed(2))
    return (
        <Stack direction='column'>
            <Typography variant='body2'>{id} - £{currentPrice}</Typography>
            <EditQtyField {...{id}} />
        </Stack>
    )
}

export default ProductField