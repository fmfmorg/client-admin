import React, { useContext, useMemo, useRef, useState } from 'react';
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Grid2 from '@mui/material/Grid2'
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { CsrfContext } from '@context';
import { IProductTypes, ISpecification } from 'src/interfaces';
import { httpRequestHeader, verifyImageFilenames } from '@misc';
import MeasurementTable, { getMeasurementInput, newMeasurementItem } from '@misc/measurement-table';

const AddProductContent = (
    {
        materials,
        metalColors,
        productTypes,
        suppliers,
    }:{
        materials:ISpecification[];
        metalColors:ISpecification[];
        productTypes:IProductTypes;
        suppliers:ISpecification[];
    }
) => {
    const productIdRef = useRef<HTMLInputElement>(null);
    const nameRef = useRef<HTMLInputElement>(null);
    const priceRef = useRef<HTMLInputElement>(null);
    const descriptionRef = useRef<HTMLInputElement>(null);
    const metaDescriptionRef = useRef<HTMLInputElement>(null);
    const specificationRef = useRef<HTMLInputElement>(null);
    const urlRef = useRef<HTMLInputElement>(null);
    const publicImageRef = useRef<HTMLInputElement>(null);
    const adminImageRef = useRef<HTMLInputElement>(null);
    const gmcImageRef = useRef<HTMLInputElement>(null);
    const soldAsPairRef = useRef<HTMLInputElement>(null);
    const { csrfToken } = useContext(CsrfContext)

    const [materialIDs, setMaterialIDs] = useState<number[]>([])
    const [metalColorID, setMetalColorID] = useState(0)
    const [supplier,setSupplier] = useState(0)
    
    const [productMainType, setProductMainType] = useState(0)
    const [productSubType, setProductSubType] = useState(0)
    
    const productMainTypes = useMemo(()=>!!productTypes ? Object.entries(productTypes).map(([id,spec])=>({id:+id,name:spec.name} as ISpecification)) : [],[])
    const productSubTypes = useMemo(()=>!!productTypes && !!productTypes[productMainType] ? productTypes[productMainType].subtypes : [],[productMainType])

    const productMainTypeOnChange = (ev:SelectChangeEvent<number>) => setProductMainType(ev.target.value as number)
    const productSubTypeOnChange = (ev:SelectChangeEvent<number>) => setProductSubType(ev.target.value as number)
    const materialOnChange = (ev:SelectChangeEvent<number[]>) => setMaterialIDs([...ev.target.value as number[]])
    const metalColorOnChange = (ev:SelectChangeEvent<number>) => setMetalColorID(ev.target.value as number)
    const supplierOnChange = (ev:SelectChangeEvent<number>) => setSupplier(ev.target.value as number)

    

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const publicImages = verifyImageFilenames(publicImageRef.current?.value as string,'public')
        if (!publicImages.length) return

        const adminImages = verifyImageFilenames(adminImageRef.current?.value as string,'admin')
        if (!adminImages.length) return

        const gmcImages = verifyImageFilenames(gmcImageRef.current?.value as string,'GMC')
        if (!gmcImages.length) return

        const formData = new FormData();
        formData.append('product', JSON.stringify({
            productID: productIdRef.current?.value.trim().toUpperCase(),
            name: nameRef.current?.value.trim(),
            price: Number(priceRef.current?.value.trim()) * 100,
            materialIDs,
            metalColorID,
            supplier,
            description: descriptionRef.current?.value.trim(),
            specification: specificationRef.current?.value.trim(),
            url: urlRef.current?.value.trim(),
            productTypeID: productSubType,
            publicImages,
            gmcImages,
            adminImages,
            metaDescription: metaDescriptionRef.current?.value.trim(),
            measurements: getMeasurementInput(),
            soldAsPair:!!soldAsPairRef.current?.checked
        }));
    
        const response = await fetch('/api/admin/add-product', {
            method: 'POST',
            headers:httpRequestHeader(false,'client',true,csrfToken),
            body: formData,
        });
    
        if (response.ok) {
            window.location.assign('/products')
        } else {
            alert('Failed to add product');
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h4">Add Product</Typography>
            
            <Grid2 container marginX={0} marginTop={0} rowGap={2}>
                <Grid2 size={{xs:12,sm:6}} paddingRight={{sm:1}}>
                    <TextField fullWidth inputRef={nameRef} name="name" label="Name" required />
                </Grid2>
                <Grid2 size={{xs:12,sm:6}} paddingLeft={{sm:1}}>
                    <TextField fullWidth inputRef={urlRef} name="url" label="URL" required />
                </Grid2>
                <Grid2 size={{xs:12,sm:6}} paddingRight={{sm:1}}>
                    <TextField fullWidth inputRef={productIdRef} name="product_id" label="Product ID" required /> 
                </Grid2>
                <Grid2 size={{xs:12,sm:6}} paddingLeft={{sm:1}}>
                    <TextField fullWidth inputRef={priceRef} name="price" label="Price (£)" type="number" required />
                </Grid2>
                <Grid2 size={{xs:12}}>
                    <FormControl fullWidth required>
                        <InputLabel id='supplier-id'>Supplier</InputLabel>
                        <Select required labelId='supplier-id' label='Supplier' onChange={supplierOnChange}>
                            {suppliers.map(({id,name})=>(<MenuItem key={id} value={id}>{name}</MenuItem>))}
                        </Select>
                    </FormControl>
                </Grid2>
                <Grid2 size={{xs:12,sm:6,md:3}} paddingRight={{sm:1}}>
                    <FormControl fullWidth required>
                        <InputLabel id='product-main-type-id'>Product Main Type</InputLabel>
                        <Select required labelId='product-main-type-id' label='Product Main Type' onChange={productMainTypeOnChange}>
                            {productMainTypes.map(({id,name})=>(<MenuItem key={id} value={id}>{name}</MenuItem>))}
                        </Select>
                    </FormControl>
                </Grid2>
                <Grid2 size={{xs:12,sm:6,md:3}} paddingLeft={{sm:1}} paddingRight={{md:1}}>
                    <FormControl fullWidth required>
                        <InputLabel id='product-sub-type-id'>Product Subtype</InputLabel>
                        <Select required labelId='product-sub-type-id' label='Product Subtype' onChange={productSubTypeOnChange}>
                            {productSubTypes.map(({id,name})=>(<MenuItem key={id} value={id}>{name}</MenuItem>))}
                        </Select>
                    </FormControl>
                </Grid2>
                <Grid2 size={{xs:12,sm:6,md:3}} paddingLeft={{sm:1}} paddingRight={{md:1}}>
                    <FormControl fullWidth required>
                        <InputLabel id='metal-color-id'>Metal Colour</InputLabel>
                        <Select required labelId='metal-color-id' label='Metal Colour' onChange={metalColorOnChange}>
                            {metalColors.map(({id,name})=>(<MenuItem key={id} value={id}>{name}</MenuItem>))}
                        </Select>
                    </FormControl>
                </Grid2>
                <Grid2 size={{xs:12,sm:6,md:3}} paddingLeft={{md:1}}>
                    <FormControl fullWidth>
                        <InputLabel id='material-id'>Material</InputLabel>
                        <Select multiple labelId='material-id' label='Material' value={materialIDs} onChange={materialOnChange}>
                            {materials.map(({id,name})=>(<MenuItem key={id} value={id}>{name}</MenuItem>))}
                        </Select>
                    </FormControl>
                </Grid2>
            </Grid2>
            <TextField inputRef={descriptionRef} name="description" label="Description" multiline rows={4} required />
            <TextField inputRef={metaDescriptionRef} name="meta_description" label="Meta Description" multiline rows={4} />
            <MeasurementTable measurements={[newMeasurementItem()]} />
            <TextField inputRef={specificationRef} name="specification" label="Specification" multiline rows={4} />
            <Grid2 container marginX={0} marginTop={0} rowGap={2}>
                <Grid2 size={{xs:12,sm:6}} paddingRight={{sm:1}}>
                    <TextField fullWidth inputRef={publicImageRef} multiline name="public_images" label="Public Images" rows={4} required />
                </Grid2>
                <Grid2 size={{xs:12,sm:6}} paddingLeft={{sm:1}}>
                    <TextField fullWidth inputRef={gmcImageRef} multiline name="gmc_images" label="GMC Images" rows={4} required />
                </Grid2>
                <Grid2 size={{xs:12,sm:6}} paddingRight={{sm:1}}>
                    <TextField fullWidth inputRef={adminImageRef} multiline name="admin_images" label="Admin Images" rows={4} required />
                </Grid2>
                <Grid2 size={{xs:12,sm:6}} paddingLeft={{sm:1}}>
                    <FormGroup>
                        <FormControlLabel inputRef={soldAsPairRef} control={<Checkbox defaultChecked />} label="Sold as pair" />
                    </FormGroup>
                </Grid2>
            </Grid2>
            <Button type="submit" variant="contained" color="primary">Submit</Button>
        </Box>
    )
}

export default AddProductContent