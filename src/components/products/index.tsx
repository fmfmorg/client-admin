'use client'

import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add';
import SignedInWrapper from "../signed-in-wrapper"
import { IProductPageItemDetails } from "./interfaces"
import Product from "./product"

const Products = ({products,csrf}:{products:IProductPageItemDetails[];csrf:string;}) => (
    <SignedInWrapper {...{csrf}}>
        <Grid container spacing={2}>
            <Grid item xs={12} style={{ textAlign: 'right' }}>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    href="/add-product"
                >
                    Add Product
                </Button>
            </Grid>
            {products.map((p, i) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
                    <Product product={p} />
                </Grid>
            ))}
        </Grid>
    </SignedInWrapper>
)

export default Products
