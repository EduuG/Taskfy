import React, {useEffect, useState} from "react";
import StyledCard from "./StyledCard.tsx";
import {useUser} from "../contexts/UserContext.tsx";
import {fetchWeatherApi} from "openmeteo";
import {Box, Button, CircularProgress, Divider, Tooltip, Typography} from "@mui/material";
import Grid from "@mui/material/Grid2";
import {InfoOutlined, Warning} from "@mui/icons-material";
import weatherIcons from "./WeatherIcons.tsx";
import {Link as RouterLink} from "react-router-dom";
import handleError from "../utils/handleError.ts";

interface WeatherData {
    temperature: number;
    weather_code: number;
}

const InfoSidebar: React.FC = () => {
    const {userData, isTryingOut} = useUser();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [coordinates, setCoordinates] = useState<{ lat: number, lon: number } | null>(null);
    const [weather, setWeather] = useState<WeatherData | null>(null);

    const getUserLocation = async (): Promise<{ lat: number, lon: number }> => {
        if (!navigator.geolocation) {
            throw new Error("Geolocalização não suportada.")
        }

        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        lat: position.coords.latitude,
                        lon: position.coords.longitude,
                    });
                },
                (error) => {
                    reject(new Error(`Erro ao obter localização: ${error.message}`));
                },
                {timeout: 10000}
            );
        });
    };

    useEffect(() => {
        const fetchCoordenadas = async () => {
            let coordinates: { lat: number; lon: number } | null = null;

            try {
                coordinates = await getUserLocation();

            } catch (error: unknown) {
                handleError(error);

            } finally {
                if (coordinates) {
                    setCoordinates(coordinates);
                } else {
                    setIsLoading(false);
                }
            }
        };

        fetchCoordenadas();
    }, []);

    useEffect(() => {
        const fetchTemperatura = async () => {
            const url = "https://api.open-meteo.com/v1/forecast";

            const params = {
                "latitude": coordinates?.lat,
                "longitude": coordinates?.lon,
                "current": ["temperature_2m", "weather_code"]
            };

            try {
                if (coordinates) {
                    const responses = await fetchWeatherApi(url, params);
                    const response = responses[0];

                    const current = response.current()!;

                    setWeather({
                        temperature: current.variables(0)!.value()!,
                        weather_code: current.variables(1)!.value()!
                    });
                }
            } catch (error: unknown) {
                handleError(error);
            } finally {
                setIsLoading(false);
            }
        }

        if (coordinates) fetchTemperatura();

    }, [coordinates]);

    return (
        <>
            <StyledCard className={"statusContainer"} sx={{alignSelf: "end"}}>
                <Grid container spacing={2} flexDirection={"column"}>
                    <Grid size={12}>
                        <Typography variant={"h4"} align={"center"}>Olá, {!isTryingOut ? userData?.Name.split(' ')[0] : "anônimo"}!</Typography>
                    </Grid>

                    <Divider/>

                    <Grid size={12} display={"flex"} alignItems={"center"} flexDirection={"column"}>
                        <Box
                            display={"flex"}
                            alignItems={"center"}
                            gap={3}
                            justifyContent={"center"}
                            minWidth={"100%"}
                            padding={"20px"}
                            borderRadius={"8px"}
                            boxShadow={"rgba(0, 0, 0, 0.04) 0px 3px 5px"}
                        >
                            {isLoading &&
                                <CircularProgress/>
                            }

                            {!isLoading && weather &&
                                <>
                                    <Box display="flex" justifyContent={"center"}>
                                        <img
                                            src={`${weatherIcons[weather.weather_code].icon}`}
                                            alt={weatherIcons[weather.weather_code].description}
                                            width={80}
                                            height={80}
                                            style={{
                                                filter: 'drop-shadow(0px 6px 8px rgba(0, 0, 0, 0.2))',
                                            }}
                                        />
                                    </Box>

                                    <Box display="flex" flexDirection="column" alignItems="center">
                                        <Typography
                                            variant={"body1"}
                                            component={"span"}
                                            sx={{
                                                fontSize: "3rem",
                                            color: "text.primary",
                                                letterSpacing: "2px",
                                                textShadow: "2px 2px 4px rgba(0, 0, 0, 0.1)",
                                            }}
                                        >
                                            {weather?.temperature.toFixed()}°C
                                        </Typography>

                                        <Typography variant={"body1"} sx={{color: "text.secondary"}}>
                                            {weatherIcons[weather.weather_code].description}
                                        </Typography>
                                    </Box>
                                </>
                            }

                            {!isLoading && !weather &&
                                <Box display={"flex"} flexDirection={"row"} alignItems={"center"} gap={1}>
                                    <Typography variant={"subtitle1"}>
                                        Não foi possível obter o clima
                                    </Typography>

                                    <Tooltip
                                        title={"Verifique se esta página possui permissão de localização ou se o seu navegador possui a função de geolocalização."}
                                        sx={{cursor: "pointer"}}>
                                        <InfoOutlined/>
                                    </Tooltip>
                                </Box>
                            }
                        </Box>
                    </Grid>
                </Grid>
            </StyledCard>

            {isTryingOut &&
                <StyledCard className={"statusContainer"} sx={{alignSelf: "end", border: "1px solid"}}>
                    <Box display={"flex"} justifyContent={"center"} gap={2} alignItems={"center"} position={"relative"}>
                        <Warning fontSize={"large"} color={"warning"}/>
                        <Typography variant={"h4"}>Modo de experimento</Typography>
                    </Box>

                    <Divider/>

                    <Typography color={"text.secondary"}>Tarefas adicionadas nesse modo serão perdidas ao recarregar a página, pois não são persistidas no banco.</Typography>

                    <Button component={RouterLink} to={"/Register"} fullWidth variant="contained">Cadastre-se aqui</Button>
                </StyledCard>
            }
        </>
    )
}

export default InfoSidebar;