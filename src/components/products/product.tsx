// /Users/cindyho/fairymade/system_v2/client-admin/src/components/products/product.tsx
import { Card, CardMedia, CardContent, Typography, IconButton } from "@mui/material";
import { IProductPageItemDetails } from "./interfaces";
import EditIcon from '@mui/icons-material/Edit';
import Link from 'next/link';
import { currencyFormatter } from "@misc";

const Product = ({ product }: { product: IProductPageItemDetails }) => {
    const formatPrice = (price: number) => currencyFormatter.format(price * 0.01)

    const price = formatPrice(product.price);
    const discountedPrice = formatPrice(product.discountedPrice);

    return (
        <Card sx={{ maxWidth: 345, position: 'relative' }}>
            <Link href={`/product?id=${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <CardMedia
                    component="img"
                    sx={{
                        height: 0,
                        paddingTop: '100%', // 1:1 aspect ratio
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundImage: `url(${process.env.NEXT_PUBLIC_FM_ADMIN_IMAGE_URL_PREFIX + product.adminImageUrl + product.adminImageExt})`,
                    }}
                    alt={product.id}
                />
                <CardContent sx={{ padding: 1, '&:last-child': { paddingBottom: 1 } }}>
                    <Typography gutterBottom variant="subtitle2" component="div" sx={{ fontSize: '0.9rem' }}>
                        {product.id}
                    </Typography>
                    {product.price === product.discountedPrice ? (
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                            {price}
                        </Typography>
                    ) : (
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                            <span style={{ textDecoration: 'line-through', color: 'crimson' }}>{price}</span>
                            <span style={{ marginLeft: '0.5rem' }}>{discountedPrice}</span>
                        </Typography>
                    )}
                </CardContent>
            </Link>
            <Link href={`/edit-product?id=${product.id}`} passHref>
                <IconButton aria-label="edit" sx={{ position: 'absolute', bottom: 8, right: 8 }}>
                    <EditIcon />
                </IconButton>
            </Link>
        </Card>
    );
};

export default Product;
