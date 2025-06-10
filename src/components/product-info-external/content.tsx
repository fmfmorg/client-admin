import Stack from "@mui/material/Stack"
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { externalIdSelector } from "./selectors";
import { toggleEditDialog } from "@slices/products";
import { useEffect, useRef } from "react";

const Content = () => {
    // const inputValue = useRef('')
    const dispatch = useAppDispatch()
    const options = useAppSelector(externalIdSelector)
    const value = useAppSelector(state => state.productsReducer.editItemID || '')
    const onChange = (_:any, v:string|string[]|null) => dispatch(toggleEditDialog(typeof v === 'string' ? v : ''))

    const ev = (e:Event) => {
        console.log(e)
        // if (!['BODY','body'].includes((e.target as HTMLElement).nodeName)) return
        // if (e.key )
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
        </Stack>
    )
}

export default Content