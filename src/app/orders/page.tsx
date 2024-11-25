import { httpRequestHeader } from "@misc"
import { fetchCSRF } from "../fetch-csrf"
import { IDeliveryMethod, IOrderOverviewItem, ISpecification } from "src/interfaces"
import Orders from "@components/orders"

const OrdersPage = async() => {
    const orderStatus = 1
    const csrf = await fetchCSRF() || ''
    const resp = await fetch(`${process.env.FM_CLIENT_ADMIN_API_URL}/admin/orders-init`,{
        method:"POST",
        headers:httpRequestHeader(false,'SSR',false),
        body:JSON.stringify({orderStatus}),
        cache: 'no-store',
    })

    const { orderStatuses, overviewItems, deliveryMethods } = await resp.json() as {
        orderStatuses:ISpecification[];
        overviewItems:IOrderOverviewItem[];
        deliveryMethods:IDeliveryMethod[];
    }
    
    return (
        <Orders {...{
            csrf,
            initialOrderStatus:orderStatus,
            orderStatuses:orderStatuses || [], 
            overviewItems:overviewItems || [], 
            deliveryMethods:deliveryMethods || [],
        }} />
    )
}

export default OrdersPage