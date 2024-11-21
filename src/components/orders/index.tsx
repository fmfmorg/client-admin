'use client'

import SignedInWrapper from "@components/signed-in-wrapper";
import { IDeliveryMethod, IOrderOverviewItem, ISpecification } from "src/interfaces";
import OrdersPageContent from "./content";

const Orders = (
    {
        csrf,
        initialOrderStatus,
        orderStatuses, 
        overviewItems, 
        deliveryMethods,
    }:{
        csrf:string;
        initialOrderStatus:number;
        orderStatuses:ISpecification[];
        overviewItems:IOrderOverviewItem[];
        deliveryMethods:IDeliveryMethod[];
    }
) => {
    return (
        <SignedInWrapper {...{csrf}}>
            <OrdersPageContent {...{
                initialOrderStatus,
                orderStatuses, 
                overviewItems, 
                deliveryMethods,
            }} />
        </SignedInWrapper>
    )
}

export default Orders