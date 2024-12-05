import EditProduct from "@components/edit-product"
import { httpRequestHeader } from "@misc"
import { IProduct, IProductTypes, ISpecification } from "src/interfaces"
import { fetchCSRF } from "../fetch-csrf"

const EditProductPage = async (
  {
    searchParams,
  }: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
  }
) => {
    const { id } = await searchParams
    const csrf = await fetchCSRF() || ''
    const resp = await fetch(`${process.env.FM_CLIENT_ADMIN_API_URL}/admin/edit-product-init/${id}`,{
        headers:httpRequestHeader(false,'SSR',false),
        cache: 'no-store',
    })

    const {materials,metalColors,productTypes,suppliers,product} = await resp.json() as {
        materials:ISpecification[];
        metalColors:ISpecification[];
        productTypes:IProductTypes;
        suppliers:ISpecification[];
        product:IProduct;
    }

    console.log(suppliers)
    
    return (
      <EditProduct {...{
        materials,
        metalColors,
        productTypes,
        product,
        suppliers,
        csrf,
      }} />
    )
}

export default EditProductPage