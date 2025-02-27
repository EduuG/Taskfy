import StyledCard from "../components/StyledCard.tsx";
import React, {useEffect, useState} from "react";
import {AlertColor, Box, Button, Divider, FormControl, FormLabel, TextField, Typography} from "@mui/material";
import {useFormik} from "formik";
import * as yup from "yup";
import {useUser} from "../contexts/UserContext.tsx";
import {useSearchParams} from "react-router-dom";
import {Link as RouterLink} from "react-router-dom";
import {Error} from "@mui/icons-material";
import handleError from "../utils/handleError.ts";

interface IForgotPasswordProps {
    showFeedback: (message: string, severity: AlertColor) => void;
}

const ForgotPassword: React.FC<IForgotPasswordProps> = ({showFeedback}: IForgotPasswordProps) => {
    const [isValidToken, setIsValidToken] = useState<boolean>(false);
    const {resetPassword, validateResetPasswordToken} = useUser();
    const [searchParams] = useSearchParams();
    const [passwordChanged, setPasswordChanged] = useState<boolean>(false);

    useEffect(() => {
        const validateToken = async () => {
            try {
                const token = searchParams.get("token");

                if (token === null) {
                    setIsValidToken(false);
                    return;
                }

                const response = await validateResetPasswordToken(token);
                setIsValidToken(response)
            } catch (error) {
                setIsValidToken(false);
            }
        }

        validateToken();
    }, [searchParams, validateResetPasswordToken]);

    const validationSchema = yup.object({
        password: yup
            .string()
            .required("Senha é obrigatória"),
        confirmPassword: yup
            .string()
            .oneOf([yup.ref("password")], "As senhas não coincidem")
            .required("Confirmação de senha é obrigatória")
    });

    const formik = useFormik({
        initialValues: {
            password: "",
            confirmPassword: "",
        },
        validationSchema: validationSchema,
        onSubmit: async (values: {password: string, confirmPassword: string }) => {
            if (values.password !== values.confirmPassword) {
                return;
            }

            try {
                await resetPassword(values.password);
                setPasswordChanged(true);
            } catch (error: unknown) {
                handleError(error, showFeedback);
            }
        }
    });

    return (
        <React.Fragment>
            {isValidToken && !passwordChanged &&
                <StyledCard className={"loginContainer"} variant={"outlined"}>
                    <Box>
                        <Typography
                            component="h1"
                            variant="h5"
                            sx={{width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)'}}
                        >
                            Redefinir senha
                        </Typography>
                    </Box>

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
                            <FormLabel htmlFor={"password"}>Nova senha</FormLabel>
                            <TextField
                                id={"password"}
                                name={"password"}
                                type={"password"}
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.password && Boolean(formik.errors.password)}
                                helperText={formik.touched.password && formik.errors.password}
                                fullWidth
                                variant={"outlined"}
                                size={"small"}
                            />
                        </FormControl>

                        <FormControl>
                            <FormLabel htmlFor={"confirmPassword"}>Confirme a nova senha</FormLabel>
                            <TextField
                                id={"confirmPassword"}
                                name={"confirmPassword"}
                                type={"password"}
                                value={formik.values.confirmPassword}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                                helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                                fullWidth
                                variant={"outlined"}
                                size={"small"}
                            />
                        </FormControl>

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={formik.isSubmitting}
                            sx={{marginTop: 2}}
                        >
                            Redefinir senha
                        </Button>
                    </Box>
                </StyledCard>
            }

            {!isValidToken && !passwordChanged &&
                <StyledCard className={"loginContainer"}>
                    <Box display={"flex"} justifyContent={"center"}>
                        <Error sx={{ fontSize: 'clamp(4rem, 10vw, 2.15rem)' }} />
                    </Box>

                    <Box display={"flex"} flexDirection={"row"} gap={1} justifyContent={"center"}>
                        <Typography variant={"h5"}>Link inválido ou expirado</Typography>
                    </Box>

                    <Divider />

                    <Button fullWidth variant="contained" component={RouterLink} to={"/Login"}>
                        Voltar para tela de login
                    </Button>
                </StyledCard>
            }

            {passwordChanged &&
                <StyledCard className={"loginContainer"}>
                    <Typography
                        component="h1"
                        variant="h5"
                        sx={{width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)'}}
                    >
                        Senha alterada
                    </Typography>

                    <Divider />

                    <Box>
                        <Typography variant={"body1"}>
                            Sua senha foi alterada com sucesso!
                        </Typography>
                    </Box>

                    <Button fullWidth variant="contained" component={RouterLink} to={"/Login"}>
                        Prosseguir com o login
                    </Button>
                </StyledCard>
            }
        </React.Fragment>
    )
}

export default ForgotPassword
