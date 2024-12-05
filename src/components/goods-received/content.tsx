import { ChangeEvent, FormEvent, useContext, useEffect, useRef, useState } from 'react';
import Grid from '@mui/material/Grid'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import { GoodsReceivedContext } from './context'
import { IGoodsReceivedRequest } from './interfaces';
import { IProductImage, ISpecification } from 'src/interfaces';
import { httpRequestHeader } from '@misc';
import { CsrfContext } from '@context';

const rowClassName = 'goods-received-row'

const GoodsReceivedRow = (
    {
        onDelete,
    }:{
        onDelete:()=>void;
    }
) => {
    const { productIDs, imageMap } = useContext(GoodsReceivedContext)

    const [imageFilename, setImagefilename] = useState('')
    
    const onChange = (_:any, newValue:string|null) => {
        if (!!newValue) setImagefilename(imageMap.get(newValue) || '')
    }

    return (
        <TableRow className={rowClassName}>
            <TableCell>
                <Autocomplete 
                    disablePortal 
                    options={productIDs}
                    renderInput={params=>(<TextField required {...params} label='Product ID' sx={{minWidth:'150px'}} />)}
                    className='pid'
                    onChange={onChange}
                />
                {!!imageFilename &&
                <Card>
                    <CardMedia 
                        component='img'
                        sx={{
                            height: 0,
                            paddingTop: '100%', // 1:1 aspect ratio
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundImage: `url(${process.env.NEXT_PUBLIC_FM_ADMIN_IMAGE_URL_PREFIX + imageFilename})`,
                        }}
                    />
                </Card>
                }
            </TableCell>
            <TableCell>
                <TextField required fullWidth className='location' placeholder='Location' />
            </TableCell>
            <TableCell>
                <TextField required fullWidth className='quantity' type="number" placeholder='Quantity' />
            </TableCell>
            <TableCell>
                <IconButton onClick={onDelete}>
                    <DeleteIcon />
                </IconButton>
            </TableCell>
        </TableRow>
    )
}

const GoodsReceivedContent = (
    {
        productIDs,
        invMvmtTypes,
        imageList
    }:{
        productIDs: string[];
        invMvmtTypes: ISpecification[];
        imageList: IProductImage[];
    }
) => {
    const { csrfToken } = useContext(CsrfContext)
    const [rowIDs, setRowIDs] = useState<string[]>([crypto.randomUUID()])
    const [invMvmtType,setIntMvmtType] = useState(1)

    const imageMapRef = useRef<Map<string,string>>(new Map(imageList.map(({productID, filename})=>([productID,filename]))))

    const addRow = () => setRowIDs(prev => [...prev,crypto.randomUUID()])

    const deleteRow = (rowID:string) => setRowIDs(prev => [...prev.filter(e=>e !== rowID)])

    const invMvmtTypeOnChange = (e:SelectChangeEvent<number>) => setIntMvmtType(e.target.value as number)

    const onSubmit = async(e:FormEvent) => {
        e.preventDefault()
        
        const rows = document.getElementsByClassName(rowClassName) as HTMLCollectionOf<HTMLElement>
        const len = rows.length

        if (!len) return

        let itemsReceived:IGoodsReceivedRequest[] = []

        for (let i=0; i<len; i++){
            const row = rows.item(i) as HTMLElement

            const pidContainer = row.getElementsByClassName('pid')[0] as HTMLElement
            const locationContainer = row.getElementsByClassName('location')[0] as HTMLElement
            const quantityContainer = row.getElementsByClassName('quantity')[0] as HTMLElement
    
            const pidInput = pidContainer.getElementsByTagName('input')[0]
            const locationInput = locationContainer.getElementsByTagName('input')[0]
            const quantityInput = quantityContainer.getElementsByTagName('input')[0]
    
            const productID = pidInput.value.trim().toUpperCase()
            const location = locationInput.value.trim().toUpperCase()
            const quantity = +quantityInput.value.trim()

            if (productIDs.indexOf(productID) === -1) {
                pidInput.focus()
                alert('Wrong product ID')
                return
            } else if (isNaN(quantity) || quantity < 1 || !Number.isSafeInteger(quantity)) {
                quantityInput.focus()
                alert('Wrong quantity')
                return
            }

            itemsReceived = [...itemsReceived,{productID,location,quantity}]
        }

        const resp = await fetch('/api/admin/goods-received',{
            method:"POST",
            headers:httpRequestHeader(false,'client',true,csrfToken),
            body:JSON.stringify({itemsReceived,invMvmtType})
        })

        if (resp.ok){
            setRowIDs([])
            alert('Update successful')
        } else {
            const { status } = resp
            const errorMsg = await resp.text()
            alert(`error ${status}: ${errorMsg}`)
        }
    }

    return (
        <Grid container spacing={2} component='form' onSubmit={onSubmit}
            sx={{
                '& td:first-of-type':{
                    fontWeight:'bold'
                },
                '@media screen and (max-width:600px)':{
                    '& tr':{
                        border:'1px solid white',
                    },
                    '& td':{
                        display: 'block',
                        border:'none !important',
                    },
                }
            }}
        >
            <Grid item xs={12} lg={8}>
                {!!invMvmtTypes && !!invMvmtTypes.length && <FormControl fullWidth  sx={{marginBottom:2}}>
                    <InputLabel id='inv-mvmt-type-id'>Select Order Type</InputLabel>
                    <Select 
                        labelId='inv-mvmt-type-id'
                        value={invMvmtType}
                        label='Select Order Type'
                        required
                        onChange={invMvmtTypeOnChange}
                    >
                        {invMvmtTypes.map(({id,name})=>(
                            <MenuItem key={id} value={id}>{name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>}
                <TableContainer>
                    <Table sx={{
                        '@media screen and (max-width:600px)':{
                            '& td:not(:first-of-type)':{
                                paddingTop:0.25
                            },
                            '& td:not(:last-of-type)':{
                                paddingBottom:0.25
                            },
                        }}}
                    >
                        <TableHead sx={{'@media screen and (max-width:600px)':{display:'none'}}}>
                            <TableRow>
                                <TableCell>Product ID</TableCell>
                                <TableCell>Location</TableCell>
                                <TableCell>Quantity</TableCell>
                                <TableCell>Delete</TableCell>
                            </TableRow>
                        </TableHead>
                        <GoodsReceivedContext.Provider value={{productIDs,imageMap:imageMapRef.current}}>
                            <TableBody>
                                {!!rowIDs && !!rowIDs.length && rowIDs.map(rowID=>(
                                    <GoodsReceivedRow key={rowID} onDelete={()=>deleteRow(rowID)} />
                                ))}
                            </TableBody>
                        </GoodsReceivedContext.Provider>
                    </Table>
                </TableContainer>
            </Grid>
            <Grid item xs={12} lg={8}>
                <Button variant='outlined' fullWidth onClick={addRow} startIcon={<AddIcon />}>Add Row</Button>
                <Button variant='contained' fullWidth type='submit' sx={{marginTop:2}}>Submit</Button>
            </Grid>
        </Grid>
    )
}

export default GoodsReceivedContent