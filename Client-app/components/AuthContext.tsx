// AuthContext.tsx
import React, { createContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';

interface AuthContextType {
    loginUser: boolean;
    setLoginUser: Dispatch<SetStateAction<boolean>>;
    userData: string;
    setUserData: Dispatch<SetStateAction<any>>;
    token : string,
    setToken: Dispatch<SetStateAction<string>>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [loginUser, setLoginUser] = useState<boolean>(false);
    const [userData, setUserData] = useState<any>(null);
    const [token, setToken] = useState<string>("");
    
    return (
        <AuthContext.Provider value={{ loginUser, setLoginUser, userData, setUserData,token,setToken }}>
            {children}
        </AuthContext.Provider>
    );
};
