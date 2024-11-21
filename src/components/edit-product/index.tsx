'use client'

import SignedInWrapper from "@components/signed-in-wrapper";
import { IProduct, IProductTypes, ISpecification } from "src/interfaces";
import EditProductContent from "./content";

const EditProduct = (
    {
        csrf,
        materials,
        metalColors,
        productTypes,
        product,
    }:{
        csrf:string;
        materials:ISpecification[];
        metalColors:ISpecification[];
        productTypes:IProductTypes;
        product:IProduct;
    }
) => {
    return (
        <SignedInWrapper {...{csrf}}>
            <EditProductContent {...{
                materials,
                metalColors,
                productTypes,
                product,
            }} />
        </SignedInWrapper>
    )
}

export default EditProduct