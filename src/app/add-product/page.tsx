import { fetchCSRF } from "../fetch-csrf"
import AddProduct from "../../components/add-product"
import { httpRequestHeader } from "@misc"
import { IProductTypes, ISpecification } from "src/interfaces"

const AddProductPage = async () => {
    const csrf = await fetchCSRF() || ''
    const resp = await fetch(`${process.env.FM_CLIENT_ADMIN_API_URL}/admin/add-product-init`,{
        headers:httpRequestHeader(false,'SSR',false),
        cache: 'no-store',
    })

    const {materials,metalColors,productTypes} = await resp.json() as {
        materials:ISpecification[];
        metalColors:ISpecification[];
        productTypes:IProductTypes;
    }

    return (
        <AddProduct {...{
            csrf,
            materials,
            metalColors,
            productTypes,
        }} />
    )
}

export default AddProductPage