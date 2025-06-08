import { httpRequestHeader } from "@misc"
import { fetchCSRF } from "../fetch-csrf"
import { IState } from "@slices/products"
import PrintLabels from "@components/print-labels"

const PrintLabelsPage = async() => {
    const csrf = await fetchCSRF() || ''
    const resp = await fetch(`${process.env.FM_CLIENT_ADMIN_API_URL}/admin/pricing-page-init`,{
        headers:httpRequestHeader(true,'SSR',true),
        cache:'no-store',
    })
    const initialState = await resp.json() as IState

    return <PrintLabels {...{csrf,initialState}} />
}

export default PrintLabelsPage