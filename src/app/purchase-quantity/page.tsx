import UpdatePurchaseQuantity from "@components/purchase-quantity";
import { fetchCSRF } from "../fetch-csrf";
import { httpRequestHeader } from "@misc";
import { IState } from "@slices/products";

const PurchaseQuantityPage = async() => {
    const csrf = await fetchCSRF() || ''

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    
    try {
        const resp = await fetch(`${process.env.FM_CLIENT_ADMIN_API_URL}/admin/purchase-quantity-page-init`,{
            headers:httpRequestHeader(true,'SSR',true),
            cache:'no-store',
            signal: controller.signal
        })

        if (resp.ok){
            const initialState = await resp.json() as IState

            return (
                <UpdatePurchaseQuantity {...{csrf,initialState}} />
            )
        } else {
            const errorText = await resp.text()
            console.log(resp.status, resp.statusText, errorText)

            return <></>
        }

        
    } catch (e) {
        console.log(e)
        return <></>
    } finally {
        clearTimeout(timeout)
    }
}

export default PurchaseQuantityPage