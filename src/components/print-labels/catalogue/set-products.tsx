import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import { useAppSelector } from '@store/hooks';
import { selectMultiProductIDs } from '@components/pricing/selectors';
import SetProduct from '../common/set-product';

const SetProducts = () => {
    const setIDs = useAppSelector(selectMultiProductIDs)
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