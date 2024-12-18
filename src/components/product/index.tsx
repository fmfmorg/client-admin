import ReactMarkdown from 'react-markdown'
import Grid2 from '@mui/material/Grid2'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import SignedInWrapper from "@components/signed-in-wrapper";
import { IProduct } from "src/interfaces";
import { formatDate, formatPrice } from '@misc';

const Product = (
    {
        csrf,
        product,
        material,
        metalColor,
        productMainTypeName,
        productSubTypeName,
        supplier,
    }:{
        csrf:string;
        product:IProduct;
        material:string;
        metalColor:string;
        productMainTypeName:string;
        productSubTypeName:string;
        supplier:string;
    }
) => (
    <SignedInWrapper {...{csrf}}>
        <Grid2 container spacing={2}>
            <Grid2 size={{xs:12,sm:6,lg:4}}>
                <TableContainer>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>{product.id}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>{product.name}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>URL slug</TableCell>
                                <TableCell>{product.url}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Price</TableCell>
                                <TableCell>£ {product.price * 0.01}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Supplier</TableCell>
                                <TableCell>{supplier}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Product Type</TableCell>
                                <TableCell>{productMainTypeName} - {productSubTypeName}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Metal Color</TableCell>
                                <TableCell>{metalColor}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Material</TableCell>
                                <TableCell>{material}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan={2}>
                                    <Typography variant='h6'>Description</Typography>
                                    <ReactMarkdown>{product.description}</ReactMarkdown>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan={2}>
                                    <Typography variant='h6'>Specification</Typography>
                                    <ReactMarkdown>{product.specification}</ReactMarkdown>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
                {!!product.stockQuantities && !!product.stockQuantities.length && 
                <>
                <Typography variant='h6' marginLeft={2} marginTop={4}>Stock Level</Typography>
                <TableContainer>
                    <Table>
                        <TableBody>
                            {product.stockQuantities.map(({name,quantity},i)=>(
                                <TableRow key={i}>
                                    <TableCell>{name}</TableCell>
                                    <TableCell align='right'>{quantity}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                </>}
                <Typography variant="h6" marginLeft={2} marginTop={4}>Discount History</Typography>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Start</TableCell>
                                <TableCell>End</TableCell>
                                <TableCell align='right'>Amount</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {!!product.discounts && !!product.discounts.length && product.discounts.map(({amount,startDT,endDT},i)=>(
                                <TableRow key={i}>
                                    <TableCell>{formatDate(startDT)}</TableCell>
                                    <TableCell>{!!endDT ? formatDate(endDT) : 'No end date set'}</TableCell>
                                    <TableCell>{formatPrice(amount)}</TableCell>
                                </TableRow>
                            ))}
                            {(!product.discounts || !product.discounts.length) && <TableRow><TableCell colSpan={3}>No discount record</TableCell></TableRow>}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid2>
        </Grid2>
    </SignedInWrapper>
)

export default Product