'use client'

import Grid2 from '@mui/material/Grid2'
import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add';
import SignedInWrapper from "../signed-in-wrapper"
import { IProductPageItemDetails } from "./interfaces"
import Product from "./product"

const Products = ({products,csrf}:{products:IProductPageItemDetails[];csrf:string;}) => (
    <SignedInWrapper {...{csrf}}>
        <Grid2 container spacing={2}>
            <Grid2 size={{xs:12}} style={{ textAlign: 'right' }}>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    href="/add-product"
                >
                    Add Product
                </Button>
            </Grid2>
            {products.map((p, i) => (
                <Grid2 size={{xs:12,sm:6,md:4,lg:3}} key={i}>
                    <Product product={p} />
                </Grid2>
            ))}
        </Grid2>
    </SignedInWrapper>
)

export default Products
