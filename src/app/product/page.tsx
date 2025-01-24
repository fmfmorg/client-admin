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

    if (!resp.ok){
      console.log(await resp.text())
      console.log(resp.status)
      return new Response(null,{status:500})
    }

    const {materials,metalColors,productTypes,suppliers,product} = await resp.json() as {
        materials:ISpecification[];
        metalColors:ISpecification[];
        productTypes:IProductTypes;
        suppliers:ISpecification[];
        product:IProduct;
    }

    const materialArray = (!!product.materialIDs && !!product.materialIDs.length) ? product.materialIDs.map(e=>materials.find(f=>f.id === e)?.name || '').filter(e=>!!e) : []
    const material = !!materialArray.length ? materialArray.join(', ') : ''
    const metalColor = metalColors.find(e=>e.id === product.metalColorID)?.name || ''
    const productMainType = Object.entries(productTypes).find(e=>{
      const {subtypes} = e[1]
      return subtypes.findIndex(f=>f.id === product.productTypeIDs[0]) !== -1
    })
    const productMainTypeName = !!productMainType ? productMainType[1].name : ''
    const productSubTypeNames = !!productMainType ? productMainType[1].subtypes.filter(({id})=>product.productTypeIDs.includes(id)).map(({name})=>name) : []

    const supplier = (!!suppliers && !!suppliers.length && !!product.supplierID) ? (suppliers.find(({id})=>id === product.supplierID)?.name || '') : ''

    return (
        <Product {...{
          csrf,
          product,
          material,
          metalColor,
          supplier,
          productMainTypeName,
          productSubTypeNames,
        }} />
    )
}

export default ProductPage