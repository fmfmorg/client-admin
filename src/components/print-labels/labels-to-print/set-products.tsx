import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import { useAppSelector } from '@store/hooks';
import SetProduct from '../common/set-product';
import { selectSetProductIDs } from './selectors';

const SetProducts = () => {
    const setIDs = useAppSelector(selectSetProductIDs)
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

export default SetProducts