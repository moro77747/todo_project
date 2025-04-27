import { createContext,useContext,useState } from "react";

//1.create a context
export const AuthContext = createContext()
export const useAuth = ()=>useContext(AuthContext)

//2.share the created context with other components
export default function AuthProvider({children})
{
    //put some state in the context
    const [number,setNumber] = useState(10)

    const [isAuthenticated,setAuthenticated] = useState(false)

    function login(username,password)
    {
        if(username==='in28minutes' && password==='dummy'){
            setAuthenticated(true)
            return true            
        } else {
            setAuthenticated(false)
            return false
        } 
    }

    function logout()
    {
        setAuthenticated(false)
    }

    //setInterval(()=>setNumber(number+1),10000)

    return(
        <AuthContext.Provider value={{isAuthenticated,login,logout}}>
            {children}
        </AuthContext.Provider>
    )
}