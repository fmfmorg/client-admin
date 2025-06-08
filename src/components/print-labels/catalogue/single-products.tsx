import { selectSingleProductIDs } from "@components/pricing/selectors"
import { useAppSelector } from "@store/hooks"
import ImageList from "@mui/material/ImageList"
import ImageListItem from "@mui/material/ImageListItem"
import { IInternalItemSpecification, ISkuMapItem } from "src/interfaces"

const SingleProduct = ({id}:{id:string})=> {
    const imgSrc = useAppSelector(state => {
        const internalSkuID = (state.productsReducer.skuMapItems as ISkuMapItem[]).find(e=>e.external === id)?.internal || ''
        return (state.productsReducer.internalItemSpecs as IInternalItemSpecification[]).find(e=>e.internalSkuID === internalSkuID)?.image || ''
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
        </ImageListItem>
    )
}

const SingleProducts = () => {
    const singleIDs = useAppSelector(selectSingleProductIDs)
    
    return (
        <ImageList cols={4} sx={{overflow:'hidden'}} gap={8}>
            {singleIDs.map(id=>(
                <SingleProduct key={id} id={id} />
            ))}
        </ImageList>
    )
}

export default SingleProducts