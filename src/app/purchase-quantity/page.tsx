import UpdatePurchaseQuantity from "@components/purchase-quantity";
import { fetchCSRF } from "../fetch-csrf";
import { httpRequestHeader } from "@misc";
import { IState } from "@components/purchase-quantity/slice";

const PurchaseQuantityPage = async() => {
    const csrf = await fetchCSRF() || ''
    
    const resp = await fetch(`${process.env.FM_CLIENT_ADMIN_API_URL}/admin/purchase-quantity-page-init`,{
        headers:httpRequestHeader(true,'SSR',true),
        cache:'no-store',
    })
    const initialState = await resp.json() as IState

    return (
        <UpdatePurchaseQuantity {...{csrf,initialState}} />
    )
}

export default PurchaseQuantityPage