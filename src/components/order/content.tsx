import Grid from '@mui/material/Grid'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import { IOrder, ISpecification } from 'src/interfaces';
import { formatDate, formatPrice, percentageFormatter } from '@misc';

const OrderContent = (
    {
        orderStatuses,
        order,
    }:{
        orderStatuses:ISpecification[];
        order:IOrder;
    }
) => {
    return (
        <Grid container spacing={2}
            sx={{
                '& td:first-child':{
                    fontWeight:'bold'
                },
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
            <Grid item xs={12} sm={6} lg={4}>
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
                                <TableCell>Collectio Point</TableCell>
                                <TableCell>{order.collectionPoint || 'N/A'}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Region</TableCell>
                                <TableCell>{order.region || 'N/A'}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
        </Grid>
    )
}

export default OrderContent