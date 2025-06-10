import Stack from "@mui/material/Stack"
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { externalIdSelector } from "./selectors";
import { toggleEditDialog } from "@slices/products";
import { useEffect, useRef } from "react";
import ProductInformation from "./product-info";

const Content = () => {
    const timestamp = useRef(0)
    const inputValue = useRef('')
    const dispatch = useAppDispatch()
    const options = useAppSelector(externalIdSelector)
    const value = useAppSelector(state => state.productsReducer.editItemID || '')
    const onChange = (_:any, v:string|string[]|null) => dispatch(toggleEditDialog(typeof v === 'string' ? v : ''))
    const otherKeyPressed = (e:KeyboardEvent) => e.altKey || e.shiftKey || e.ctrlKey || e.metaKey

    const ev = (e:KeyboardEvent) => {
        // console.log(e)
        // if (!['BODY','body'].includes((e.target as HTMLElement).nodeName)) return
        if (e.timeStamp - timestamp.current > 20) {
            if (e.key.length === 1 && !otherKeyPressed(e)) inputValue.current = e.key
        } else {
            if (e.key.length === 1 && !otherKeyPressed(e)) inputValue.current += e.key
            else if (e.key === 'Enter') {
                dispatch(toggleEditDialog(inputValue.current))
                inputValue.current = ''
            }
        }
        timestamp.current = e.timeStamp
    }

    useEffect(()=>{
        window.addEventListener('keydown',ev)
        return () => {
            window.removeEventListener('keydown',ev)
        }
    },[])

    return (
        <Stack direction='column' rowGap={2} p={2}>
            <Autocomplete 
                options={options}
                renderInput={(params) => <TextField {...params} label="SKU #" />}
                value={value}
                onChange={onChange}
            />
            {!!value && <ProductInformation />}
        </Stack>
    )
}

export default Content