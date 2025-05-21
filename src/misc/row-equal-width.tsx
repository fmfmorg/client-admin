import Stack from "@mui/material/Stack"
import { JSX } from "react"

const RowEqualWidth = ({children}:{children:JSX.Element}) => (
    <Stack direction='row' spacing={1} width='100%'>{children}</Stack>
)

export default RowEqualWidth