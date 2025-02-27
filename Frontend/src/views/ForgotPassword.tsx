import StyledCard from "../components/StyledCard.tsx";
import React, {useState} from "react";
import {AlertColor, Box, Button, FormControl, FormLabel, TextField, Tooltip, Typography} from "@mui/material";
import {useFormik} from "formik";
import {Link as RouterLink} from "react-router-dom";
import * as yup from "yup";
import IconButton from "@mui/material/IconButton";
import {ArrowBack} from "@mui/icons-material";
import {useUser} from "../contexts/UserContext.tsx";
import handleError from "../utils/handleError.ts";

interface IForgotPasswordProps {
    showFeedback: (message: string, severity: AlertColor) => void;
}

const ForgotPassword: React.FC<IForgotPasswordProps> = ({showFeedback}: IForgotPasswordProps) => {
    const [emailSent, setEmailSent] = useState<boolean>(false);

    const {sendResetPasswordEmail} = useUser();

    const validationSchema = yup.object({
        email: yup
            .string()
            .email("Digite um email válido")
            .required("E-mail é obrigatório"),
    });

    const formik = useFormik({
        initialValues: {
            email: "",
        },
        validationSchema: validationSchema,
        onSubmit: async (values: { email: string }) => {
            try {
                await sendResetPasswordEmail(values.email);
                setEmailSent(true);
            } catch (error: unknown) {
                handleError(error, showFeedback)
            }
        }
    });

    return (
        <React.Fragment>
            <StyledCard className={"loginContainer"} variant={"outlined"}>
                {!emailSent ? (
                    <>
                        <Tooltip title={"Voltar"} placement={"top"}>
                            <IconButton component={RouterLink} to={"/Login"}>
                                <ArrowBack/>
                            </IconButton>
                        </Tooltip>

                        <Box>
                            <Typography
                                component="h1"
                                variant="h5"
                                sx={{width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)'}}
                            >
                                Redefinir senha
                            </Typography>

                            <Typography
                                variant="body1"
                            >
                                Por favor, informe o e-mail que você utilizou para cadastrar sua conta. Um link será enviado para redefinir sua senha.
                            </Typography>
                        </Box>

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
                                Enviar link
                            </Button>
                        </Box>
                    </>
                ) : (
                    <>
                        <Box>
                            <Typography
                                component="h1"
                                variant="h5"
                                sx={{width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)'}}
                            >
                                E-mail enviado
                            </Typography>

                            <Typography
                                variant="body1"
                            >
                                Verifique sua caixa de entrada e acesse o link enviado para prosseguir.
                            </Typography>
                        </Box>
                    </>
                )}
            </StyledCard>
        </React.Fragment>
    )
}

export default ForgotPassword