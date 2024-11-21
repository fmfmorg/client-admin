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
        productTypes,
    }:{
        csrf:string;
        materials:ISpecification[];
        metalColors:ISpecification[];
        productTypes:IProductTypes;
    }
) => (
    <SignedInWrapper {...{csrf}}>
        <AddProductContent {...{
            materials,
            metalColors,
            productTypes,
        }} />
    </SignedInWrapper>
)

export default AddProduct;

