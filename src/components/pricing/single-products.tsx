import ImageListItem from "@mui/material/ImageListItem"
import ImageListItemBar from "@mui/material/ImageListItemBar"
import { useAppSelector } from "@store/hooks"
import ProductField from "./product-field"
import ImageList from "@mui/material/ImageList"
import { IExternalItem, IInternalItemSpecification, ISkuMapItem } from "src/interfaces"
import { selectSingleProductIDs } from "./selectors"

const SingleProduct = ({id}:{id:string})=>{
    const imgSrc = useAppSelector(state => {
        const internalSkuID = (state.productsReducer.skuMapItems as ISkuMapItem[]).find(e=>e.external === id)?.internal || ''
        return (state.productsReducer.internalItemSpecs as IInternalItemSpecification[]).find(e=>e.internalSkuID === internalSkuID)?.image || ''
    })
    const edited = useAppSelector(state => {
        const i = (state.productsReducer.externalItems as IExternalItem[]).find(e => e.externalSkuID === id)
        return !!i ? i.price !== i.priceTemp : false
    })
    const url = useAppSelector(state => {
        const internalSkuID = (state.productsReducer.skuMapItems as ISkuMapItem[]).find(e=>e.external === id)?.internal || ''
        return !!internalSkuID ? (state.productsReducer.internalItemSpecs as IInternalItemSpecification[]).find(e => e.internalSkuID === internalSkuID)?.page || '#' : '#'
    })

    return (
        <ImageListItem sx={{aspectRatio: "1 / 1"}}>
            <a style={{height:'100%'}} href={url} target='_blank'>
                <img 
                    src={imgSrc} 
                    loading='lazy'
                    width='100%'
                    style={{objectFit:'cover',objectPosition:'center',width:'100%',height:'100%'}}
                />
            </a>
            <ImageListItemBar 
                title={<ProductField id={id} isSingle={true} />}
                sx={{display:'flex',backgroundColor:edited ? 'rgba(138, 30, 30, 0.5)' : 'rgba(0, 0, 0, 0.5)'}}
            />
        </ImageListItem>
    )
}

const SingleProducts = () => {
    const columns = useAppSelector(state => state.productsReducer.columns)
    const singleIDs = useAppSelector(selectSingleProductIDs)
    
    return (
        <ImageList cols={columns} sx={{overflow:'hidden'}} gap={8}>
            {singleIDs.map(id=>(
                <SingleProduct key={id} id={id} />
            ))}
        </ImageList>
    )
}

export default SingleProducts