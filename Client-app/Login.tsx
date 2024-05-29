import React, { useState ,useEffect, useContext, useRef} from "react";
import { Button, GestureResponderEvent, TouchableOpacity,NativeSyntheticEvent, SafeAreaView, StyleSheet, Text, TextInputChangeEventData, TextInputComponent, View, Image, Alert, Animated,Easing } from "react-native";
import CustomTextInput from "./components/CustomTextInput";
import  PhoneNumberDropdown  from "./components/PhoneNumberDropdown";
import  CustomButton  from "./components/CustomButton";
import OTPInput from "./components/OTPInput";
import TextLink from "./components/TextLink";
import auth from '@react-native-firebase/auth';
import { json, useNavigate } from "react-router-native";
import IconButton from "./components/IconButton";
import { AuthContext } from "./components/AuthContext";

interface Country {
    label: string;
    value: string;
  }

  const verifyStatus = {
    not : "notverified",
    done : "done",
    Invalid : "invalid"
}




function Login (): React.JSX.Element {
    const [phoneNumber, setPhoneNumber] = useState<string>("");
    const [countryCode, setCountryCode] = useState<Country>({ label: '+91 (India)', value: '91' })
    const [password, setPassword] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [otpSection,setOtpSection] = useState<Boolean>(false)
    const [confirm, setConfirm] = useState<any>();
    const [otp, setOtp] = useState('');
    const [Varifyotp, setOtpVarifyotp] = useState(false);
    const [visible,setVisible] = useState<boolean>(false)
    const navigate = useNavigate();
    const [verifyStatusState, setVerifyStatus] = useState<any>(verifyStatus.not)
    const authContext = useContext(AuthContext);
    const position = useRef(new Animated.Value(0)).current;
    
    useEffect(() => {
        const animation = Animated.loop(
            Animated.timing(position, {
                toValue: 1,
                duration: 5000,
                useNativeDriver: true,
                easing: Easing.linear,
            }),
            { resetBeforeIteration: true }
        );
        
        animation.start();
        
        return () => {
            animation.stop();
        };
    }, []);
    
    const handleInputChange = (event: NativeSyntheticEvent<TextInputChangeEventData>) => {
        const inputValue = event.nativeEvent.text;
        setPhoneNumber(inputValue); 
    };
    const translateY = position.interpolate({
        inputRange: [0, 0.2, 1], 
        outputRange: [0, 10, 0], 
    });
    const handleCountryCodeChange = (country :  Country) => {
        console.log(country)
        setCountryCode(country);
    };

    const handlePasswordChange = (event: NativeSyntheticEvent<TextInputChangeEventData>) => {
        const inputValue = event.nativeEvent.text;
        setPassword(inputValue);
    };    
    const handleOtpChange = (newOtp: string) => {
        setOtp(newOtp);
        
      };

      function onAuthStateChanged(user : any) {
       if (user) {
        //   console.log(user)
            } 
        }

      

        useEffect(() => {
             const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
             return subscriber; // unsubscribe on unmount
        }, []);
    
      async function signInWithPhoneNumber(phoneNumber : any) {
        console.log("confirmation")
        const confirmation = await auth().signInWithPhoneNumber(phoneNumber,true);
        setConfirm(confirmation);
       
    }

      async function confirmCode() {
        setErrorMessage("")
        setOtpVarifyotp(true)
        try {
              console.log(otp)
              await confirm.confirm(otp); 
              setVerifyStatus(verifyStatus.done)
              matchPhoneNumberAndPassword()
              setOtpVarifyotp(true)
              
            } catch (error) {
                setErrorMessage('Invalid code.');
                setVerifyStatus(verifyStatus.Invalid)
                setOtpVarifyotp(false)
            }
     }

     const matchPhoneNumberAndPassword = async () => {
        const bodyData = {phoneNumber : countryCode.value+phoneNumber , password}
        console.log(JSON.stringify(bodyData))
        try {
    
          const response = await fetch(`https://profile-backend-amber.vercel.app/api/users/login`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body : JSON.stringify(bodyData)
          });
          const data = await response.json();
          if (response.status === 200) {
            authContext?.setUserData(countryCode.value+phoneNumber)
            authContext?.setToken(data.token)
            navigate('/',{replace:true})
            Alert.alert('Success', 'Login successful');
          } else {
            if(response.status == 401){
                Alert.alert('Oops!!', 'Invalid phone number or password');
            }
                setPassword("")
                setOtpVarifyotp(false)
                setVerifyStatus(verifyStatus.not)
                setOtpSection(false);
            
          }
        } catch (error) {
        //   console.error('Error:', error);
        Alert.alert('Oops!!', 'Invalid phone number or password');
        //   Alert.alert('Error', 'An error occurred. Please try again later.');
        setPassword("")
        setOtpVarifyotp(false)
        setVerifyStatus(verifyStatus.not)
        setOtpSection(false);
        }
      };
    

     const login=()=>{
        
        if (phoneNumber.length !== 10) {
            setErrorMessage("Phone number must be 10 digits");
            
        } else if(password.length === 0) {
            setErrorMessage("Enter The Password");
        }else{

            setErrorMessage("");
            setOtpSection(true)
            
            const formattedPhone = phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
            signInWithPhoneNumber("+"+countryCode.value+" "+ formattedPhone)
       
        }
        }
        
        const navigateToAbout = () => {
            navigate('/signin',{replace:true});
          };
    return(
    <SafeAreaView style={styles.container}>

        
      {otpSection?  <TouchableOpacity style={styles.backButton} onPress={()=>{setOtpSection(!otpSection); setPassword(""); setErrorMessage(""); setOtpVarifyotp(false); setVerifyStatus(verifyStatus.not)}}>
       < Image  source={require("./assest/arrow.png")}  style={styles.icon}/>
        </TouchableOpacity>:""}
        < Animated.Image  source={require("./assest/astro.png")}  style={[styles.sticker,{ transform: [{ translateY }] }]}/>
            <Text style={styles.message}>Log in</Text>
            <Text style={styles.message}>{otpSection?"Enter OTP":"Hello, Wellcome Back!!"}</Text>
            <View style={styles.inputContainer}>
                {!otpSection?
                (<>
                <CustomTextInput value={phoneNumber} onChange={handleInputChange} keyboardType={"number-pad"} placeholder="Phone Number" placeholderTextColor="#898989" frontComponent={<PhoneNumberDropdown onSelectCountry={handleCountryCodeChange} />} />
                <CustomTextInput onChange={handlePasswordChange} keyboardType="default" placeholder="Password" placeholderTextColor="#898989" secureTextEntry={!visible}  BackComponent={<IconButton source={visible?require('./assest/openEye.png'):require('./assest/CloseEye.png')} Icon_container={styles.Icon_container} icon_img={styles.icon_img} onPress={()=>setVisible(!visible)}/>}/>
                <View style={styles.reser}>
                <TextLink message={""} link={"Reset Password"} color={"blue"} fontSize={15} onPress={()=>{navigate('/reset',{replace:true})}}  />
                </View>
                </>
                ):
                (<OTPInput verify={verifyStatusState} length={6}  onChange={handleOtpChange}/>)
                }
            <Text style={styles.errormsg}>{errorMessage}</Text>
            </View>
            <View style={styles.buttonContainer}>
                {!otpSection?
                <CustomButton disabled={false} sourceFalse={false} source={require("./assest/arrow.png")}  verify={false}  title={"Lets Go"} onPress={login} />
                :
                <CustomButton disabled={Varifyotp} sourceFalse={false} source={require("./assest/arrow.png")}  verify={true}  title={"Verify OTP"} onPress={confirmCode} />
                }
                <TextLink color="blue" fontSize={15} message="Have Account?" link="Sign Up" onPress={navigateToAbout} />
            </View>
    </SafeAreaView> 
    )
}

