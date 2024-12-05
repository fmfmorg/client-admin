'use client'

import SignedInWrapper from "@components/signed-in-wrapper";
import { IOrder, ISpecification } from "src/interfaces";
import OrderContent from "./content";

const Order = (
    {
        csrf,
        orderStatuses,
        order,
    }:{
        csrf:string;
        orderStatuses:ISpecification[];
        order:IOrder;
    }
) => (
    <SignedInWrapper {...{csrf}}>
        <OrderContent {...{orderStatuses,order}} />
    </SignedInWrapper>
)

export default Order