import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import App from './App.tsx'
import {UserProvider} from "./contexts/UserContext.tsx";
import {LoadingProvider} from "./contexts/LoadingContext.tsx";
import {AxiosInterceptor} from "./api/api.ts";
import {BrowserRouter} from "react-router";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <LoadingProvider>
                <AxiosInterceptor>
                    <UserProvider>
                        <App/>
                    </UserProvider>
                </AxiosInterceptor>
            </LoadingProvider>
        </BrowserRouter>
    </StrictMode>
)
