import { useTheme } from "@mui/material";
import { useAppSelector } from "@store/hooks";
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import Typography from '@mui/material/Typography';
import { IInternalItemSpecification, ISkuMapItem } from "src/interfaces";
import ProductField from "./product-field";

const ImageItem = ({internalSkuID}:{internalSkuID:string}) => {
    const imgSrc = useAppSelector(state => (state.productsReducer.internalItemSpecs as IInternalItemSpecification[]).find(e=>e.internalSkuID === internalSkuID)?.image || '')
    const url = useAppSelector(state => (state.productsReducer.internalItemSpecs as IInternalItemSpecification[]).find(e => e.internalSkuID === internalSkuID)?.page || '#')

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
                        <ImageItem {...{internalSkuID:id,key:id}} />
                    ))}
                </ImageList>
            </TableCell>
        </TableRow>
    )
}

export default SetProduct