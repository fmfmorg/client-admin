import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import { useAppSelector } from "@store/hooks"
import ProductField from './product-field';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material';
import { selectMultiProductIDs } from './selectors';
import { IPurchaseRecordItem, ISkuMapItem } from 'src/interfaces';

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
    const {palette:{action:{hover}}} = useTheme()
    const columns = useAppSelector(state => (state.productsReducer.columns as number) - 1)
    const cellWidth = useAppSelector(state => {
        const columns = state.productsReducer.columns as number
        return 100 / columns
    })
    const internalSkuIDs = useAppSelector(state => (state.productsReducer.skuMapItems as ISkuMapItem[]).filter(e=>e.external===id)).map(e=>e.internal)
    return (
        <TableRow sx={{'&:nth-of-type(odd)':{backgroundColor: hover}}}>
            <TableCell sx={{width:`${cellWidth}%`}}>
                <ProductField {...{id}} />
            </TableCell>
            <TableCell>
                <ImageList cols={columns} sx={{overflow:'hidden'}} gap={8}>
                    {internalSkuIDs.map(id=>(
                        <ImageItem key={id} {...{internalSkuID:id}} />
                    ))}
                </ImageList>
            </TableCell>
        </TableRow>
    )
}

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
                title={<InternalItemCost {...{internalSkuID}} />}
                sx={{display:'flex'}}
            />
        </ImageListItem>
    )
}

const InternalItemCost = ({internalSkuID}:{internalSkuID:string}) => {
    const cost = useAppSelector(state => (((state.productsReducer.internalItems as IPurchaseRecordItem[]).find(e=>e.internalSkuID===internalSkuID)?.costRmb || 0) * 0.01).toFixed(2))
    return (
        <Typography variant='body2'>{internalSkuID} - ¥{cost}</Typography>
    )
}

export default SetProducts