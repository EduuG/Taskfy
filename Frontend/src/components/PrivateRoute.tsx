import {Navigate, Outlet} from "react-router";
import {useUser} from "../contexts/UserContext.tsx";

const PrivateRoute: React.FC = () => {
    const {isAuthenticated, isTryingOut} = useUser();

    return isAuthenticated || isTryingOut ? <Outlet /> : <Navigate replace to={"/Login"} />
};

export default PrivateRoute;