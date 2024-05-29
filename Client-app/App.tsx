import 'react-native-get-random-values'
import {  NativeRouter, NavigationType, Route, Routes } from "react-router-native";
import Login from "./Login";
import Signup from "./Signup";
import Home from "./Home";
import { AuthProvider } from './components/AuthContext';
import ProfileEditPanel from './ProfileEditPanel';
import ResetPass from './ResetPass';
import { useEffect } from 'react';
import BootSplash from "react-native-bootsplash";


function App(): React.JSX.Element {
   useEffect(() => {
      const init = async () => {    
      };
  
      init().finally(async () => {
        await BootSplash.hide({ fade: true });
        console.log("BootSplash has been hidden successfully");
      });
    }, []);
  

   return(
      <AuthProvider>
      <NativeRouter basename="/"  >
         <Routes>
            <Route  path="/"  Component={Home} />
            <Route  path="/Edit"  Component={ProfileEditPanel} />
            <Route   path="/login"  Component={Login} />
            <Route   path="/signin"  Component={Signup} />
            <Route   path="/reset"  Component={ResetPass} />
         </Routes>
      </NativeRouter>    
      </AuthProvider>
      
   )

}


export default App
