import {darken, lighten, styled} from "@mui/material";
import MuiCard from "@mui/material/Card";
import {alpha} from "@mui/material/styles";
import {gray} from "../shared-theme/themePrimitives.ts";
import {buttonBaseClasses} from "@mui/material/ButtonBase";
import {svgIconClasses} from "@mui/material/SvgIcon";

const StyledCard = styled(MuiCard)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',
    padding: theme.spacing(3),
    gap: theme.spacing(2),
    boxShadow:
        'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
    ...theme.applyStyles('dark', {
        boxShadow:
            'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
    }),
    '&.tarefaContainer': {
        flexDirection: 'row',
        padding: '6px',
        alignItems: 'center',
        boxShadow:
            'rgba(0, 0, 0, 0.04) 0px 3px 5px;',
        background: 'hsl(0, 0%, 98%)',
        ...theme.applyStyles('dark', {
            background: alpha(gray[800], 0.5),
        }),
        '&.checked': {
            background: '#81c784',
            border: '1px solid darkgreen',
            '&:hover': {
                background: darken("#81c784", 0.08),
            },
            ...theme.applyStyles('dark', {
                background: 'hsl(118, 100%, 7%)',
                '&:hover': {
                    background: lighten("hsl(118, 100%, 7%)", 0.05),
                },
            }),
        },
        '&:hover': {
            backgroundColor: darken(theme.palette.background.paper, 0.01),
            transform: 'scale(1.02)',
            ...theme.applyStyles('dark', {
                backgroundColor: lighten(theme.palette.background.paper, 0.03),
            }),
        },
        '@media (pointer: coarse)': {
            '&:hover': {
                background: 'hsl(0, 0%, 98%)',
                transform: 'none',
                ...theme.applyStyles('dark', {
                    background: alpha(gray[800], 0.5),
                }),
            },
            '&.isDragging': {
                backgroundColor: darken(theme.palette.background.paper, 0.01),
                transform: 'scale(1.02)',
                ...theme.applyStyles('dark', {
                    backgroundColor: lighten(theme.palette.background.paper, 0.03),
                }),
            }
        },
    },
    '&.listaContainer' : {
        [theme.breakpoints.up('sm')]: {
            width: '600px',
            alignSelf: "center"
        },
        [theme.breakpoints.up('md')]: {
            width: "100%",
            alignSelf: "start"
        },
        [theme.breakpoints.up('lg')]: {
            width: "600px",
        },
        height: "100%",
        gap: theme.spacing(0),
        '&#cardAdicionar': {
            padding: "0",
            justifyContent: "center",
            alignItems: 'center',
        },
        '&#cardLista': {
            position: "relative",
            padding: "0",
            alignItems: 'center',
            height: "100%",
        },
    },
    '&#listaHeader': {
        width: "100%",
        minHeight: "50px",
        gap: theme.spacing(0),
        borderRadius: "0",
        boxShadow: 'none',
        padding: "10px",
        borderWidth: "0px 0px 1px 0px",
    },
    '&#listaFooter': {
        flexDirection: 'row',
        width: "100%",
        minHeight: "50px",
        gap: theme.spacing(0),
        borderRadius: "0",
        boxShadow: 'none',
        padding: "10px",
        borderWidth: "1px 0px 0px 0px",
        justifyContent: "space-between",
        alignItems: 'center',
        [`& .${buttonBaseClasses.root}`]: {
            display: 'flex',
            gap: 8,
            borderRadius: theme.shape.borderRadius,
            opacity: 0.7,
            '&.Mui-selected': {
                opacity: 1,
                backgroundColor: alpha(theme.palette.action.selected, 0.3),
                [`& .${svgIconClasses.root}`]: {
                    color: theme.palette.text.primary,
                },
                '&:focus-visible': {
                    backgroundColor: alpha(theme.palette.action.selected, 0.3),
                },
                '&:hover': {
                    backgroundColor: alpha(theme.palette.action.selected, 0.5),
                },
            },
            '&:focus-visible': {
                backgroundColor: 'transparent',
            },
        },
    },
    '&.statusContainer' : {
        [theme.breakpoints.up('md')]: {
            width: "100%",
            maxWidth: "400px",
            alignSelf: 'end',
        },
        maxWidth: '600px',
        alignSelf: 'center',
    },
    '&.loginContainer, &.cadastroContainer' : {
        width: '450px',
        margin: 'auto',
    },
    '&.containerPesquisar': {
        padding: theme.spacing(0),
        position: "absolute",
        borderWidth: "0 1px 1px 1px",
        borderRadius: '0 0 10px 10px',
        zIndex: "9999",
        width: '80%',
        top: '56px',
        height: '40%',
        overflowY: "auto",
    },
    '&.focusedTask': {
        transform: 'scale(1.05)',
        backgroundColor: darken(theme.palette.background.paper, 0.02),
        boxShadow: "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;",
        ...theme.applyStyles('dark', {
            backgroundColor: lighten(theme.palette.background.paper, 0.03),
        }),
        '&:hover': {
            transform: 'scale(1.05)',
        }
    },
}));

export default StyledCard;