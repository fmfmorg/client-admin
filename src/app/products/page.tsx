import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Products from "../../components/products"
import { IProductPageItemDetails } from "../../components/products/interfaces";
import { fetchCSRF } from '../fetch-csrf';
import { httpRequestHeader } from '@misc';

const ProductsPage = async () => {
    const csrf = await fetchCSRF() || ''
    const nextCookies = await cookies();
    const currentSessionID = nextCookies.get('sessionID')?.value || '';
        
    const response = await fetch(`${process.env.FM_CLIENT_ADMIN_API_URL}/admin/products`, {
        headers:httpRequestHeader(true,'SSR',true,'',currentSessionID),
        cache: 'no-store',
    });

    if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
    }

    const 
        { products, signedIn } = await response.json() as { 
            products: IProductPageItemDetails[];
            signedIn: boolean;
            staffPermission: number;
        }

    if (!signedIn) redirect(`/sign-in?rd=${encodeURIComponent('/products')}`)

    return (
        <Products {...{products,csrf}} />
    )
}

export default ProductsPage