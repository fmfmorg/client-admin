import ImageListItem from "@mui/material/ImageListItem"
import ImageListItemBar from "@mui/material/ImageListItemBar"
import { useAppSelector } from "@store/hooks"
import ProductField from "./product-field"
import { selectSingleProductIDs } from "./slice"
import ImageList from "@mui/material/ImageList"

const SingleProduct = ({id}:{id:string})=>{
    const imgSrc = useAppSelector(state => {
        const internalSkuID = state.pricingReducer.skuMapItems.find(e=>e.external === id)?.internal || ''
        return state.pricingReducer.internalItemSpecs.find(e=>e.internalSkuID === internalSkuID)?.image || ''
    })
    const edited = useAppSelector(state => {
        const i = state.pricingReducer.externalPrices.find(e => e.externalSkuID === id)
        return !!i ? i.price !== i.priceTemp : false
    })
    const url = useAppSelector(state => state.pricingReducer.internalItemSpecs.find(e => e.internalSkuID === id)?.page || '#')

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
                title={<ProductField id={id} />}
                sx={{display:'flex',backgroundColor:edited ? 'rgba(138, 30, 30, 0.5)' : 'rgba(0, 0, 0, 0.5)'}}
            />
        </ImageListItem>
    )
}

const SingleProducts = () => {
    const columns = useAppSelector(state => state.pricingReducer.columns)
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