import {Alert, AlertColor, Snackbar} from "@mui/material";

interface ISnackbarProps {
    open: boolean;
    message: string;
    onClose: () => void;
    severity: AlertColor;
}

const StyledSnackbar: React.FC<ISnackbarProps> = ({
    open,
    message,
    onClose,
    severity,
}) => {

    return (
            <Snackbar
                open={open}
                autoHideDuration={6000}
                onClose={onClose}
                anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
            >
                <Alert onClose={onClose} severity={severity}>
                    {message}
                </Alert>

            </Snackbar>
    )
}

export default StyledSnackbar;