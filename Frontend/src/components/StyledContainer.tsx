import {styled} from "@mui/material";
import Grid from "@mui/material/Grid2";

const StyledContainer = styled(Grid)(({ theme }) => ({
    height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
    minHeight: '100%',
    justifyContent: 'center',
    padding: theme.spacing(2),
    [theme.breakpoints.up('lg')]: {
        padding: theme.spacing(7),
    },
    [theme.breakpoints.up('md')]: {
        paddingTop: theme.spacing(7),
    },
    '&::before': {
        content: '""',
        display: 'block',
        position: 'absolute',
        zIndex: -1,
        inset: 0,
        backgroundImage:
            'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
        backgroundRepeat: 'no-repeat',
        ...theme.applyStyles('dark', {
            backgroundImage:
                'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
        }),
    },
}));

export default StyledContainer;