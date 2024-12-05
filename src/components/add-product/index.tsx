'use client'

import React from 'react';
import SignedInWrapper from '../signed-in-wrapper';
import AddProductContent from './content';
import { IProductTypes, ISpecification } from 'src/interfaces';

const AddProduct = (
    {
        csrf,
        materials,
        metalColors,
        suppliers,
        productTypes,
    }:{
        csrf:string;
        materials:ISpecification[];
        metalColors:ISpecification[];
        suppliers:ISpecification[];
        productTypes:IProductTypes;
    }
) => (
    <SignedInWrapper {...{csrf}}>
        <AddProductContent {...{
            materials,
            metalColors,
            productTypes,
            suppliers,
        }} />
    </SignedInWrapper>
)

export default AddProduct;

