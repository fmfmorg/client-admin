import React, { useContext, useMemo, useRef, useState } from 'react';
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Grid from '@mui/material/Grid'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { CsrfContext } from '@context';
import { IProduct, IProductTypes, ISpecification } from 'src/interfaces';
import { formatDate, formatPrice, httpRequestHeader } from '@misc';

const EditProductContent = (
    {
        materials,
        metalColors,
        productTypes,
        product,
    }:{
        materials:ISpecification[];
        metalColors:ISpecification[];
        productTypes:IProductTypes;
        product:IProduct;
    }
) => {
    const nameRef = useRef<HTMLInputElement>(null);
    const priceRef = useRef<HTMLInputElement>(null);
    const descriptionRef = useRef<HTMLInputElement>(null);
    const urlRef = useRef<HTMLInputElement>(null);
    const publicImageRef = useRef<HTMLInputElement>(null);
    const adminImageRef = useRef<HTMLInputElement>(null);
    const retiredRef = useRef<HTMLInputElement>(null);
    const imageExtAccepted = useRef<string[]>(['jpeg','jpg','png'])
    const discountStartDateRef = useRef<HTMLInputElement>(null)
    const discountEndDateRef = useRef<HTMLInputElement>(null)
    const discountAmountRef = useRef<HTMLInputElement>(null)
    const { csrfToken } = useContext(CsrfContext)

    const [materialIDs, setMaterialIDs] = useState<number[]>(!!product.materialIDs && !!product.materialIDs.length ? product.materialIDs : [])
    const [metalColorID, setMetalColorID] = useState(product.metalColorID)
    
    const [productMainType, setProductMainType] = useState(()=>{
        const entries = Object.entries(productTypes)
        for (const entry of entries) {
            const [mainTypeID, {subtypes}] = entry
            if (subtypes.findIndex(e=>e.id === product.productTypeID) !== -1) return +mainTypeID
        }
        return 0
    })
    const [productSubType, setProductSubType] = useState(product.productTypeID)
    const productMainTypes = useMemo(()=>Object.entries(productTypes).map(([id,spec])=>({id:+id,name:spec.name} as ISpecification)),[])
    const productSubTypes = useMemo(()=>!!productTypes[productMainType] ? productTypes[productMainType].subtypes : [],[productMainType])

    const productMainTypeOnChange = (ev:SelectChangeEvent) => setProductMainType(+ev.target.value)
    const productSubTypeOnChange = (ev:SelectChangeEvent) => setProductSubType(+ev.target.value)

    const materialOnChange = (ev:SelectChangeEvent<number[]>) => setMaterialIDs([...ev.target.value as number[]])
    const metalColorOnChange = (ev:SelectChangeEvent) => setMetalColorID(+ev.target.value)

    const verifyImageFilenames = (filenameStr:string, section:string) => {
        const filenames = filenameStr.split('\n').map(e=>e.trim())
        const filenamesWithErr = filenames.filter(e=>{
            const parts = e.split('.')
            const len = parts.length
            if (len < 2) return true
            const ext = parts[len-1].toLowerCase()
            return imageExtAccepted.current.indexOf(ext) === -1
        })

        if (!!filenamesWithErr.length) {
            alert(`Invalid ${section} images:\n${filenamesWithErr.join('\n')}`)
            return []
        } else return filenames
    }

    const strToUnixMilli = (str:string,isEnd:boolean) => {
        const dt = new Date(str)
        let unixMilli = Date.UTC(dt.getFullYear(),dt.getMonth(),isEnd ? dt.getDate() + 1 : dt.getDate())
        if (isEnd) unixMilli -= 1
        return unixMilli
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const publicImages = verifyImageFilenames(publicImageRef.current?.value as string,'public')
        if (!publicImages.length) return

        const adminImages = verifyImageFilenames(adminImageRef.current?.value as string,'admin')
        if (!adminImages.length) return

        const discountStartDtSTr = (discountStartDateRef.current?.value || '').trim()
        const discountEndDtSTr = (discountEndDateRef.current?.value || '').trim()
        const discountAmountStr = (discountAmountRef.current?.value || '').trim()

        let discountStartDT = 0, discountEndDT = 0, discountAmount = 0

        if (!!discountStartDtSTr && !!discountAmountStr && !!(+discountAmountStr)){
            discountStartDT = strToUnixMilli(discountStartDtSTr,false)
            if (!!discountEndDtSTr) discountEndDT = strToUnixMilli(discountEndDtSTr,true)
            discountAmount = (+discountAmountStr) * 100
        }

        const formData = new FormData();
        formData.append('product', JSON.stringify({
            productID: product.id,
            name: nameRef.current?.value.trim(),
            price: Number(priceRef.current?.value.trim()) * 100,
            materialIDs,
            metalColorID,
            description: descriptionRef.current?.value.trim(),
            url: urlRef.current?.value.trim(),
            productTypeID: productSubType,
            publicImages,
            adminImages,
            discountStartDT,
            discountEndDT,
            discountAmount,
            isRetired:!!retiredRef.current?.checked
        }));
    
        const response = await fetch('/api/admin/edit-product', {
            method: 'POST',
            headers:httpRequestHeader(false,'client',true,csrfToken),
            body: formData,
        });
    
        if (response.ok) {
            alert('Product added successfully');
        } else {
            alert('Failed to add product');
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Grid container rowGap={2}>
                <Grid xs={12} sm={6} paddingRight={{sm:1}}>
                    <Typography variant="h4">Edit Product - {product.id}</Typography>
                </Grid>
                <Grid xs={12} sm={6} paddingLeft={{sm:1}}>
                    <Typography align='right'>Created at: {formatDate(product.createdAt)}</Typography>
                </Grid>
                <Grid xs={12} sm={6} paddingRight={{sm:1}}>
                    <TextField defaultValue={product.name} fullWidth inputRef={nameRef} name="name" label="Name" required />
                </Grid>
                <Grid xs={12} sm={6} paddingLeft={{sm:1}}>
                    <TextField defaultValue={product.url} fullWidth inputRef={urlRef} name="url" label="URL" required />
                </Grid>
                <Grid xs={12} sm={6} paddingRight={{sm:1}}>
                    <TextField defaultValue={product.price * 0.01} fullWidth inputRef={priceRef} name="price" label="Price (£)" type="number" required />
                </Grid>
                <Grid xs={12} sm={6} paddingLeft={{sm:1}}>
                    <></>
                </Grid>
                <Grid xs={12} sm={6} md={3} paddingRight={{sm:1}}>
                    <FormControl fullWidth required>
                        <InputLabel id='product-main-type-id'>Product Main Type</InputLabel>
                        <Select defaultValue={`${productMainType}`} labelId='product-main-type-id' label='Product Main Type' onChange={productMainTypeOnChange}>
                            {productMainTypes.map(({id,name})=>(<MenuItem key={id} value={id}>{name}</MenuItem>))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid xs={12} sm={6} md={3} paddingLeft={{sm:1}} paddingRight={{md:1}}>
                    <FormControl fullWidth required>
                        <InputLabel id='product-sub-type-id'>Product Subtype</InputLabel>
                        <Select value={`${productSubType}`} labelId='product-sub-type-id' label='Product Subtype' onChange={productSubTypeOnChange}>
                            {productSubTypes.map(({id,name})=>(<MenuItem key={id} value={id}>{name}</MenuItem>))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid xs={12} sm={6} md={3} paddingLeft={{md:1}} paddingRight={{sm:1}}>
                    <FormControl fullWidth>
                        <InputLabel id='material-id'>Material</InputLabel>
                        <Select multiple value={materialIDs} labelId='material-id' label='Material' onChange={materialOnChange}>
                            {materials.map(({id,name})=>(<MenuItem key={id} value={id}>{name}</MenuItem>))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid xs={12} sm={6} md={3} paddingLeft={{sm:1}}>
                    <FormControl fullWidth required>
                        <InputLabel id='metal-color-id'>Metal Colour</InputLabel>
                        <Select value={`${metalColorID}`} labelId='metal-color-id' label='Metal Colour' onChange={metalColorOnChange}>
                            {metalColors.map(({id,name})=>(<MenuItem key={id} value={id}>{name}</MenuItem>))}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
            <TextField defaultValue={product.description} inputRef={descriptionRef} name="description" label="Description" multiline rows={4} required />
            <Grid container rowGap={2}>
                <Grid xs={12} sm={6} paddingRight={{sm:1}}>
                    <TextField defaultValue={product.publicImages.join('\n')} fullWidth inputRef={publicImageRef} multiline name="public_images" label="Public Images" rows={4} required />
                </Grid>
                <Grid xs={12} sm={6} paddingLeft={{sm:1}}>
                    <TextField defaultValue={product.adminImages.join('\n')} fullWidth inputRef={adminImageRef} multiline name="admin_images" label="Admin Images" rows={4} required />
                </Grid>
                <Grid xs={12} sm={6} paddingRight={{sm:1}}>
                    <Typography variant="h6">Stock Level</Typography>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Location</TableCell>
                                    <TableCell align='right'>Quantity</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {product.stockQuantities.map(({name,quantity},i)=>(
                                    <TableRow key={i}>
                                        <TableCell>{name}</TableCell>
                                        <TableCell align='right'>{quantity}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
                <Grid xs={12} sm={6} paddingLeft={{sm:1}}>
                    <Typography variant="h6">Discount History</Typography>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Start</TableCell>
                                    <TableCell>End</TableCell>
                                    <TableCell align='right'>Amount</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <TableRow>
                                        <TableCell>
                                            <DatePicker inputRef={discountStartDateRef} label="Start date" />
                                        </TableCell>
                                        <TableCell>
                                            <DatePicker inputRef={discountEndDateRef} label="End date" />
                                        </TableCell>
                                        <TableCell>
                                            <TextField inputRef={discountAmountRef} fullWidth name="discount-amount" label="Price (£)" type="number" />
                                        </TableCell>
                                    </TableRow>
                                </LocalizationProvider>
                                {product.discounts.map(({amount,startDT,endDT},i)=>(
                                    <TableRow key={i}>
                                        <TableCell>{formatDate(startDT)}</TableCell>
                                        <TableCell>{!!endDT ? formatDate(endDT) : 'No end date set'}</TableCell>
                                        <TableCell>{formatPrice(amount)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
            <FormGroup>
                <FormControlLabel control={<Checkbox inputRef={retiredRef} defaultChecked={product.isRetired} />} label='Retired' />
            </FormGroup>
            <Button type="submit" variant="contained" color="primary">Submit</Button>
        </Box>
    )
}

export default EditProductContent