const styles = StyleSheet.create({
    container: {
        minHeight:"100%",
        backgroundColor:"#fff",
        display:"flex",
        alignItems:"center",
        justifyContent:"center",
        position:"relative",
    },
    inputContainer:{
        display:'flex',
        gap:5,
        padding:20,
    },
    buttonContainer : {
        width:"100%",
        position:"absolute",
        bottom:10,
        paddingHorizontal:30
    },
    message:{
        color:"#000",
        fontSize:30,
        fontWeight:"700"
    },
    errormsg:{
        fontSize:12,
        color:"red",
        textAlign:"center",
    },
    backButton:{
        position:"absolute",
        top:20,
        left:20,
        width:50,
        backgroundColor: '#5606FF',
        padding: 15,
        borderRadius: 100,
    },
    icon:{
        transform:"rotate(180deg)",
        height:21,
        width:18
    },
    Icon_container:{
        // backgroundColor:"red",
        display:"flex",
        alignItems:"center",
        justifyContent:"center", 
        width:50
    },
    icon_img:{
        height:20,
        width:20,
    },
    reser:{
        display:"flex",
        flexDirection:"row",
        justifyContent:"flex-end",
        // backgroundColor:"red",
        alignItems:"center",
    },
    sticker:{
        height:170,
        width:170,
        position:"absolute",
        top:4,
        right:9,
        zIndex:-1,
    }
  });
  
 export default Login;

