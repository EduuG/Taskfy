import React from "react";
import {useColorScheme} from "@mui/material/styles";

interface ILogoProps {
    height: string,
}

const Logo: React.FC<ILogoProps> = ({height}: ILogoProps) => {
    const { mode, systemMode } = useColorScheme();
    const isDarkMode = mode === 'dark' || systemMode === 'dark';

    const logoStyle = {
        height,
        transition: "filter 0.3s ease",
        filter: `${isDarkMode ? "invert(1) drop-shadow(0 4px 8px rgba(0, 0, 0, 0.5))" : "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))"} `,
    }

    return(
        <img
            src={"/icons/app/logo.svg"}
            alt={"Taskfy logo"}
            style={logoStyle}
        />
    )
}

export default Logo;