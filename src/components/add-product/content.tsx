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
import { CsrfContext } from '@context';
import { IProductTypes, ISpecification } from 'src/interfaces';
import { httpRequestHeader } from '@misc';

const AddProductContent = (
    {
        materials,
        metalColors,
        productTypes,
    }:{
        materials:ISpecification[];
        metalColors:ISpecification[];
        productTypes:IProductTypes;
    }
) => {
    const productIdRef = useRef<HTMLInputElement>(null);
    const nameRef = useRef<HTMLInputElement>(null);
    const priceRef = useRef<HTMLInputElement>(null);
    const materialIdRef = useRef<HTMLSelectElement>(null);
    const metalColorIdRef = useRef<HTMLInputElement>(null);
    const descriptionRef = useRef<HTMLInputElement>(null);
    const urlRef = useRef<HTMLInputElement>(null);
    const productTypeIdRef = useRef<HTMLInputElement>(null);
    const publicImageRef = useRef<HTMLInputElement>(null);
    const adminImageRef = useRef<HTMLInputElement>(null);
    const imageExtAccepted = useRef<string[]>(['jpeg','jpg','png'])
    const { csrfToken } = useContext(CsrfContext)
    
    const [productMainType, setProductMainType] = useState(0)
    const productMainTypes = useMemo(()=>!!productTypes ? Object.entries(productTypes).map(([id,spec])=>({id:+id,name:spec.name} as ISpecification)) : [],[])
    const productSubTypes = useMemo(()=>!!productTypes && !!productTypes[productMainType] ? productTypes[productMainType].subtypes : [],[productMainType])

    const productMainTypeOnChange = (ev:SelectChangeEvent) => setProductMainType(+ev.target.value)

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const publicImages = verifyImageFilenames(publicImageRef.current?.value as string,'public')
        if (!publicImages.length) return

        const adminImages = verifyImageFilenames(adminImageRef.current?.value as string,'admin')
        if (!adminImages.length) return

        const formData = new FormData();
        formData.append('product', JSON.stringify({
            productID: productIdRef.current?.value.trim(),
            name: nameRef.current?.value.trim(),
            price: Number(priceRef.current?.value.trim()) * 100,
            materialID: Number(materialIdRef.current?.value.trim()),
            metal_colorID: Number(metalColorIdRef.current?.value.trim()),
            description: descriptionRef.current?.value.trim(),
            url: urlRef.current?.value.trim(),
            productTypeID: Number(productTypeIdRef.current?.value.trim()),
            publicImages,
            adminImages,
        }));
    
        const response = await fetch('/api/admin/add-product', {
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
            <Typography variant="h4">Add Product</Typography>
            
            <Grid container marginX={0} marginTop={0} rowGap={2}>
                <Grid xs={12} sm={6} paddingRight={{sm:1}}>
                    <TextField fullWidth inputRef={nameRef} name="name" label="Name" required />
                </Grid>
                <Grid xs={12} sm={6} paddingLeft={{sm:1}}>
                    <TextField fullWidth inputRef={urlRef} name="url" label="URL" required />
                </Grid>
                <Grid xs={12} sm={6} paddingRight={{sm:1}}>
                    <TextField fullWidth inputRef={productIdRef} name="product_id" label="Product ID" required /> 
                </Grid>
                <Grid xs={12} sm={6} paddingLeft={{sm:1}}>
                    <TextField fullWidth inputRef={priceRef} name="price" label="Price (£)" type="number" required />
                </Grid>
                <Grid xs={12} sm={6} md={3} paddingRight={{sm:1}}>
                    <FormControl fullWidth required>
                        <InputLabel id='product-main-type-id'>Product Main Type</InputLabel>
                        <Select labelId='product-main-type-id' label='Product Main Type' onChange={productMainTypeOnChange}>
                            {productMainTypes.map(({id,name})=>(<MenuItem key={id} value={id}>{name}</MenuItem>))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid xs={12} sm={6} md={3} paddingLeft={{sm:1}} paddingRight={{md:1}}>
                    <FormControl fullWidth required>
                        <InputLabel id='product-sub-type-id'>Product Subtype</InputLabel>
                        <Select labelId='product-sub-type-id' label='Product Subtype' inputRef={productTypeIdRef}>
                            {productSubTypes.map(({id,name})=>(<MenuItem key={id} value={id}>{name}</MenuItem>))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid xs={12} sm={6} md={3} paddingLeft={{md:1}} paddingRight={{sm:1}}>
                    <FormControl fullWidth required>
                        <InputLabel id='material-id'>Material</InputLabel>
                        <Select labelId='material-id' label='Material' inputRef={materialIdRef}>
                            {materials.map(({id,name})=>(<MenuItem key={id} value={id}>{name}</MenuItem>))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid xs={12} sm={6} md={3} paddingLeft={{sm:1}}>
                    <FormControl fullWidth required>
                        <InputLabel id='metal-color-id'>Metal Colour</InputLabel>
                        <Select labelId='metal-color-id' label='Metal Colour' inputRef={metalColorIdRef}>
                            {metalColors.map(({id,name})=>(<MenuItem key={id} value={id}>{name}</MenuItem>))}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
            <TextField inputRef={descriptionRef} name="description" label="Description" multiline rows={4} required />
            <Grid container marginX={0} marginTop={0} rowGap={2}>
                <Grid xs={12} sm={6} paddingRight={{sm:1}}>
                    <TextField fullWidth inputRef={publicImageRef} multiline name="public_images" label="Public Images" rows={4} required />
                </Grid>
                <Grid xs={12} sm={6} paddingLeft={{sm:1}}>
                    <TextField fullWidth inputRef={adminImageRef} multiline name="admin_images" label="Admin Images" rows={4} required />
                </Grid>
            </Grid>
            <Button type="submit" variant="contained" color="primary">Submit</Button>
        </Box>
    )
}

export default AddProductContent