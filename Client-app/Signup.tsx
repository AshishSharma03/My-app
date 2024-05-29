import React, { useContext, useEffect, useRef, useState } from "react";
import {  TouchableOpacity,NativeSyntheticEvent, SafeAreaView, StyleSheet, Text, TextInputChangeEventData, TextInputComponent, View, Image, Alert, Animated, Easing } from "react-native";
import CustomTextInput from "./components/CustomTextInput";
import  PhoneNumberDropdown  from "./components/PhoneNumberDropdown";
import  CustomButton  from "./components/CustomButton";
import OTPInput from "./components/OTPInput";
import IconButton from "./components/IconButton";
import TextLink from "./components/TextLink";
import auth from '@react-native-firebase/auth';
import  {useNavigate } from 'react-router-native';
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


function Signup (): React.JSX.Element {
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [phoneNumber, setPhoneNumber] = useState<string>("");
    const [countryCode, setCountryCode] = useState<Country>({ label: '+91 (India)', value: '91' });
    const [password, setPassword] = useState<string>("");
    const [retypePassword, setRetypePassword] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [otpSection, setOtpSection] = useState<boolean>(false);
    const [visible,setVisible] = useState<boolean>(false)
    const navigate = useNavigate();
    const [Varifyotp, setOtpVarifyotp] = useState(false);
    const [confirm, setConfirm] = useState<any>();
    const [otp, setOtp] = useState('');
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
    
    const handlePhoneNo = (event: NativeSyntheticEvent<TextInputChangeEventData>) => {
        const inputValue = event.nativeEvent.text;
        setPhoneNumber(inputValue); 
    };

    const handlefirstName = (event: NativeSyntheticEvent<TextInputChangeEventData>) => {
        const inputValue = event.nativeEvent.text;
        setFirstName(inputValue); 
    };
    const handleLastName = (event: NativeSyntheticEvent<TextInputChangeEventData>) => {
        const inputValue = event.nativeEvent.text;
        setLastName(inputValue); 
    };


    const handleEmail = (event: NativeSyntheticEvent<TextInputChangeEventData>) => {
        const inputValue = event.nativeEvent.text;
        setEmail(inputValue); 
    };



    const handleCountryCodeChange = (country :  Country) => {
        console.log(country)
        setCountryCode(country);
    };

    const handlePasswordChange = (event: NativeSyntheticEvent<TextInputChangeEventData>) => {
        const inputValue = event.nativeEvent.text;
        setPassword(inputValue);
    };    
    
    const handleRePasswordChange = (event: NativeSyntheticEvent<TextInputChangeEventData>) => {
        const inputValue = event.nativeEvent.text;
        setRetypePassword(inputValue);
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
        setOtpVarifyotp(true)
        try {
            await confirm.confirm(otp); 
            setVerifyStatus(verifyStatus.done)
            AddNewUser()
            setOtpVarifyotp(true)
            
        } catch (error) {
            setErrorMessage('Invalid code.');
            setVerifyStatus(verifyStatus.Invalid)
            setOtpVarifyotp(false)
            }
     }

     const AddNewUser = async () => {
        const updatedProfile = {
            _id: countryCode.value + phoneNumber,
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
            currentCompany: "",
            pastExperience: [],
            skillSets: [],
            educationalQualification: [],
            profilePicture: ""
        };
    
        console.log('Profile Data:', updatedProfile);
    
        try {
            const response = await fetch('https://profile-backend-amber.vercel.app/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedProfile),
            });

            if (!response.ok) {
                const errorText = await response.text();
    
                if (response.status === 400) {
                    if (errorText.includes('duplicate key error') && errorText.includes('_id')) {
                        Alert.alert('Error', 'A user with this Phone Number already exists.');
                        navigate('/login',{replace:true})
                       

                    } else if (errorText.includes('duplicate key error') && errorText.includes('email')) {
                        Alert.alert('Error', 'A user with this email already exists.');
                    } else {    
                        throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
                    }
                } else {
                    throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
                }
            } else {
                const data = await response.json();
                const token = data.token;
                authContext?.setUserData(countryCode.value+phoneNumber)
                authContext?.setToken(token)
                Alert.alert('Profile updated successfully:')
                navigate('/',{replace:true})
            }
        } catch (error) {
            navigate('/signin',{replace:true})
            console.error('Error Creating profile:', error);
            
        }
    };
    
    
    const Signup = () => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    
        if(firstName.length === 0 && lastName.length === 0){
            setErrorMessage("Enter First Name and Last Name");
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setErrorMessage("Invalid email address");
        } else if (phoneNumber.length !== 10) {
            setErrorMessage("Phone number must be 10 digits");
        } else if (!passwordRegex.test(password)) {
            setErrorMessage("Password must be at least 8 characters long and include a-z, A-Z letters, and symbols");
        } else if (password !== retypePassword) {
            setErrorMessage("Password and re-type password do not match");
        } else {
            setErrorMessage("");
            setOtpSection(true);
            const formattedPhone = phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
            signInWithPhoneNumber("+"+countryCode.value+" "+ formattedPhone)
        }
    };

    const navigateToAbout = () => {
        navigate('/login',{replace:true});
      };

    return(
    <SafeAreaView style={styles.container}>
         < Animated.Image  source={require("./assest/astro.png")}  style={styles.sticker}/>
      {otpSection?  <TouchableOpacity style={styles.backButton} onPress={()=>setOtpSection(!otpSection)}>
       < Image  source={require("./assest/arrow.png")}  style={styles.icon}/>
        </TouchableOpacity>:""}
            <Text style={styles.message}>Sign in </Text>
            <Text style={styles.message}>{otpSection?"Enter OTP":"Hii, Wellcome!!"}</Text>
            <View style={styles.inputContainer}>
                {!otpSection?
                (<>
               
                <CustomTextInput onChange={handlefirstName}  keyboardType="default" placeholder="First Name" placeholderTextColor="#898989"  />
                <CustomTextInput onChange={handleLastName}  keyboardType="default" placeholder="Last Name" placeholderTextColor="#898989"  />
                <CustomTextInput onChange={handleEmail} keyboardType="default" placeholder="Email" placeholderTextColor="#898989"  />
                <CustomTextInput value={phoneNumber} onChange={handlePhoneNo} keyboardType={"number-pad"} placeholder="Phone Number" placeholderTextColor="#898989" frontComponent={<PhoneNumberDropdown onSelectCountry={handleCountryCodeChange} />} />
                <CustomTextInput onChange   ={handlePasswordChange} keyboardType="default" placeholder="password" placeholderTextColor="#898989" secureTextEntry={!visible}  BackComponent={<IconButton source={visible?require('./assest/openEye.png'):require('./assest/CloseEye.png')} Icon_container={styles.Icon_container} icon_img={styles.icon_img} onPress={()=>setVisible(!visible)}/>}/>
                <CustomTextInput onChange={handleRePasswordChange} keyboardType="default" placeholder="Re-type password" placeholderTextColor="#898989" secureTextEntry={!visible} />
                
                </>
                ):
                (<OTPInput  verify={verifyStatusState} length={6} onChange={handleOtpChange}/>)
                }
            <Text style={styles.errormsg}>{errorMessage}</Text>
            </View>
            
            <View style={styles.buttonContainer}>
                {!otpSection?
                <CustomButton disabled={false} sourceFalse={false} source={require("./assest/arrow.png")}  verify={false}  title={"Lets Go"} onPress={Signup} />
                :
                <CustomButton disabled={Varifyotp} sourceFalse={false} source={require("./assest/arrow.png")}  verify={true}  title={"Verify OTP"} onPress={confirmCode} />
            }
             <TextLink color="blue" fontSize={15} message={"Already Account?"} link={"Login"} onPress={navigateToAbout} />
    
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
        paddingBottom:80,
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
    sticker:{
        height:170,
        width:170,
        position:"absolute",
        top:4,
        right:9,
    }
    

    
    
  });
  
 export default Signup;

