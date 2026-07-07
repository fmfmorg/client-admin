import UpdatePurchaseQuantity from "@components/purchase-quantity";
import { fetchCSRF } from "../fetch-csrf";
import { httpRequestHeader } from "@misc";
import { IState } from "@slices/products";

const PurchaseQuantityPage = async() => {
    const csrf = await fetchCSRF() || ''

    const controller = new AbortController();
    // const timeout = setTimeout(() => controller.abort(), 8000);
    
    try {
        const resp = await fetch(`${process.env.FM_CLIENT_ADMIN_API_URL}/admin/purchase-quantity-page-init`,{
            // headers:httpRequestHeader(true,'SSR',false),
            headers:{
                "X-Request-Source":"SSR",
            },
            cache:'no-store',
            // signal: controller.signal
        })

        // console.log(resp.status)

        if (resp.ok){
            const initialState = await resp.json() as IState
            console.log(initialState.metalColors)

            return (
                // <UpdatePurchaseQuantity {...{csrf,initialState}} />
                <div>initialState no problem {resp.status}</div>
            )
        } else {
            const errorText = await resp.text()
            console.log(errorText)

            return <div>{resp.status} ERROR</div>
        }

    } catch (e) {
        console.log(e)
        const message = e instanceof Error ? e.message : String(e)
        return <div>{message}</div>
    } 
    // finally {
    //     clearTimeout(timeout)
    // }
}

export default PurchaseQuantityPage