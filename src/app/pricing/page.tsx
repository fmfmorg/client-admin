import { httpRequestHeader } from "@misc"
import { fetchCSRF } from "../fetch-csrf"
import Pricing from "@components/pricing"
import { IState } from "@slices/products"

const PricingPage = async() => {
    const csrf = await fetchCSRF() || ''
    
    const resp = await fetch(`${process.env.FM_CLIENT_ADMIN_API_URL}/admin/pricing-page-init`,{
        headers:httpRequestHeader(true,'SSR',true),
        cache:'no-store',
    })
    const initialState = await resp.json() as IState

    return <Pricing {...{csrf,initialState}} />
}

export default PricingPage