import {
    AlertColor,
    Box,
    Button,
    Divider,
    FormControl,
    FormLabel,
    Link,
    TextField,
    Typography,
    useMediaQuery, useTheme
} from "@mui/material";
import StyledCard from "../components/StyledCard.tsx";
import React from "react";
import {useNavigate} from "react-router";
import {Link as RouterLink} from "react-router-dom";
import {useUser} from "../contexts/UserContext.tsx";
import {useFormik} from "formik";
import * as yup from "yup";
import {LoginRounded} from "@mui/icons-material";
import handleError from "../utils/handleError.ts";

interface ILoginProps {
    showFeedback: (message: string, severity: AlertColor) => void;
}

const validationSchema = yup.object({
    email: yup
        .string()
        .email("Digite um e-mail válido")
        .required("E-mail é obrigatório"),
    password: yup
        .string()
        .required("Senha é obrigatória")
});

const Login: React.FC<ILoginProps> = ({showFeedback}: ILoginProps) => {
    const {login, tryWithoutLogin} = useUser();

    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            email: "",
            password: ""
        },
        validationSchema: validationSchema,
        onSubmit: async (values: { email: string, password: string }) => {
            try {
                await login(values.email, values.password);
                navigate("/")
            } catch (error: unknown) {
                handleError(error, showFeedback);
            }
        }
    })

    return (
        <React.Fragment>
            <StyledCard className={"loginContainer"} variant={"outlined"}>
                <Typography
                    component="h1"
                    variant="h4"
                    sx={{width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)'}}
                >
                    Login
                </Typography>

                <Divider />

                <Box
                    component="form"
                    onSubmit={formik.handleSubmit}
                    noValidate
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%',
                        gap: 2,
                    }}
                >
                    <FormControl>
                        <FormLabel htmlFor={"email"}>E-mail</FormLabel>
                        <TextField
                            id={"email"}
                            name={"email"}
                            placeholder={"seu@email.com"}
                            type={"email"}
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email}
                            fullWidth
                            variant={"outlined"}
                            size={isDesktop ? "small" : "medium"}
                            disabled={formik.isSubmitting}
                        />
                    </FormControl>

                    <FormControl>
                        <FormLabel htmlFor={"password"}>Senha</FormLabel>
                        <TextField
                            id={"password"}
                            name={"password"}
                            placeholder={"••••••"}
                            type={"password"}
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.password && Boolean(formik.errors.password)}
                            helperText={formik.touched.password && formik.errors.password}
                            fullWidth
                            variant={"outlined"}
                            size={isDesktop ? "small" : "medium"}
                            disabled={formik.isSubmitting}
                        />
                        <Typography paddingTop={1} paddingX={0.5}>
                            <Link
                                component={RouterLink}
                                to={"/ForgotPassword"}
                                variant="body2"
                                sx={{alignSelf: 'center', cursor: 'pointer'}}
                            >
                                Esqueci minha senha
                            </Link>
                        </Typography>
                    </FormControl>

                    <Button
                        disabled={formik.isSubmitting}
                        type="submit"
                        fullWidth
                        variant="contained"
                        size={isDesktop ? "small" : "large"}
                        sx={{ marginTop: 2 }}
                        endIcon={<LoginRounded/>}
                    >
                        Login
                    </Button>
                </Box>

                <Divider>
                    <Typography sx={{color: 'text.secondary'}}>ou</Typography>
                </Divider>

                <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
                    <Button
                        fullWidth
                        variant="outlined"
                        onClick={tryWithoutLogin}
                        size={isDesktop ? "small" : "large"}
                    >
                        Experimente sem login
                    </Button>
                    <Typography sx={{textAlign: 'center'}}>
                        Ainda não possui conta?{' '}
                        <Link
                            component={RouterLink}
                            to={"/Register"}
                            variant="body2"
                            sx={{alignSelf: 'center', cursor: 'pointer'}}
                        >
                            Cadastre-se
                        </Link>
                    </Typography>
                </Box>
            </StyledCard>
        </React.Fragment>
    )
}

export default Login;
