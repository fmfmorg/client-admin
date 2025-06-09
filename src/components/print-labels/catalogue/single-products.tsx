import { selectSingleProductIDs } from "@components/pricing/selectors"
import { useAppDispatch, useAppSelector } from "@store/hooks"
import ImageList from "@mui/material/ImageList"
import ImageListItem from "@mui/material/ImageListItem"
import ImageListItemBar from "@mui/material/ImageListItemBar"
import { IExternalItem, IInternalItemSpecification, ISkuMapItem } from "src/interfaces"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { NumberField } from '@base-ui-components/react/number-field';
import styles from './index.module.css';
import { MinusIcon, PlusIcon } from "@misc"
import { updateLabelQty } from "@slices/products"
import { useEffect, useRef } from "react"

const EditQtyField = ({id}:{id:string}) => {
    const dispatch = useAppDispatch()
    const defaultQty = useAppSelector(state => (state.productsReducer.externalItems as IExternalItem[]).find(e => e.externalSkuID === id)?.labelQty || 0)
    const onChange = (value: number | null, e: Event | undefined) => dispatch(updateLabelQty({id,qty:!!value ? value : 0}));

    return (
        <NumberField.Root value={defaultQty} className={styles.Field} min={0} step={1} onValueChange={onChange}>
            <NumberField.Group className={styles.Group}>
                <NumberField.Decrement className={styles.Decrement}>
                    <MinusIcon />
                </NumberField.Decrement>
                <NumberField.Input className={styles.Input} />
                <NumberField.Increment className={styles.Increment}>
                    <PlusIcon />
                </NumberField.Increment>
            </NumberField.Group>
        </NumberField.Root>
    )
}

const ProductField = ({id}:{id:string}) => {
    const currentPrice = useAppSelector(state => ((state.productsReducer.externalItems as IExternalItem[]).find(e => e.externalSkuID === id)?.price || 0).toFixed(2))
    return (
        <Stack direction='column'>
            <Typography variant='body2'>{id} - £{currentPrice}</Typography>
            <EditQtyField {...{id}} />
        </Stack>
    )
}

const SingleProduct = ({id}:{id:string})=> {
    const imgSrc = useAppSelector(state => {
        const internalSkuID = (state.productsReducer.skuMapItems as ISkuMapItem[]).find(e=>e.external === id)?.internal || ''
        return (state.productsReducer.internalItemSpecs as IInternalItemSpecification[]).find(e=>e.internalSkuID === internalSkuID)?.image || ''
    })
    const url = useAppSelector(state => {
        const internalSkuID = (state.productsReducer.skuMapItems as ISkuMapItem[]).find(e=>e.external === id)?.internal || ''
        return !!internalSkuID ? (state.productsReducer.internalItemSpecs as IInternalItemSpecification[]).find(e => e.internalSkuID === internalSkuID)?.page || '#' : '#'
    })
    const withQty = useAppSelector(state => !!((state.productsReducer.externalItems as IExternalItem[]).find(e=>e.externalSkuID === id)?.labelQty))
    
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
                sx={{backgroundColor:withQty ? 'rgba(138, 30, 30, 0.5)' : 'rgba(0, 0, 0, 0.5)'}}
            />
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