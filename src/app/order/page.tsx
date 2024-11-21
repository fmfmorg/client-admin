import { httpRequestHeader } from "@misc"
import { fetchCSRF } from "../fetch-csrf"
import { IOrder, ISpecification } from "src/interfaces"
import Order from "@components/order"

const OrderPage = async (
    {
        searchParams,
    }: {
        searchParams: Promise<{ [key: string]: string | string[] | undefined }>
    }
) => {
    const { id } = await searchParams
    const csrf = await fetchCSRF() || ''

    const resp = await fetch(`${process.env.FM_CLIENT_ADMIN_API_URL}/admin/order-init`,{
        method:"POST",
        headers:httpRequestHeader(false,'SSR',false),
        body:JSON.stringify({orderID:+(id as string)})
    })

    const {orderStatuses,order} = await resp.json() as {
        orderStatuses:ISpecification[];
        order:IOrder;
    }

    return (
        <Order {...{csrf,order,orderStatuses}} />
    )
}

export default OrderPage