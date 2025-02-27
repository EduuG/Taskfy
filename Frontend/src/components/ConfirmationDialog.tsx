import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
interface IConfirmationDialogProps {
    title: string;
    message: string;
    onConfirm: () => void;
    onClose: () => void;
    open: boolean;
}

const ConfirmationDialog: React.FC<IConfirmationDialogProps> = ({
    title,
    message,
    onConfirm,
    onClose,
    open,
}) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {message}
                </DialogContentText>
            </DialogContent>

            <DialogActions sx={{ display: "flex", justifyContent: "space-between" }}>
                <Button onClick={onClose} variant={"outlined"} size={"large"}>
                    Cancelar
                </Button>

                <Button onClick={onConfirm} color={"error"} variant={"contained"} autoFocus>
                    Confirmar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmationDialog;