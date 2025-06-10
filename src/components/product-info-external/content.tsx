import Stack from "@mui/material/Stack"
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useAppSelector } from "@store/hooks";
import { externalIdSelector } from "./selectors";

const Content = () => {
    const options = useAppSelector(externalIdSelector)
    return (
        <Stack direction='column' rowGap={2} p={2}>
            <Autocomplete 
                options={options}
                renderInput={(params) => <TextField {...params} label="SKU #" />}
            />
        </Stack>
    )
}

export default Content