import { fetchCSRF } from "../fetch-csrf";

const PurchaseQuantityPage = async() => {
    const csrf = await fetchCSRF() || ''
    return (
        <></>
    )
}

export default PurchaseQuantityPage