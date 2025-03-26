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
import React from "react";
import {useUser} from "../contexts/UserContext.tsx";
import {useNavigate} from "react-router";
import {Link as RouterLink} from "react-router-dom";
import * as yup from "yup";
import {useFormik} from "formik";
import handleError from "../utils/handleError.ts";
import AuthLayout from "../components/AuthLayout.tsx";

interface ICadastroProps {
    showFeedback: (message: string, severity: AlertColor) => void;
}

const validationSchema = yup.object({
    name: yup
        .string()
        .matches(
            /^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/gi,
            'Nome só pode conter letras'
        )
        .matches(/^\s*[\S]+(\s[\S]+)+\s*$/gms, 'Nome completo é obrigatório')
        .required("Nome completo é obrigatório"),
    email: yup
        .string()
        .email("Digite um email válido")
        .required("E-mail é obrigatório"),
    password: yup
        .string()
        .required("Senha é obrigatória")
});

const Register: React.FC<ICadastroProps> = ({showFeedback}: ICadastroProps) => {
    const {register, tryWithoutLogin} = useUser();
    const navigate = useNavigate();

    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            password: ""
        },
        validationSchema: validationSchema,
        onSubmit: async (values: { name: string, email: string, password: string }) => {
            try {
                await register(values.name, values.email, values.password);
                navigate("/Welcome");
            } catch (error: unknown) {
                handleError(error, showFeedback)
            }
        }
    })

    return (
        <AuthLayout>
            <Typography
                component="h1"
                variant="h4"
                sx={{width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)'}}
            >
                Cadastre-se
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
                    <FormLabel htmlFor={"name"}>Nome completo</FormLabel>
                    <TextField
                        id={"name"}
                        name={"name"}
                        placeholder={"Seu nome"}
                        type={"text"}
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.name && Boolean(formik.errors.name)}
                        helperText={formik.touched.name && formik.errors.name}
                        fullWidth
                        variant={"outlined"}
                        size={isDesktop ? "small" : "medium"}
                        disabled={formik.isSubmitting}
                    />
                </FormControl>

                <FormControl>
                    <FormLabel htmlFor={"email"}>Email</FormLabel>
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
                </FormControl>

                <Button
                    disabled={formik.isSubmitting}
                    type="submit"
                    fullWidth
                    variant="contained"
                    size={isDesktop ? "small" : "large"}
                >
                    Cadastrar
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
                    Já possui uma conta?{' '}
                    <Link
                        component={RouterLink}
                        to={"/Login"}
                        variant="body2"
                        sx={{alignSelf: 'center', cursor: 'pointer'}}
                    >
                        Faça login
                    </Link>
                </Typography>
            </Box>
        </AuthLayout>
    )
}

export default Register;