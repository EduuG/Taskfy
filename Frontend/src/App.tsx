import React, {useCallback, useState} from "react";
import {
    AlertColor,
    Box,
    Button,
    CircularProgress,
    CssBaseline,
    useMediaQuery,
    useTheme
} from "@mui/material";
import ColorModeSelect from "./shared-theme/ColorModeSelect.tsx";
import AppTheme from "./shared-theme/AppTheme.tsx";
import StyledContainer from "./components/StyledContainer.tsx";
import {useUser} from "./contexts/UserContext.tsx";
import {Route, Routes} from "react-router";
import Login from './views/Login.tsx';
import Register from "./views/Register.tsx";
import TaskList from "./views/TaskList.tsx";
import PrivateRoute from "./components/PrivateRoute.tsx";
import PublicRoute from "./components/PublicRoute.tsx";
import AlertSnackBar from "./components/AlertSnackBar.tsx";
import ConfirmationDialog from "./components/ConfirmationDialog.tsx";
import {LogoutOutlined} from "@mui/icons-material";
import Welcome from "./components/Welcome.tsx";
import ForgotPassword from "./views/ForgotPassword.tsx";
import ResetPassword from "./views/ResetPassword.tsx";

const App: React.FC = () => {
    const {logout, isAuthenticated} = useUser();
    const {isUserLoading} = useUser();

    const [snackBarMessage, setSnackBarMessage] = useState<string>("");
    const [snackBarOpen, setSnackBarOpen] = useState<boolean>(false);
    const [snackBarSeverity, setSnackBarSeverity] = useState<AlertColor>("error");

    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [dialogConfirmAction, setDialogConfirmAction] = useState<(() => void)>();
    const [dialogTitle, setDialogTitle] = useState<string>("");
    const [dialogMessage, setDialogMessage] = useState<string>("");

    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

    const showFeedback = useCallback((message: string, severity: AlertColor) => {
        setSnackBarMessage(message);
        setSnackBarSeverity(severity);
        setSnackBarOpen(true);
    }, [setSnackBarMessage, setSnackBarSeverity, setSnackBarOpen]);

    const handleSnackbarClose = useCallback(() => {
        setSnackBarMessage('');
        setSnackBarOpen(false);
    }, [setSnackBarMessage, setSnackBarOpen]);

    const handleDialogClose = useCallback((): void => {
        setDialogOpen(false);
        setDialogTitle("");
        setDialogMessage("");
    }, [setDialogOpen, setDialogTitle, setDialogMessage]);

    const showDialog = useCallback((title: string, message: string, action: () => void): void => {
        setDialogOpen(true);
        setDialogConfirmAction(() => action);
        setDialogTitle(title);
        setDialogMessage(message);
    }, [setDialogOpen, setDialogConfirmAction, setDialogTitle, setDialogMessage]);

    const onDialogConfirmAction = useCallback(() => {
        if (dialogConfirmAction) {
            dialogConfirmAction();
        }
        setDialogOpen(false);
    }, [dialogConfirmAction, setDialogOpen]);

    const handleLogout = useCallback(() => {
        showDialog("Confirmar logout", "Tem certeza que deseja sair?", () => logout());
    }, [showDialog, logout]);

    return (
        <AppTheme>
            <CssBaseline enableColorScheme/>

            {isDesktop &&
                <Box display="flex" justifyContent={"end"} gap={2} width={"100%"} position={"absolute"}
                     padding={"10px"} paddingInline={{md: "16px", lg: "10px"}}>

                      {isAuthenticated &&
                          <Button onClick={handleLogout} variant={"outlined"} startIcon={<LogoutOutlined/>}>
                              Sair
                          </Button>
                      }

                      <ColorModeSelect/>
                </Box>
            }

            <StyledContainer container spacing={2}>
                <React.Fragment>
                    {!isUserLoading ?
                        <Routes>
                            <Route element={<PublicRoute/>}>
                                <Route path="/Login" element={<Login showFeedback={showFeedback}/>}/>
                                <Route path="/Register" element={<Register showFeedback={showFeedback}/>}/>
                                <Route path="/ForgotPassword" element={<ForgotPassword showFeedback={showFeedback}/>}/>
                                <Route path="/ResetPassword" element={<ResetPassword showFeedback={showFeedback}/>}/>
                            </Route>

                            <Route element={<PrivateRoute/>}>
                                <Route path="/" element={
                                    <TaskList showFeedback={showFeedback} showDialog={showDialog}
                                              handleLogout={handleLogout}/>
                                }/>
                                <Route path="/Welcome" element={<Welcome/>}/>
                            </Route>
                        </Routes>
                        :
                        <Box>
                            <CircularProgress/>
                        </Box>
                    }
                </React.Fragment>
            </StyledContainer>

            <AlertSnackBar open={snackBarOpen} message={snackBarMessage} onClose={handleSnackbarClose}
                           severity={snackBarSeverity}/>
            <ConfirmationDialog open={dialogOpen} title={dialogTitle} message={dialogMessage}
                                onConfirm={onDialogConfirmAction} onClose={handleDialogClose}/>
        </AppTheme>
    );
};

export default App;
