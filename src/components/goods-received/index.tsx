'use client'

import SignedInWrapper from "@components/signed-in-wrapper";
import GoodsReceivedContent from "./content";
import { IProductImage, ISpecification } from "src/interfaces";

const GoodsReceived = (
    {
        csrf,
        productIDs,
        invMvmtTypes,
        imageList
    }:{
        csrf:string;
        productIDs: string[];
        invMvmtTypes: ISpecification[];
        imageList: IProductImage[];
    }
) => (
    <SignedInWrapper {...{csrf}}>
        <GoodsReceivedContent {...{productIDs,invMvmtTypes,imageList}} />
    </SignedInWrapper>
)

export default GoodsReceived