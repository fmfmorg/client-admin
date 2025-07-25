import { selectMetalColorList, selectProductTypeList, selectSupplierList } from "@components/pricing/selectors";
import { selectMovementList } from "@components/purchase-quantity/selectors";
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography";
import { useAppSelector } from "@store/hooks";
import { FormEvent, useState } from "react";
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

const NewItemForm = (
    {
        external,
        internal,
        updateExternal,
        updateInternal,
    }:{
        external:string;
        internal:string;
        updateExternal:(v:string)=>void;
        updateInternal:(v:string)=>void;
    }
) => {
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

    const onSubmit = (e:FormEvent) => {
        e.preventDefault()
    }

    return (
        <Stack direction='column' rowGap={2} component='form' onSubmit={onSubmit}>
            <Stack direction='row' rowGap={2}>
                <Typography>External: {external}</Typography>
                <Typography>Internal: {internal}</Typography>
            </Stack>
            <Stack direction='row' rowGap={2}>
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
            <Stack direction='row' rowGap={2}>
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
            <Stack direction='row' rowGap={2}>
                <TextField fullWidth label='URL' required />
                <TextField fullWidth label='Subitem Name' />
            </Stack>
            <Stack direction='row' rowGap={2}>
                <TextField fullWidth label='Cost RMB' type='number' slotProps={{htmlInput:{step:0.01}}} required />
            </Stack>
            <Button type='submit' variant="contained" fullWidth>Submit</Button>
        </Stack>
    )
}

export default NewItemForm