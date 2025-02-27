import React, {createContext, useContext, useState} from "react";

interface LoadingContextProps {
    isLoading: boolean;
    setIsLoading: (isLoading: boolean) => void;
}

const LoadingContext = createContext<LoadingContextProps | null>(null);

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [isLoading, setIsLoading] = useState(false);

    return (
        <LoadingContext.Provider value={{isLoading, setIsLoading}}>
            {children}
        </LoadingContext.Provider>
    );
};

export const useLoading = (): LoadingContextProps => {
    const context = useContext(LoadingContext);
    if (!context) {
        throw new Error();
    }

    return context;
}