import { selectSingleProductIDs } from "@components/pricing/selectors"
import { useAppSelector } from "@store/hooks"
import ImageList from "@mui/material/ImageList"
import SingleProduct from "../common/single-product"

const SingleProducts = () => {
    const singleIDs = useAppSelector(selectSingleProductIDs)
    
    return (
        <ImageList cols={4} sx={{overflow:'hidden'}} gap={8}>
            {singleIDs.map(id=>(
                <SingleProduct key={id} id={id} isCatalogue={true} />
            ))}
        </ImageList>
    )
}

export default SingleProducts