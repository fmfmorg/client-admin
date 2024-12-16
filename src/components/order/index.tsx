'use client'

import SignedInWrapper from "@components/signed-in-wrapper";
import { IOrder, IOrderProduct, ISpecification } from "src/interfaces";
import OrderContent from "./content";

const Order = (
    {
        csrf,
        orderStatuses,
        order,
        products,
    }:{
        csrf:string;
        orderStatuses:ISpecification[];
        order:IOrder;
        products:IOrderProduct[];
    }
) => (
    <SignedInWrapper {...{csrf}}>
        <OrderContent {...{orderStatuses,order,products:products || []}} />
    </SignedInWrapper>
)

export default Order