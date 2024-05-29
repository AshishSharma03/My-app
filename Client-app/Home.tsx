import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, Button, Alert, ActivityIndicator } from 'react-native';
import { launchCamera, launchImageLibrary, MediaType, ImageLibraryOptions, CameraOptions } from 'react-native-image-picker';
import IconButton from './components/IconButton';
import CustomButton from './components/CustomButton';
import TextLink from './components/TextLink';
import { useNavigate } from 'react-router-native';
import { AuthContext } from './components/AuthContext';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  currentCompany: string;
  pastExperience: { companyName: string; role: string; yearsOfExperience: number }[];
  skillSets: string[];
  educationalQualification: { institutionName: string; degree: string; fieldOfStudy: string; graduationYear: number }[];
  profilePicture: string | null;
}

const Home: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [imagebase64 , setimagebase64] = useState<any>(null)
  const [editProfilePicure,SetEditProfilePicure] = useState<boolean>(false)
  const navigate = useNavigate()
  const authContext = useContext(AuthContext);
  const [saveImage,setSaveImage] = useState(false)
 

  useEffect(()=>{
    if(authContext?.loginUser){
        navigate('/login',{replace:true})
    }else{
      fetchData();
    }
  },[authContext])

  useEffect(()=>{
    fetchData()
    // console.log("DATA : "+ authContext?.userData +" : "+authContext?.token)
  },[])

  const fetchData = async () => {
    try {
      const response = await fetch(`https://profile-backend-amber.vercel.app/api/users/${authContext?.userData}`,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${authContext?.token}`, // Add authorization header
            // 'Authorization': `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6IjkxODQzNDA2MDQ5OCIsImlhdCI6MTcxNjkzNTUxNCwiZXhwIjoxNzE2OTM5MTE0fQ.EBjA-2YJXxwIiZ8J8nbOTg8ypGuA-utcu6SUH08KixM`, // Add authorization header
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      } 

      const data: User = await response.json();
      setUser(data);
      console.log("sasa")
      setimagebase64(data?.profilePicture)
      // console.log(data)
    } catch (error) {
      // console.error('Error fetching data:', error);
      authContext?.setLoginUser(false)
      navigate('/login',{replace:true})
    }
  };
    // console.log(user)

  const handleImageUpload = async (useCamera: boolean) => {
    const options: ImageLibraryOptions & CameraOptions = {
      mediaType: 'photo' as MediaType,
      quality: 0.2,
      includeBase64: true,
    };
  
    const result = useCamera 
      ? await launchCamera(options) 
      : await launchImageLibrary(options);
  
    if (result.didCancel) {
      console.log('User cancelled image picker');
    } else if (result.errorCode) {
      console.log('ImagePicker Error: ', result.errorMessage);
    } else {
      const asset = result.assets && result.assets[0];
     
      if (asset) {
        const base64Image = `data:image/jpeg;base64,${asset.base64}`;
        setimagebase64(base64Image)
       
      }
    }

  };
  
  const save = async () => {
    setSaveImage(true)
    try {
      const response = await fetch(`https://profile-backend-amber.vercel.app/api/users/${authContext?.userData}/profile-picture`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${authContext?.token}`
        },
        body: JSON.stringify({ profilePicture: imagebase64 }),
      });
  
      if (!response.ok) {
        // Log the response status and text if the request failed
        // console.error(`Failed to update profile picture. Status: ${response.status}, StatusText: ${response.statusText}`);
        // const errorData = await response.text();
        Alert.alert('Oops!!','Image size too large');
        setSaveImage(false)
      } else {
        Alert.alert("Yeah!",'Profile updated successfully');
        fetchData()
        SetEditProfilePicure(false)
        setSaveImage(false)
      }
    } catch (error) {
      Alert.alert('Oops!!','Error updating profile picture on the server');
    }
  };
  





  return (
    <View  style={styles.container}>
      {
        user?
        <View style={{display:"flex",flexDirection:"row"}}>
      <TextLink  color='blue' fontSize={18} message={''} link={'Edit profile'} onPress={()=> { navigate('/edit',{replace:true})}} />
      <View  style={{flex:1}}/>
      <TextLink  color='red'  fontSize={18} message={''} link={'Log out'} onPress={()=> { navigate('/login',{replace:true})}} />
      </View>
      :""
      }
      {user ? (
        <View style={styles.profileCard}>
          {imagebase64 ? (
            <View style={styles.profilePictureContainer}>
              <View  style={styles.picutreContainer}>
            <Image  source={{ uri: imagebase64 }} style={styles.profilePicture} />
            {!editProfilePicure?
              <IconButton  source={require('./assest/Aperture.png')} onPress={() => { SetEditProfilePicure(true)} } Icon_container={styles.edit} icon_img={styles.editIconimg} />
              :""
            }
              </View>
            <View style={styles.nameContaoiner} >
              <Text style={styles.Namelabel}>Name:</Text>
              <Text style={styles.NameValue}>{`${user.firstName} ${user.lastName}`}</Text>
              
            </View>
            </View>
          ) : (
            <View style={styles.profilePictureContainer}>
            <View  style={styles.picutreContainer}>
          <Image  source={require('./assest/Gallary.png')} style={styles.profilePicture} />
          {!editProfilePicure?
            <IconButton  source={require('./assest/Aperture.png')} onPress={() => { SetEditProfilePicure(true)} } Icon_container={styles.edit} icon_img={styles.editIconimg} />
            :""
          }
            </View>
          <View style={styles.nameContaoiner} >
            <Text style={styles.Namelabel}>Name:</Text>
            <Text style={styles.NameValue}>{`${user.firstName} ${user.lastName}`}</Text>
            
          </View>
          </View>
          )}
          {
            editProfilePicure?
          <View style={styles.iconsEdits}>
          <IconButton  source={require('./assest/Aperture.png')} onPress={() => handleImageUpload(true)} icon_img={styles.Aperture} Icon_container={styles.Apreatureicon} />
          <IconButton  source={require('./assest/Gallary.png')} onPress={() => handleImageUpload(false)} icon_img={styles.Aperture} Icon_container={styles.Apreatureicon} />
          <CustomButton disabled={saveImage} source={require('./assest/arrow.png')} verify sourceFalse={true} title="save" onPress={() => save()} />
          <CustomButton disabled={false} source={require('./assest/arrow.png')} verify sourceFalse={true} title="Cancel" onPress={() => {SetEditProfilePicure(false);setimagebase64(user.profilePicture)}} />
        </View>
        :""
      }
         <ScrollView scrollEnabled  >
          <Text style={styles.label}>Phone Number:</Text>
          <Text style={styles.value}>+{user._id}</Text>
    
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{user.email}</Text>
          <Text style={styles.label}>Past Experience:</Text>
          {user.pastExperience.map((exp, index) => (
            <Text key={index} style={styles.value}>{`${exp.companyName} - ${exp.role} (${exp.yearsOfExperience} years)`}</Text>
          ))}
          <Text style={styles.label}>Skill Sets:</Text>
          <View style={styles.skillSetContainer}>
           {user.skillSets.map((skill, index) => (
              <View key={index} style={styles.skill}>
                <Text>{skill}</Text>
                </View>
            ))}
          </View>
        
            <Text style={styles.label}>Educational Qualification:</Text>
          {user.educationalQualification.map((edu, index) => (
            <View key={index} style={styles.exContainer}>
            <Text  style={[styles.valueHead,{color:"#000000"}]}>{`${edu.degree} in ${edu.fieldOfStudy}`}</Text>
            <Text  style={styles.valueSub}>{`${edu.institutionName}`}</Text>
            <Text  style={[styles.valueDate,{color:"#A5A5A5",fontFamily:"monospace"}]}>{`${edu.graduationYear}`}</Text>
            </View>
          ))}
          
      </ScrollView>
        </View>
      ) : (
        <View  style={{display:"flex",minHeight:"80%",alignItems:"center",justifyContent:"center"}}>
        <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor:"#fff",
    
  },
  profileCard: {
    backgroundColor: '#fff',
    padding: 16,
    // borderRadius: 10,
    borderTopLeftRadius:90,
    borderTopRightRadius:30,
    shadowColor: '#5761FF',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    elevation: 19,
    minHeight:"100%",
  },
  profilePictureContainer:{
    display:"flex",
    flexDirection:"row",
    alignItems:"center",
    
  },
  profilePicture: {
    width: 150,
    height: 150,
    borderRadius: 100,
    marginBottom: 16,
  },
  picutreContainer:{
    // backgroundColor:"red", 
    width: 150,
    height: 150,
    borderRadius: 100,
    marginBottom: 16,
    position:"relative",
  },
  Namelabel:{
    fontSize:20,
    fontWeight: '900',
    color: "#737373"
  },
  NameValue:{
    fontSize:30,
    fontWeight: 'bold',
    color: "#000",
    textAlign:"center"
  },
  nameContaoiner:{
    // backgroundColor:"red",
    display:"flex",
    flexDirection:"column",
    alignItems:"center",
    justifyContent:"flex-start",
    flex:1,
    padding:10,
    
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 4,
    fontSize:14,
    color: "#737373"
  },
  value: {
    marginBottom: 16,
    color: "#000",
    fontSize:20,
    fontWeight:"700"
  },
  valueHead: {
    color: "#000",
    fontSize:20,
    fontWeight:"700"
  },
  valueSub: {
    color: "#5B5B5B",
    fontSize:20,
    fontWeight:"700"
  },
  valueDate: {
    color: "#000",
    fontSize:15,
    fontWeight:"700"
  },
  skillSetContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  skill: {
    backgroundColor:"#50CA86",
    color:"#000",
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginRight: 8,
    marginBottom: 8,
    borderRadius: 4,
  },
  Apreatureicon:{
    width:50,
    height:50,
  },
  Aperture:{
    width:50,
    height:50,
  },
  exContainer:{
    marginBottom:10,
  },
  iconsEdits:{
    display:"flex",
    flexDirection:"row",
    width:"100%",
    marginBottom:10,
    gap:10,
  },
  edit:{
    position:"absolute",
    right:1,
    bottom:1,
    zIndex:1,
  },
  editIconimg:{
    width:40,
    height:40,
  }

});

export default Home;
