'use client'

import { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Link from 'next/link';
import { CsrfContext } from '@context';
import { csrfBroadcastChannel } from '@misc';
import { IMenuItem } from './interfaces';
import AccordionMenu from './accordion-menu';
import PurchaseQuantityControlBar from '@components/purchase-quantity/control';

const drawerWidth = 240;

interface Props {
    window?: () => Window;
    children: React.ReactNode;
    csrf:string;
    isPurchaseQuantityPage?:boolean;
}

const menuList:IMenuItem[] = [
    {
        name: 'Products',
        pathname: '/products',
    },
    {
        name: 'Orders',
        pathname: '/orders',
    }
]

const inventoryMenu:IMenuItem[] = [
    {
        name: 'Update purchase quantity',
        pathname: '/purchase-quantity'
    }
]

export default function SignedInWrapper(props: Props) {
    const { window, children, csrf, isPurchaseQuantityPage = false } = props;
    const [mobileOpen, setMobileOpen] = useState(false);
    const [csrfToken, setCsrfToken] = useState(csrf)

    const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

    useEffect(()=>{
        const csrfBcChannel = csrfBroadcastChannel()
        csrfBcChannel.postMessage(csrfToken)
        csrfBcChannel.onmessage = (ev:MessageEvent<string>) => setCsrfToken(ev.data)
    },[])

    const DrawerContent = () => (
        <div>
            <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="close drawer"
                    edge="start"
                    onClick={handleDrawerToggle}
                    sx={{ ml: 'auto', display: { md: 'none' } }}
                >
                    <CloseIcon />
                </IconButton>
            </Toolbar>
            <Divider />
            <List>
                {/* {menuList.map((item, i) => (
                    <ListItem key={i} disablePadding>
                        <ListItemButton component={Link} href={item.pathname}>
                            <ListItemText primary={item.name} />
                        </ListItemButton>
                    </ListItem>
                ))} */}
                <AccordionMenu title='Inventory' menuList={inventoryMenu} />
            </List>
        </div>
    );

    const container = window !== undefined ? () => window().document.body : undefined;

    return (
        <CsrfContext.Provider value={{csrfToken}}>
            <Box sx={{ display: 'flex' }}>
                <AppBar
                    position="fixed"
                    sx={{
                        width: { md: `calc(100% - ${drawerWidth}px)` },
                        ml: { md: `${drawerWidth}px` },
                    }}
                >
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2, display: { md: 'none' } }}
                        >
                            <MenuIcon />
                        </IconButton>
                        {isPurchaseQuantityPage 
                        ? <PurchaseQuantityControlBar /> 
                        : <Typography variant="h6" noWrap component="div">
                            Admin Panel
                        </Typography>}
                    </Toolbar>
                </AppBar>
                <Box
                    component="nav"
                    sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
                    aria-label="mailbox folders"
                >
                    <Drawer
                        container={container}
                        variant="temporary"
                        open={mobileOpen}
                        onClose={handleDrawerToggle}
                        ModalProps={{
                            keepMounted: true,
                        }}
                        sx={{
                            display: { xs: 'block', md: 'none' },
                            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                        }}
                    >
                        <DrawerContent />
                    </Drawer>
                    <Drawer
                        variant="permanent"
                        sx={{
                            display: { xs: 'none', md: 'block' },
                            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                        }}
                        open
                    >
                        <DrawerContent />
                    </Drawer>
                </Box>
                <Box
                    component="main"
                    sx={{ flexGrow: 1, p: 3, width: { md: `calc(100% - ${drawerWidth}px)` } }}
                >
                    <Toolbar />
                    {children}
                </Box>
            </Box>
        </CsrfContext.Provider>
    );
}
