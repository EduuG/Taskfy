import {Navigate, Outlet} from "react-router";
import {useUser} from "../contexts/UserContext.tsx";

const PublicRoute: React.FC = () => {
    const {isAuthenticated, isRegistering} = useUser();

    return !isAuthenticated || isRegistering ? <Outlet /> : <Navigate replace to={"/"} />
};

export default PublicRoute;