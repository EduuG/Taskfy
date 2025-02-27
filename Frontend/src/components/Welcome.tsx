import StyledCard from "./StyledCard.tsx";
import {Box, Button, Divider, Typography} from "@mui/material";
import {Link as RouterLink} from "react-router-dom";

const Welcome = () => {
    return (
        <StyledCard sx={{ maxWidth: "600px", minHeight: "200px", justifyContent: "space-between", textAlign: "center" }}>
            <Box>
                <Typography variant="h2" color="textSecondary" paddingY={2}>Bem-vindo ao Taskfy!</Typography>
                <Divider />
                <Typography variant={"subtitle2"} paddingY={2}>Gerencie as tarefas do seu dia a dia de maneira fácil e intuitiva.</Typography>
            </Box>

            <Button variant="contained" color="primary" component={RouterLink} to={"/"}>Prosseguir</Button>
        </StyledCard>
    )
}

export default Welcome;