import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Stack from "@mui/material/Stack";
import { ChangeEvent, useState } from "react";
import NewItemForm from "./new-item-form";
import OldItemForm from "./old-item-form";

const MasterForm = (
    {
        _external,
        _internal,
    }:{
        _external:string;
        _internal:string;
    }
) => {
    const [external,setExternal] = useState(_external)
    const [internal,setInternal] = useState(_internal)
    const updateExternal = (v:string) => setExternal(v)
    const updateInternal = (v:string) => setInternal(v)
    const [newItem,setNewItem] = useState(false)
    const newItemCheckboxOnChange = (e:ChangeEvent<HTMLInputElement>) => setNewItem(e.target.checked)

    return (
        <Stack direction='row' justifyContent='center'>
            <Stack direction='column' sx={{maxWidth:'800px'}}>
                <FormControlLabel control={<Checkbox onChange={newItemCheckboxOnChange} checked={newItem} />} label='New Item' />
                {newItem ? <NewItemForm {...{external,internal,updateExternal,updateInternal}} /> : <OldItemForm />}
            </Stack>
        </Stack>
    )
}

export default MasterForm