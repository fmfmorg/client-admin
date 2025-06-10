import { httpRequestHeader } from "@misc"
import { fetchCSRF } from "../fetch-csrf"
import { IState } from "@slices/products"
import ProductInfoExternal from "@components/product-info-external"

const ProductInfoExternalPage = async() => {
    const csrf = await fetchCSRF() || ''
    
    const resp = await fetch(`${process.env.FM_CLIENT_ADMIN_API_URL}/admin/pricing-page-init`,{
        headers:httpRequestHeader(true,'SSR',true),
        cache:'no-store',
    })
    const initialState = await resp.json() as IState
    
    return <ProductInfoExternal {...{csrf,initialState}} />
}

export default ProductInfoExternalPage