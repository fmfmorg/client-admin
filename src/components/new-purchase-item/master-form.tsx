import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Stack from "@mui/material/Stack";
import { ChangeEvent, useState } from "react";
import NewItemForm from "./new-item-form";
import OldItemForm from "./old-item-form";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

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
    const [loading,setLoading] = useState(false)
    const uploadLoading = (v:boolean) => setLoading(v)
    const updateExternal = (v:string) => setExternal(v)
    const updateInternal = (v:string) => setInternal(v)
    const [newItem,setNewItem] = useState(false)
    const newItemCheckboxOnChange = (e:ChangeEvent<HTMLInputElement>) => setNewItem(e.target.checked)

    return (
        <>
        <Stack direction='row' justifyContent='center'>
            <Stack direction='column' spacing={2} sx={{maxWidth:'800px',width:'100%'}}>
                <FormControlLabel control={<Checkbox onChange={newItemCheckboxOnChange} checked={newItem} />} label='New Item' sx={{width:'fit-content'}} />
                {newItem ? <NewItemForm {...{external,internal,updateExternal,updateInternal,uploadLoading}} /> : <OldItemForm {...{uploadLoading}} />}
            </Stack>
        </Stack>
        <Backdrop 
            open={loading}
            sx={(theme) => ({ zIndex: theme.zIndex.drawer + 1 })}
        >
            <CircularProgress 
                sx={{
                    color:'#fff',
                    scale:3,
                    strokeLinecap:'round',
                    'circle':{animation:'5s'},
                }} 
            />
        </Backdrop>
        </>
    )
}

export default MasterForm