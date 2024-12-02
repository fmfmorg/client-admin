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

    const materialArray = (!!product.materialIDs && !!product.materialIDs.length) ? product.materialIDs.map(e=>materials.find(f=>f.id === e)?.name || '').filter(e=>!!e) : []
    const material = !!materialArray.length ? materialArray.join(', ') : ''
    const metalColor = metalColors.find(e=>e.id === product.metalColorID)?.name || ''
    const productMainType = Object.entries(productTypes).find(e=>{
      const {subtypes} = e[1]
      return subtypes.findIndex(f=>f.id === product.productTypeID) !== -1
    })
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