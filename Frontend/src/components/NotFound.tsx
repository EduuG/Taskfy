import React from 'react';
import StyledCard from "./StyledCard.tsx";
import {Box, Button, Divider, Typography} from "@mui/material";
import Logo from "./Logo.tsx";
import {Link as RouterLink} from "react-router-dom";
import {useColorScheme} from "@mui/material/styles";

const NotFound: React.FC = () => {
    const { mode } = useColorScheme();
    const isDarkMode = mode === 'dark';

    const style = {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 3,
        width: "400px",
    }

    const imgStyle = {
        transition: "filter 0.3s ease",
        filter: `${isDarkMode ? "invert(1) drop-shadow(0 4px 8px rgba(0, 0, 0, 0.5))" : "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))"} `,
        height: "100px",
    }

    return (
        <React.Fragment>
            <Box sx={style}>
                <Divider>
                    <Logo height={"30px"} />
                </Divider>

                <StyledCard variant={"outlined"} sx={{ justifyContent: "space-between", alignItems: "center", height: "400px", gap: 2 }} >
                    <Box display={"flex"} flexDirection={"column"} alignItems={"center"} padding={"40px"}>
                        <img src={"/icons/app/not-found.png"} alt={"Página não encontrada"} style={imgStyle} />
                        <Typography variant={"h1"}>404</Typography>
                        <Typography variant={"subtitle2"} color={"text.secondary"}>Página não encontrada</Typography>
                    </Box>

                    <Button variant={"contained"} sx={{ marginBottom: "30px" }} component={RouterLink} to={"/"}>Voltar para tela inicial</Button>
                </StyledCard>
            </Box>
        </React.Fragment>
    );
};

export default NotFound;