import StyledCard from "./StyledCard.tsx";
import {
    Box, Divider, Fade,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon, ListItemText, Modal, Switch,
    useMediaQuery,
    useTheme
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import {GitHub, Settings} from "@mui/icons-material";
import React, {useEffect, useState} from "react";
import Logo from "./Logo.tsx";
import DarkModeIcon from "@mui/icons-material/DarkModeRounded";
import {useColorScheme} from "@mui/material/styles";

interface ICardFooterProps {
    children: React.ReactNode;
}

const AuthLayout = ({children}: ICardFooterProps) => {
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
    const {mode, setMode} = useColorScheme();

    const [mobileModalOpen, setMobileModalOpen] = useState<boolean>(false);
    const handleMobileModalClose = () => {
        setMobileModalOpen(false);
    };

    const handleDarkMode = () => {
        if (!mode || mode === "light" || mode === "system") {
            setMode("dark");
        } else {
            setMode("light");
        }
    }

    useEffect(() => {
        if (isDesktop) {
            setMobileModalOpen(false);
        }
    }, [isDesktop]);

    return (
        <>
            <StyledCard className={"authContainer"} variant={"outlined"}>
                {isDesktop &&
                    <StyledCard className={"cardShell header"}>
                        <Logo height={"30px"}/>
                    </StyledCard>
                }

                <Box display={"flex"} flexDirection={"column"} gap={"15px"} padding={"20px"}>
                    {children}
                </Box>

                <StyledCard className={"cardShell authFooter"}>
                    {!isDesktop &&
                        <IconButton onClick={() => setMobileModalOpen(true)}>
                            <Settings/>
                        </IconButton>
                    }
                </StyledCard>
            </StyledCard>

            {/* TODO: Separate the modal logic into its own component */}
            <Modal open={mobileModalOpen} onClose={handleMobileModalClose} closeAfterTransition>
                <Fade in={mobileModalOpen}>
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            bgcolor: 'background.paper',
                            boxShadow: 24,
                            p: 0,
                            borderRadius: 1,
                            width: '80%',
                        }}
                    >
                        <List sx={{width: "100%"}}>
                            <ListItem disablePadding>
                                <ListItemButton href={"https://github.com/EduuG/Taskfy"} target={"_blank"}>
                                    <ListItemIcon>
                                        <GitHub/>
                                    </ListItemIcon>
                                    <ListItemText primary={"GitHub"}/>
                                </ListItemButton>
                            </ListItem>

                            <Divider/>

                            <ListItem disablePadding>
                                <ListItemButton>
                                    <ListItemIcon>
                                        <DarkModeIcon/>
                                    </ListItemIcon>
                                    <ListItemText primary={"Tema escuro"}/>
                                    <Switch
                                        edge="end"
                                        onChange={handleDarkMode}
                                        checked={mode === "dark"}
                                        inputProps={{
                                            'aria-labelledby': 'switch-list-label-wifi',
                                        }}
                                    />
                                </ListItemButton>
                            </ListItem>
                        </List>
                    </Box>
                </Fade>
            </Modal>
        </>
    );
}

export default AuthLayout;