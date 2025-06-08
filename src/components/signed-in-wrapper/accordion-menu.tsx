import Link from 'next/link';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { IMenuItem } from './interfaces'

const AccordionMenu = (
    {
        title,
        menuList,
    }:{
        title:string;
        menuList:IMenuItem[];
    }
) => (
    <Accordion>
        <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
            <Typography>{title}</Typography>
        </AccordionSummary>
        <AccordionDetails>
            <List>
                {menuList.map((item, i) => (
                    <ListItem key={i} disablePadding>
                        <ListItemButton component={Link} href={item.pathname} target={!!item.newTab ? '_blank' : '_self'}>
                            <ListItemText primary={item.name} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </AccordionDetails>
    </Accordion>
)

export default AccordionMenu