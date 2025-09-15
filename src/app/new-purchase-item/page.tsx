import NewPurchaseItem from "@components/new-purchase-item"
import { fetchCSRF } from "../fetch-csrf"
import { httpRequestHeader } from "@misc"
import { IState } from "@slices/products"
import { IProductSupplierItem } from "src/interfaces"

const NewPurchaseItemPage = async() => {
    const csrf = await fetchCSRF() || ''

    const [productIdResp, resp] = await Promise.all([
        fetch(`${process.env.FM_CLIENT_ADMIN_API_URL}/admin/new-purchase-item-init`,{
            headers:httpRequestHeader(true,'SSR',true),
            cache:'no-store',
        }),
        fetch(`${process.env.FM_CLIENT_ADMIN_API_URL}/admin/purchase-quantity-page-init`,{
            headers:httpRequestHeader(true,'SSR',true),
            cache:'no-store',
        })
    ])
    const {_external,_internal,_productSupplierItems} = await productIdResp.json() as {
        _external:string;
        _internal:string;
        _productSupplierItems:IProductSupplierItem[];
    }
    const initialState = await resp.json() as IState

    return <NewPurchaseItem {...{csrf,_internal,_external,initialState}} />
}

export default NewPurchaseItemPage