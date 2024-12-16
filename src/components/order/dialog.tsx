import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button'

const titleMap = new Map<number,string>([
    [1, 'Confirm Packing Done?'],
    [2, 'Confirm Package Shipped?'],
])

const OrderConfirmActionDialog = (
    {
        open,
        orderStatusID,
        closeDialog,
        confirm,
    }:{
        open:boolean;
        orderStatusID:number;
        closeDialog:()=>void;
        confirm:()=>void;
    }
) => (
    <Dialog open={open}>
        <DialogTitle>{titleMap.get(orderStatusID)}</DialogTitle>
        <DialogActions>
            <Button onClick={closeDialog} variant='contained' color='error'>No</Button>
            <Button onClick={confirm}>Yes</Button>
        </DialogActions>
    </Dialog>
)

export default OrderConfirmActionDialog