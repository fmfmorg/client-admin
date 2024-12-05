import { httpRequestHeader } from "@misc"
import { fetchCSRF } from "../fetch-csrf"
import GoodsReceived from "@components/goods-received"
import { IProductImage, ISpecification } from "src/interfaces"

const GoodsReceivedPage = async() => {
    const csrf = await fetchCSRF() || ''
    const resp = await fetch(`${process.env.FM_CLIENT_ADMIN_API_URL}/admin/goods-received-init`,{
        headers:httpRequestHeader(false,'SSR',false),
        cache: 'no-store',
    })

    const { productIDs, invMvmtTypes, imageList } = await resp.json() as { 
        productIDs: string[]; 
        invMvmtTypes:ISpecification[]; 
        imageList: IProductImage[];
    }

    return (
        <GoodsReceived {...{csrf,productIDs,invMvmtTypes,imageList}} />
    )
}

export default GoodsReceivedPage