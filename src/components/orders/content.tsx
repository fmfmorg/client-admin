import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Link from '@mui/material/Link';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { IDeliveryMethod, IOrderOverviewItem, ISpecification } from "src/interfaces";
import { useContext, useMemo, useState } from 'react';
import { formatDate, formatPrice, httpRequestHeader } from '@misc';
import { CsrfContext } from '@context';

const OverviewItem = (
    {
        orderID,
        orderStatus,
        orderDate,
        totalOrderAmountExDelivery,
        deliveryMethod,
    }:{
        orderID:number;
        orderStatus:string;
        orderDate:number;
        totalOrderAmountExDelivery:number;
        deliveryMethod:string;
    }
) => (
    <TableRow>
        <TableCell><Link href={`/order?id=${orderID}`}>{orderID}</Link></TableCell>
        <TableCell>{orderStatus}</TableCell>
        <TableCell>{formatDate(orderDate)}</TableCell>
        <TableCell>{formatPrice(totalOrderAmountExDelivery)}</TableCell>
        <TableCell>{deliveryMethod}</TableCell>
    </TableRow>
)

const OrdersPageContent = (
    {
        initialOrderStatus,
        orderStatuses, 
        overviewItems:_overviewItems, 
        deliveryMethods,
    }:{
        initialOrderStatus:number;
        orderStatuses:ISpecification[];
        overviewItems:IOrderOverviewItem[];
        deliveryMethods:IDeliveryMethod[];
    }
) => {
    const { csrfToken } = useContext(CsrfContext)
    const [orderStatus, setOrderStatus] = useState(initialOrderStatus)
    const [overviewItems, setOverviewItems] = useState(_overviewItems)
    const orderStatusMap = useMemo(()=>new Map(orderStatuses.map(({id,name})=>([id,name]))),[])
    const deliveryMethodMap = useMemo(()=>new Map(deliveryMethods.map(({id,name})=>([id,name]))),[])

    const orderStatusOnChange = async (ev:SelectChangeEvent) => {
        const prevStatus = orderStatus
        const newStatus = +ev.target.value
        setOrderStatus(newStatus)

        const resp = await fetch('/api/admin/orders-init',{
            method:'POST',
            headers:httpRequestHeader(false,'client',true,csrfToken),
            body:JSON.stringify({orderStatus:newStatus}),
        })
        if (!resp.ok) {
            setOrderStatus(prevStatus)
            return
        }

        const { overviewItems:_overviewItems } = await resp.json() as { overviewItems:IOrderOverviewItem[] }

        setOverviewItems([..._overviewItems])
    }

    return (
        <Grid container rowGap={2}>
            <FormControl>
                <InputLabel id="order-status-select-menu">Order Status</InputLabel>
                <Select
                    labelId="order-status-select-menu"
                    value={`${orderStatus}`}
                    label="Order Status"
                    onChange={orderStatusOnChange}
                >
                    {orderStatuses.map(({id,name})=>(<MenuItem value={id} key={id}>{name}</MenuItem>))}
                </Select>
            </FormControl>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Order Date</TableCell>
                            <TableCell>Total ex. Delivery</TableCell>
                            <TableCell>Delivery</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {overviewItems.map(e=>(
                            <OverviewItem key={e.orderID} {...{
                                orderID:e.orderID,
                                orderDate:e.orderDate,
                                totalOrderAmountExDelivery:e.totalOrderAmountExDelivery,
                                orderStatus:orderStatusMap.get(e.orderStatusID) || '',
                                deliveryMethod:deliveryMethodMap.get(e.deliveryMethodID) || ''
                            }} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Grid>
    )
}

export default OrdersPageContent