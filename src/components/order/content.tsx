import Link from 'next/link';
import Grid2 from '@mui/material/Grid2'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import { IOrder, IOrderProduct, ISpecification } from 'src/interfaces';
import { formatDate, formatPrice, httpRequestHeader, percentageFormatter } from '@misc';
import TableHead from '@mui/material/TableHead';
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Button from '@mui/material/Button'
import OrderConfirmActionDialog from './dialog';
import { ChangeEvent, useContext, useEffect, useState } from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import { CsrfContext } from '@context';

const OrderContent = (
    {
        orderStatuses,
        order,
        products,
    }:{
        orderStatuses:ISpecification[];
        order:IOrder;
        products:IOrderProduct[];
    }
) => {
    const { csrfToken } = useContext(CsrfContext)
    const [dialogOpen,setDialogOpen] = useState(false)
    const [loading,setLoading] = useState(false)
    const [trackingOrPhotoField,setTrackingOrPhotoField] = useState('')
    const [dispatchTime, setDispatchTime] = useState('')
    const openDialogOnClick = (open:boolean) => () => setDialogOpen(open)
    const confirmOnClick = async() => {
        setDialogOpen(false)
        setLoading(true)
        if (order.orderStatusID === 1) {
            const inventoriesToDeduct = products.map(({productID,locationQuantities})=>locationQuantities.map(({location,quantityAtLocation})=>({productID,location,quantityAtLocation}))).flat()
            const resp = await fetch('/api/admin/order-packed',{
                method:"POST",
                headers:httpRequestHeader(false,'client',true,csrfToken),
                body:JSON.stringify({orderID:order.orderID,inventoriesToDeduct})
            })
            if (resp.ok) window.location.assign('/orders')
            else {
                const text = await resp.text()
                alert(`Error: ${text}`)
                setLoading(false)
            }
        } else {
            const dispatchDT = new Date(dispatchTime.trim().replace(' ','T')).valueOf()
            if (isNaN(dispatchDT)) {
                alert('Invalid dispatch time')
                setLoading(false)
                return
            }

            if (order.isDirectDelivery){
                const filenameSplitParts = trackingOrPhotoField.trim().split('.')
                if (filenameSplitParts.length < 2 || filenameSplitParts[filenameSplitParts.length - 1] !== 'jpg') {
                    alert('Invalid file name')
                    setLoading(false)
                    return
                }
            }

            const resp = await fetch('/api/admin/order-dispatched',{
                method:"POST",
                headers:httpRequestHeader(false,'client',true,csrfToken),
                body:JSON.stringify({
                    orderID:order.orderID,
                    dispatchDT,
                    trackingOrPhoto:trackingOrPhotoField.trim()
                })
            })
            if (resp.ok) window.location.assign('/orders')
            else {
                const text = await resp.text()
                alert(`Error: ${text}`)
                setLoading(false)
            }
        }
        setLoading(false)
    }
    const trackingOrPhotoOnChange = (e:ChangeEvent<HTMLInputElement>) => setTrackingOrPhotoField(e.target.value)
    const dispatchTimeOnChange = (e:ChangeEvent<HTMLInputElement>) => setDispatchTime(e.target.value)

    return (
        <>
        <Grid2 container spacing={2}
            sx={{
                '@media screen and (max-width:350px)':{
                    '& tr':{
                        border:'1px solid white',
                    },
                    '& td':{
                        display: 'block',
                        border:'none !important',
                    },
                }
            }}
        >
            <Grid2 size={{xs:12,sm:6,lg:4}}>
                {order.orderStatusID === 2 && <>
                    <TextField fullWidth required placeholder={order.isDirectDelivery ? 'Photo Filename' : 'Tracking number'} value={trackingOrPhotoField} onChange={trackingOrPhotoOnChange} sx={{marginBottom:2}} />
                    <TextField fullWidth required placeholder='yyyy-mm-dd hh:mm:ss (24H format, London time)' value={dispatchTime} onChange={dispatchTimeOnChange} sx={{marginBottom:2}} />
                    <Button onClick={openDialogOnClick(true)} variant='contained' fullWidth sx={{marginBottom:2}}>Package Shipped</Button>
                </>}
                <TableContainer>
                    <Table sx={{
                        '& td:first-child':{
                            fontWeight:'bold'
                        },
                        '@media screen and (max-width:350px)':{
                            '& td:not(:first-child)':{
                                paddingTop:0.25
                            },
                            '& td:not(:last-child)':{
                                paddingBottom:0.25
                            },
                        }
                    }}>
                        <TableBody>
                            <TableRow>
                                <TableCell>Order ID</TableCell>
                                <TableCell>{order.orderID}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Order Date</TableCell>
                                <TableCell>{formatDate(order.orderDate)}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Status</TableCell>
                                <TableCell>{orderStatuses.find(e=>e.id===order.orderStatusID)?.name || ''}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Delivery Method</TableCell>
                                <TableCell>{order.deliveryMethod}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Tracking Number</TableCell>
                                <TableCell>{order.trackingNumber || 'N/A'}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Dispatch Date</TableCell>
                                <TableCell>{!!order.dispatchDT ? formatDate(order.dispatchDT) : 'N/A'}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Receipt Date</TableCell>
                                <TableCell>{!!order.receiptDT ? formatDate(order.receiptDT) : 'N/A'}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Payment Method</TableCell>
                                <TableCell>{order.paymentMethod}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Total Amount ex. Delivery</TableCell>
                                <TableCell>{formatPrice(order.totalOrderAmountExDelivery)}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Delivery Charge</TableCell>
                                <TableCell>{formatPrice(order.deliveryCharge)}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Member Discount</TableCell>
                                <TableCell>{!!order.memberDiscountAmount ? `${percentageFormatter.format(order.memberDiscountRate)} - ${formatPrice(order.memberDiscountAmount)}` : 'N/A'}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Staff Discount</TableCell>
                                <TableCell>{formatPrice(order.staffDiscount)}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Voucher Discount</TableCell>
                                <TableCell>{
                                    !!order.storewideDiscountVoucherCode 
                                    ? `${order.storewideDiscountVoucherCode} - ${percentageFormatter.format(order.storewideDiscountVoucherRate)} - ${formatPrice(order.storewideDiscountVoucherAmount)}` 
                                    : 'N/A'
                                }</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Email</TableCell>
                                <TableCell>{order.email}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Customer Name</TableCell>
                                <TableCell>{`${order.firstName} ${order.lastName}`.trim()}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Customer Address</TableCell>
                                <TableCell>{[order.lineOne,order.lineTwo,order.city,order.stateProvince,order.postcode,order.country].filter(e=>!!e).join(', ')}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Collection Point</TableCell>
                                <TableCell>{order.collectionPoint || 'N/A'}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Region</TableCell>
                                <TableCell>{order.region || 'N/A'}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid2>
            <Grid2 size={{xs:12,sm:6,lg:8}}>
                <TableContainer>
                    <Table sx={{
                        '@media screen and (max-width:350px)':{
                            '& td:not(:first-child)':{
                                paddingTop:0.25
                            },
                            '& td:not(:last-child)':{
                                paddingBottom:0.25
                            },
                        }
                    }}>
                        <TableHead>
                            <TableRow>
                                <TableCell>SKU</TableCell>
                                <TableCell>Sold</TableCell>
                                {order.orderStatusID === 1 && <>
                                    <TableCell>Location</TableCell>
                                    <TableCell>Pick</TableCell>
                                </>}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {order.orderStatusID === 1 ? products.map(({
                                productID,
                                imageFilename,
                                quantitySold,
                                locationQuantities
                            })=>locationQuantities.map(({location,quantityAtLocation},i)=>(
                                i === 0 ?
                                <TableRow key={`${productID}-${i}`}>
                                    <TableCell rowSpan={locationQuantities.length}>
                                        <Grid2>{productID}</Grid2>
                                        <Grid2>
                                            <Card sx={{ position: 'relative' }}>
                                                <Link target='_blank' href={process.env.NEXT_PUBLIC_FM_ADMIN_IMAGE_URL_PREFIX + imageFilename} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                    <CardMedia
                                                        component="img"
                                                        sx={{
                                                            height: 0,
                                                            paddingTop: '100%', // 1:1 aspect ratio
                                                            backgroundSize: 'cover',
                                                            backgroundPosition: 'center',
                                                            backgroundImage: `url(${process.env.NEXT_PUBLIC_FM_ADMIN_IMAGE_URL_PREFIX + imageFilename})`,
                                                        }}
                                                        alt={productID}
                                                    />
                                                </Link>
                                            </Card>
                                        </Grid2>
                                    </TableCell>
                                    <TableCell rowSpan={locationQuantities.length}>{quantitySold}</TableCell>
                                    <TableCell>{location}</TableCell>
                                    <TableCell>{quantityAtLocation}</TableCell>
                                </TableRow> :
                                <TableRow key={`${productID}-${i}`}>
                                    <TableCell>{location}</TableCell>
                                    <TableCell>{quantityAtLocation}</TableCell>
                                </TableRow>
                            ))) :
                            products.map(({
                                productID,
                                imageFilename,
                                quantitySold,
                            },i)=>(
                                <TableRow key={i}>
                                    <TableCell>
                                        <Grid2>{productID}</Grid2>
                                        <Grid2>
                                            <Card sx={{ maxWidth:'345px', position: 'relative' }}>
                                                <Link target='_blank' href={process.env.NEXT_PUBLIC_FM_ADMIN_IMAGE_URL_PREFIX + imageFilename} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                    <CardMedia
                                                        component="img"
                                                        sx={{
                                                            height: 0,
                                                            paddingTop: '100%', // 1:1 aspect ratio
                                                            backgroundSize: 'cover',
                                                            backgroundPosition: 'center',
                                                            backgroundImage: `url(${process.env.NEXT_PUBLIC_FM_ADMIN_IMAGE_URL_PREFIX + imageFilename})`,
                                                        }}
                                                        alt={productID}
                                                    />
                                                </Link>
                                            </Card>
                                        </Grid2>
                                    </TableCell>
                                    <TableCell>{quantitySold}</TableCell>
                                </TableRow> 
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                {order.orderStatusID === 1 && <Button onClick={openDialogOnClick(true)} variant='contained' fullWidth sx={{marginTop:2}}>Packing Done</Button>}
            </Grid2>
        </Grid2>
        <OrderConfirmActionDialog 
            open={dialogOpen}
            orderStatusID={order.orderStatusID}
            closeDialog={openDialogOnClick(false)}
            confirm={confirmOnClick}
        />
        <Backdrop open={loading}>
            <CircularProgress />
        </Backdrop>
        </>
    )
}

export default OrderContent