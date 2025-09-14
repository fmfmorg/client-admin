import { useTheme } from "@mui/material";
import { useAppSelector } from "@store/hooks";
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import Typography from '@mui/material/Typography';
import { ISkuMapItem } from "src/interfaces";
import ProductField from "./product-field";

const ImageItem = ({internalSkuID}:{internalSkuID:string}) => {
    // const imgSrc = useAppSelector(state => (state.productsReducer.internalItemSpecs as IInternalItemSpecification[]).find(e=>e.internalSkuID === internalSkuID)?.image || '')
    // const url = useAppSelector(state => (state.productsReducer.internalItemSpecs as IInternalItemSpecification[]).find(e => e.internalSkuID === internalSkuID)?.page || '#')

    const url = useAppSelector(state => {
        const movementIDs = state.productsReducer.showMovementIDs
        if (!movementIDs || !movementIDs.length) return '#'
        
        if (!state.productsReducer.internalItems) return '#'

        const purchaseRecords = state.productsReducer.internalItems.filter(e => movementIDs.includes(e.movementID) && e.internalSkuID === internalSkuID)
        if (!purchaseRecords.length) return '#'

        return purchaseRecords.sort((a,b) => b.movementID - a.movementID)[0].page
    })

    return (
        <ImageListItem sx={{aspectRatio: "1 / 1"}}>
            <a style={{height:'100%'}} href={url} target='_blank'>
                <img 
                    src={`${process.env.NEXT_PUBLIC_FM_ADMIN_IMAGE_URL_PREFIX}${internalSkuID}.avif`}
                    loading='lazy'
                    width='100%'
                    style={{objectFit:'cover',objectPosition:'center',width:'100%',height:'100%'}}
                />
            </a>
            <ImageListItemBar 
                title={<Typography variant='body2'>{internalSkuID}</Typography>}
                sx={{display:'flex'}}
            />
        </ImageListItem>
    )
}

const SetProduct = ({id}:{id:string;}) => {
    const {palette:{action:{hover}}} = useTheme()
    const internalSkuIDs = useAppSelector(state => (state.productsReducer.skuMapItems as ISkuMapItem[]).filter(e=>e.external===id)).map(e=>e.internal)

    return (
        <TableRow sx={{'&:nth-of-type(odd)':{backgroundColor: hover}}}>
            <TableCell sx={{width:`25%`}}>
                <ProductField {...{id}} />
            </TableCell>
            <TableCell>
                <ImageList cols={3} sx={{overflow:'hidden'}} gap={8}>
                    {internalSkuIDs.map(id=>(
                        <ImageItem key={id} {...{internalSkuID:id}} />
                    ))}
                </ImageList>
            </TableCell>
        </TableRow>
    )
}

export default SetProduct