import * as React from 'react';

// Material-UI components
import {
    Box,
    Divider,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
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
// import Documentation from '../documentation';
import logo from '../../../assets/images/Wearify_logo_digital.png';


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
    // {
    //     title: 'Documentation',
    //     icon: <HelpOutlineIcon />,
    //     dividerAfter: false,
    //     component: <Documentation />
    // },
    {
        title: 'Contact Sales',
        icon: <ChatIcon />,
        dividerAfter: false,
        href: 'mailto:info@wearify.ai' // ← Use mailto link here
    }
];

const DrawerContent = ({ onPageChange, currentPage }) => {
    return (
        <div>
            <Toolbar>
                <Box
                    component="img"
                    src={logo}
                    alt="Descriptive alt text"
                    sx={{
                        width: '100%',
                        maxWidth: 500,
                        height: 'auto',
                        borderRadius: 2,
                    }}
                />
            </Toolbar>
            <Divider />
            <List>
                {pages.map((page) => {
                    const isActive = currentPage.title == page.title;

                    return (
                        <React.Fragment key={page.title}>
                            <ListItem disablePadding>
                                {page.href ? (
                                    <ListItemButton
                                        component="a"
                                        href={page.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        sx={{
                                            color: 'inherit',
                                            padding: '15px',
                                            '&:hover': {
                                                bgcolor: 'rgba(0, 0, 0, 0.04)'
                                            }
                                        }}
                                    >
                                        <ListItemIcon sx={{ color: 'inherit' }}>
                                            {page.icon}
                                        </ListItemIcon>
                                        <ListItemText primary={page.title} />
                                    </ListItemButton>
                                ) : (
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
                                )}
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