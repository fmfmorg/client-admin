import ImageList from "@mui/material/ImageList"
import ImageListItem from "@mui/material/ImageListItem"
import ImageListItemBar from "@mui/material/ImageListItemBar"
import Typography from "@mui/material/Typography"
import { useAppSelector } from "@store/hooks"
import { IExternalItem, IInternalItemSpecification, ISkuMapItem } from "src/interfaces"

const ImageItem = ({id}:{id:string}) => {
    const imgSrc = useAppSelector(state => (state.productsReducer.internalItemSpecs as IInternalItemSpecification[]).find(e=>e.internalSkuID ===id)?.image || '')
    const url = useAppSelector(state => (state.productsReducer.internalItemSpecs as IInternalItemSpecification[]).find(e => e.internalSkuID ===id)?.page || '#')

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
                title={<Typography variant='body2'>{id}</Typography>}
                sx={{display:'flex'}}
            />
        </ImageListItem>
    )
}

const ProductInformation = () => {
    const price = useAppSelector(state => {
        const id = state.productsReducer.editItemID || ''
        return ((state.productsReducer.externalItems as IExternalItem[]).find(e => e.externalSkuID === id)?.price || 0).toFixed(2)
    })
    const intenralIDs = useAppSelector(state => {
        const id = state.productsReducer.editItemID || ''
        return (state.productsReducer.skuMapItems as ISkuMapItem[]).filter(e => e.external === id).map(e => e.internal)
    })

    return (
        <>
        <Typography>£ {price}</Typography>
        {!!intenralIDs.length && <ImageList cols={5} sx={{overflow:'hidden'}} gap={8}>
            {intenralIDs.map(id => <ImageItem {...{id}} />)}
        </ImageList>}
        </>
    )
}

export default ProductInformation