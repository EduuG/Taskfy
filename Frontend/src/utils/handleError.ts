import {AlertColor} from "@mui/material";

const handleError = (error: unknown, showFeedback?: (message: string, severity: AlertColor) => void) => {
    if (error instanceof Error) {
        if (process.env.NODE_ENV === 'development') {
            console.error(error.message);
        } else {
            if (showFeedback) {
                showFeedback(error.message, "error")
            }
        }
    } else {
        console.error(error);
    }
}

export default handleError;