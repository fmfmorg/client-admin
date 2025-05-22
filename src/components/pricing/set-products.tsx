import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import { useAppSelector } from "@store/hooks"
import { selectMultiProductIDs } from "./slice"
import ProductField from './product-field';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import Typography from '@mui/material/Typography';

const SetProducts = () => {
    const setIDs = useAppSelector(selectMultiProductIDs)
    return (
        <TableContainer>
            <Table>
                <TableBody>
                    {setIDs.map(id=>(
                        <SetProduct key={id} id={id} />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

const SetProduct = ({id}:{id:string}) => {
    const columns = useAppSelector(state => state.pricingReducer.columns - 1)
    const internalSkuIDs = useAppSelector(state => state.pricingReducer.skuMapItems.filter(e=>e.external===id)).map(e=>e.internal)
    return (
        <TableRow>
            <TableCell>
                <ProductField {...{id}} />
            </TableCell>
            <TableCell>
                <ImageList cols={columns} sx={{overflow:'hidden'}} gap={8}>
                    {internalSkuIDs.map(id=>(
                        <ImageItem {...{internalSkuID:id,key:id}} />
                    ))}
                </ImageList>
            </TableCell>
        </TableRow>
    )
}

const ImageItem = ({internalSkuID}:{internalSkuID:string}) => {
    const imgSrc = useAppSelector(state => state.pricingReducer.internalItemSpecs.find(e=>e.internalSkuID === internalSkuID)?.image || '')
    const url = useAppSelector(state => state.pricingReducer.internalItemSpecs.find(e => e.internalSkuID === internalSkuID)?.page || '#')
    
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
                title={<InternalItemCost {...{internalSkuID}} />}
                sx={{display:'flex'}}
            />
        </ImageListItem>
    )
}

const InternalItemCost = ({internalSkuID}:{internalSkuID:string}) => {
    const cost = useAppSelector(state => ((state.pricingReducer.internalCosts.find(e=>e.internalSkuID===internalSkuID)?.costRmb || 0) * 0.01).toFixed(2))
    return (
        <Typography variant='body2'>{internalSkuID} - ¥{cost}</Typography>
    )
}

export default SetProducts