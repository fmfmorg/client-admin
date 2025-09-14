import { useAppSelector } from "@store/hooks"
import ImageListItem from "@mui/material/ImageListItem"
import ImageListItemBar from "@mui/material/ImageListItemBar"
import { IExternalItem, ISkuMapItem } from "src/interfaces"
import ProductField from "./product-field"

const SingleProduct = ({id,isCatalogue}:{id:string;isCatalogue?:boolean;})=> {
    const imgSrc = useAppSelector(state => {
        const internalSkuID = (state.productsReducer.skuMapItems as ISkuMapItem[]).find(e=>e.external === id)?.internal || ''
        return !!internalSkuID ? `${process.env.NEXT_PUBLIC_FM_ADMIN_IMAGE_URL_PREFIX}${internalSkuID}.avif` : ''
        // return (state.productsReducer.internalItemSpecs as IInternalItemSpecification[]).find(e=>e.internalSkuID === internalSkuID)?.image || ''
    })
    // const url = useAppSelector(state => {
    //     const internalSkuID = (state.productsReducer.skuMapItems as ISkuMapItem[]).find(e=>e.external === id)?.internal || ''
    //     return !!internalSkuID ? (state.productsReducer.internalItemSpecs as IInternalItemSpecification[]).find(e => e.internalSkuID === internalSkuID)?.page || '#' : '#'
    // })
    const withQty = useAppSelector(state => !!((state.productsReducer.externalItems as IExternalItem[]).find(e=>e.externalSkuID === id)?.labelQty))

    const url = useAppSelector(state => {
        const movementIDs = state.productsReducer.showMovementIDs
        if (!movementIDs || !movementIDs.length) return '#'

        const internalSkuID = (state.productsReducer.skuMapItems as ISkuMapItem[]).find(e=>e.external === id)?.internal || ''
        if (!internalSkuID) return '#'

        if (!state.productsReducer.internalItems) return '#'

        const purchaseRecords = state.productsReducer.internalItems.filter(e => movementIDs.includes(e.movementID) && e.internalSkuID === internalSkuID)
        if (!purchaseRecords.length) return '#'

        return purchaseRecords.sort((a,b) => b.movementID - a.movementID)[0].page
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
                title={<ProductField {...{id}} />} 
                sx={{backgroundColor:(withQty && !!isCatalogue) ? 'rgba(138, 30, 30, 0.4)' : 'rgba(0, 0, 0, 0.3)'}}
            />
        </ImageListItem>
    )
}

export default SingleProduct