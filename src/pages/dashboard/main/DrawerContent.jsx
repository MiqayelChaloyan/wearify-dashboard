import * as React from 'react';

// Material-UI components
import {
    Divider,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography
} from '@mui/material';

// Material-UI icons
import {
    StarBorder as StarBorderIcon,
    AttachMoney as AttachMoneyIcon,
    Chat as ChatIcon,
    HelpOutline as HelpOutlineIcon
} from '@mui/icons-material';

// Pages
import Projects from '../projects';
import Pricing from '../pricing';
import Documentation from '../documentation';
import ContactSales from '../contactSales';


export const pages = [
    {
        title: 'Projects',
        icon: <StarBorderIcon />,
        dividerAfter: false,
        component: <Projects />
    },
    {
        title: 'Pricing',
        icon: <AttachMoneyIcon />,
        dividerAfter: true,
        component: <Pricing />
    },
    {
        title: 'Documentation',
        icon: <HelpOutlineIcon />,
        dividerAfter: false,
        component: <Documentation />
    },
    {
        title: 'Contact Sales',
        icon: <ChatIcon />,
        dividerAfter: false,
        component: <ContactSales />
    }
];

const DrawerContent = ({ onPageChange, currentPage }) => {
    return (
        <div>
            <Toolbar>
                <Typography
                    variant="h4"
                    component="div"
                    sx={{
                        flexGrow: 1,
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1rem',
                        textAlign: 'center'
                    }}
                >
                    Wearify
                </Typography>
            </Toolbar>
            <Divider />
            <List>
                {pages.map((page) => {
                    const isActive = currentPage.title == page.title;

                    return (
                        <React.Fragment key={page.title}>
                            <ListItem disablePadding>
                                <ListItemButton
                                    onClick={() => onPageChange(page)}
                                    sx={{
                                        bgcolor: isActive ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
                                        color: 'inherit',
                                        '&:hover': {
                                            bgcolor: isActive ? 'rgba(0, 0, 0, 0.22)' : 'rgba(0, 0, 0, 0.04)'
                                        },
                                        padding: '15px'
                                    }}
                                >
                                    <ListItemIcon sx={{ color: 'inherit' }}>
                                        {page.icon}
                                    </ListItemIcon>
                                    <ListItemText primary={page.title} />
                                </ListItemButton>
                            </ListItem>
                            {page.dividerAfter && <Divider />}
                        </React.Fragment>
                    );
                })}
            </List>
        </div>
    );
};


export default DrawerContent;