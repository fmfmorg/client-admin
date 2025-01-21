import { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import { IProductMeasurement } from 'src/interfaces';

const rowClassName = 'measurement-row'

export const newMeasurementItem = () => ({
    id:crypto.randomUUID(),width:0,depth:0,height:0,weight:0
})

const getInputValue = (row:HTMLElement, className:string) => {
    const container = row.getElementsByClassName(className)[0] as HTMLElement
    const input = container.getElementsByTagName('input')[0]
    const value = +input.value.trim()

    return isNaN(value) ? 0 : Math.ceil(value)
}

export const getMeasurementInput = () => {
    const rows = document.getElementsByClassName(rowClassName) as HTMLCollectionOf<HTMLElement>

    const len = rows.length

    if (!len) return []

    let measurements:IProductMeasurement[] = []

    for (let i=0; i<len; i++){
        const row = rows.item(i) as HTMLElement
        const width = getInputValue(row,'width')
        const depth = getInputValue(row,'depth')
        const height = getInputValue(row,'height')
        const weight = getInputValue(row,'weight')

        if (!!width || !!depth || !!height || !!weight) measurements = [...measurements,{width,depth,height,weight}]
    }
    return measurements
}

const inputProps = (defaultValue:number,className:string) => ({
    fullWidth:true,
    type:'number',
    slotProps:{htmlInput:{step:1,min:0,max:2000}},
    ...defaultValue && {defaultValue},
    className,
    placeholder:`${className.charAt(0).toUpperCase()}${className.slice(1)} (${className === 'weight' ? 'g' : 'mm'})`
})

const MeasurementRow = (
    {
        onDelete,
        width,
        depth,
        height,
        weight,
    }:{
        onDelete:()=>void;
        width:number;
        depth:number;
        height:number;
        weight:number;
    }
) => (
    <TableRow className={rowClassName}>
        <TableCell>
            <TextField {...inputProps(width,'width')}  />
        </TableCell>
        <TableCell>
            <TextField {...inputProps(depth,'depth')} />
        </TableCell>
        <TableCell>
            <TextField {...inputProps(height,'height')} />
        </TableCell>
        <TableCell>
            <TextField {...inputProps(weight,'weight')} />
        </TableCell>
        <TableCell>
            <IconButton onClick={onDelete}>
                <DeleteIcon />
            </IconButton>
        </TableCell>
    </TableRow>
)

const MeasurementTable = (
    {
        measurements:_measurements,
    }:{
        measurements:IProductMeasurement[];
    }
) => {
    const [measurements,setMeasurements] = useState<IProductMeasurement[]>(_measurements)
    const addRow = () => setMeasurements(prev => [...prev,newMeasurementItem()])
    const deleteRow = (id:string) => setMeasurements(prev => [...prev.filter(e=>e.id !== id)])

    return (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Width (mm)</TableCell>
                        <TableCell>Depth (mm)</TableCell>
                        <TableCell>Height (mm)</TableCell>
                        <TableCell>Weight (g)</TableCell>
                        <TableCell>Delete</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {!!measurements && !!measurements.length && measurements.map(e=>(
                        <MeasurementRow key={e.id as string} onDelete={()=>deleteRow(e.id as string)} {...e} />
                    ))}
                    <TableRow>
                        <TableCell colSpan={5}>
                            <Button variant='outlined' fullWidth onClick={addRow} startIcon={<AddIcon />}>Add Row</Button>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default MeasurementTable