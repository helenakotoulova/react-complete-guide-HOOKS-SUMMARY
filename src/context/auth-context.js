import React, {useState} from "react";

export const AuthContext = React.createContext({
    isAuth: false,
    login: () => {}
})

const AuthContextProvider = (props) => {
    const [isAuthenticated,setIsAuthenticated] = useState(false);

    const loginHandler = () => {
        setIsAuthenticated(prevState => !prevState)
    }
    const authContextValue = {
        isAuth:isAuthenticated,
        login:loginHandler
    }

    return (
        <AuthContext.Provider value={authContextValue}>
{props.children}
        </AuthContext.Provider>
    )
}

export default AuthContextProvider;