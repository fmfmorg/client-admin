import { httpRequestHeader } from "@misc"
import { fetchCSRF } from "../fetch-csrf"
import { IProduct, IProductTypes, ISpecification } from "src/interfaces"
import Product from "@components/product"

const ProductPage = async (
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

    const {materials,metalColors,productTypes,product} = await resp.json() as {
        materials:ISpecification[];
        metalColors:ISpecification[];
        productTypes:IProductTypes;
        product:IProduct;
    }

    const material = materials.find(e=>e.id === product.materialID)?.name || ''
    const metalColor = metalColors.find(e=>e.id === product.metalColorID)?.name || ''
    const productMainType = Object.entries(productTypes).find(([id,{name,subtypes}])=>subtypes.findIndex(e=>e.id === product.productTypeID) !== -1)
    const productMainTypeName = !!productMainType ? productMainType[1].name : ''
    const productSubTypeName = !!productMainType ? productMainType[1].subtypes.find(e=>e.id === product.productTypeID)?.name || '' : ''

    return (
        <Product {...{
          csrf,
          product,
          material,
          metalColor,
          productMainTypeName,
          productSubTypeName,
        }} />
    )
}

export default ProductPage