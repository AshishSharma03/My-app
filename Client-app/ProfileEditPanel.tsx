import React, { ReactNode, useContext, useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Text, View, Modal, TouchableOpacity, ScrollView, GestureResponderEvent, Alert, ActivityIndicator } from "react-native";
import CustomTextInput from "./components/CustomTextInput";
import IconButton from "./components/IconButton";
import { useNavigate } from "react-router-native";
import { AuthContext } from "./components/AuthContext";

interface CustomModalProps {
  modalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  children: ReactNode;
  save :()=> void;
}

const CustomModal: React.FC<CustomModalProps> = ({ modalVisible, setModalVisible, children ,save}) => {
  return (
    <Modal animationType="fade" transparent={true} visible={modalVisible}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {children}
          <View style={{display:"flex",flexDirection:"row",gap:5}}>
          <TouchableOpacity style={styles.modalButton} onPress={() => {setModalVisible(false) ;save()}}>
            <Text style={styles.modalButtonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.modalButton,{backgroundColor:"red"}]} onPress={() => {setModalVisible(false)}}>
            <Text style={styles.modalButtonText}>Cancel</Text>
          </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

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
  profilePicture: any;
}

const ProfileEditPanel = () => {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [skill, setSkill] = useState<string>("");
  const [companyName, setCompanyName] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const [yearOfExperience, setYearOfExperience] = useState<number>(1);
  const [instituteName, setInstituteName] = useState<string>('');
  const [degree, setDegree] = useState<string>('');
  const [fieldOfStudy, setFieldOfStudy] = useState<string>('');
  const [passoutYear, setPassoutYear] = useState<string>('');
  const [ExperienceModalVisible, setExperienceModalVisible] = useState(false);
  const [QualificationModalVisible, setQualificationModalVisible] = useState(false);
  const [skillModalVisible, setskillModalVisible] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate()
  const [isDisable , setIsdisable] = useState(false)
  const authContext = useContext(AuthContext);
  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const response = await fetch(`https://profile-backend-amber.vercel.app/api/users/${authContext?.userData}`,{
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `${authContext?.token}`, // Add authorization header
          },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data: User = await response.json();
      setUser(data);
      setFirstName(data.firstName)
      setLastName(data.lastName)
      setEmail(data.email)

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  

  const AddExperience = () => {
    setExperienceModalVisible(true);
  };

  const AddQualification = () => {
    setQualificationModalVisible(true);
  };

  const AddSkill = () => {
    setskillModalVisible(true);
  };

  const SaveSkill =()=>{
    if(user){
      if(skill.length > 0){
        const updatedUser = {
          ...user,
          skillSets: [...user.skillSets, skill],
        };
        setUser(updatedUser);
      }else{
        Alert.alert("Oops!","Please fill out all fields correctly.")
      }
    }
  }
  const SaveExp =()=>{
     const newExperience = {
      companyName: companyName,
      role: role,
      yearsOfExperience: yearOfExperience,
    };
    if(user){
      if(companyName.length > 0 && role.length > 0 && yearOfExperience !== null ){
        if(yearOfExperience > 0 ){

          const updatedUser = {
            ...user,
            pastExperience: [...user.pastExperience, newExperience],
          };
          setUser(updatedUser);
        }else{

          Alert.alert("Oops!","Year of Experience shoud be > 0")
        }
      }else{
        Alert.alert("Oops!","Please fill out all fields correctly.")
      }
    }
  }
  const SaveEdu =()=>{
     const newQualification = {
      institutionName: instituteName,
      degree: degree,
      fieldOfStudy: fieldOfStudy,
      graduationYear: parseInt(passoutYear),
    };
    if(user){
      if(instituteName.length > 0 && degree.length > 0 && fieldOfStudy.length > 0 && passoutYear !== null ){
        const updatedUser = {
          ...user,
          educationalQualification: [...user.educationalQualification, newQualification],
        };
        setUser(updatedUser);
      }else{
        Alert.alert("Oops!","Please fill out all fields correctly.")
      }
    }
  }

  const removeExperience = (index: number) => {
    if (user) {
      const updatedExperience = [...user.pastExperience];
      updatedExperience.splice(index, 1);
      const updatedUser = {
        ...user,
        pastExperience: updatedExperience,
      };
      setUser(updatedUser);
    }
  };
  
  const removeQualification = (index: number) => {
    if (user) {
      const updatedQualifications = [...user.educationalQualification];
      updatedQualifications.splice(index, 1);
      const updatedUser = {
        ...user,
        educationalQualification: updatedQualifications,
      };
      setUser(updatedUser);
    }
  };
  
  const removeSkill = (index: number) => {
    if (user) {
      const updatedSkills = [...user.skillSets];
      updatedSkills.splice(index, 1);
      const updatedUser = {
        ...user,
        skillSets: updatedSkills,
      };
      setUser(updatedUser);
    }
  };
  
const saveData = async() => {
  setIsdisable(true)
  if (user) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if(firstName.length > 0 && lastName.length > 0 && emailRegex.test(email)){
      // console.log(user)
      const updatedUser = {
        ...user,
        firstName: firstName,
        lastName : lastName
      };
      try {
        const response = await fetch(`https://profile-backend-amber.vercel.app/api/users/${authContext?.userData}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${authContext?.token}`
          },
          body: JSON.stringify(updatedUser)
        });
        const data = await response.json();
        setIsdisable(false)
        Alert.alert("Yeah!",'Updated Your Profile!');
       
      } catch (error) {
        setIsdisable(false)
        Alert.alert('Oops!', 'Failed to update user. Please try again later.');
      }

    }else{
      setIsdisable(false)
      Alert.alert("Oops!","Check full First Name , Last Name  and Email should be correct");
    }
    

  }
};

  return (
    <SafeAreaView style={styles.container}>
      <IconButton onPress={()=>{navigate('/',{replace:true})}} source={require('./assest/arrow.png')} Icon_container={styles.backIconCon} icon_img={styles.backIcon} />
      {user ?<>
      <Text style={styles.message}>Edit Profile</Text>
      <ScrollView style={styles.scrollview}>
        <View style={styles.inputContainer}>
          <CustomTextInput
            value={firstName}
            onChangeText={(text)=>{setFirstName(text)}}
            keyboardType="default"
            placeholder="First Name"
            placeholderTextColor="#898989"
          />
          <CustomTextInput
            value={lastName}
            onChangeText={(text)=>{setLastName(text)}}
            keyboardType="default"
            placeholder="Last Name"
            placeholderTextColor="#898989"
          />
          <CustomTextInput
            value={email}
            onChangeText={(text)=>{setEmail(text)}}
            keyboardType="email-address"
            placeholder="Email"
            placeholderTextColor="#898989"
          />
          <View style={styles.card}>
            <Text style={styles.label}>Past Experience:</Text>
            {user?.pastExperience.map((exp, index) => (
              <View key={index} style={styles.exContainer}>
                <IconButton source={require('./assest/remove.png')}   onPress={() => removeExperience(index)} Icon_container={styles.removeIconCon} icon_img={styles.removeIcon}  />
                <Text style={[styles.valueHead, { color: "#000000" }]}>{`${exp.companyName}`}</Text>
                <Text style={styles.valueSub}>{`${exp.role}`}</Text>
                <Text style={[styles.valueDate, { color: "#A5A5A5", fontFamily: "monospace" }]}>{`${exp.yearsOfExperience} years`}</Text>
              </View>
            ))}
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={AddExperience}>
                <Text style={styles.buttonText}>Add Experience</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.card}>
            <Text style={styles.label}>Educational Qualification:</Text>
            {user?.educationalQualification.map((edu, index) => (
              <View key={index} style={styles.exContainer}>
              <IconButton source={require('./assest/remove.png')}  onPress={() => removeQualification(index)} Icon_container={styles.removeIconCon} icon_img={styles.removeIcon}  />
                <Text style={[styles.valueHead, { color: "#000000" }]}>{`${edu.degree} in ${edu.fieldOfStudy}`}</Text>
                <Text style={styles.valueSub}>{`${edu.institutionName}`}</Text>
                <Text style={[styles.valueDate, { color: "#A5A5A5", fontFamily: "monospace" }]}>{`${edu.graduationYear}`}</Text>
              </View>
            ))}
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={AddQualification}>
                <Text style={styles.buttonText}>Add Qualification</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.card}>
            <Text style={styles.label}>Skill SET:</Text>
            <View style={styles.skillSetContainer}>
              {user?.skillSets.map((skill, index) => (
                <View key={index} style={styles.skill}>
                  <IconButton source={require('./assest/remove.png')}   onPress={() => removeSkill(index)} Icon_container={styles.removeIconCon} icon_img={styles.removeIcon}  />
                  <Text style={styles.skillText}>{skill}</Text>
                </View>
              ))}
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={AddSkill}>
                <Text style={styles.buttonText}>Add Skill</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Experience Modal */}
          <CustomModal save={SaveExp} modalVisible={ExperienceModalVisible} setModalVisible={setExperienceModalVisible}>
            <CustomTextInput
              value={companyName}
              onChangeText={(text)=>{setCompanyName(text)}}
              keyboardType="default"
              placeholder="Company Name"
              placeholderTextColor="#898989"
            />
            <CustomTextInput
              value={role}
              onChangeText={(text)=>{setRole(text)}}
              keyboardType="default"
              placeholder="Role"
              placeholderTextColor="#898989"
            />
            <CustomTextInput
              value={yearOfExperience.toString()}
              onChangeText={(text)=>{setYearOfExperience(Number(text))}}
              keyboardType="numeric"
              placeholder="Year of Experience"
              placeholderTextColor="#898989"
            />
          </CustomModal>

          {/* Qualification Modal */}
          <CustomModal save={SaveEdu} modalVisible={QualificationModalVisible} setModalVisible={setQualificationModalVisible}>
            <CustomTextInput
              value={instituteName}
              onChangeText={(text)=>{setInstituteName(text)}}
              keyboardType="default"
              placeholder="Institution Name"
              placeholderTextColor="#898989"
            />
            <CustomTextInput
              value={degree}
              onChangeText={(text)=>{setDegree(text)}}
              keyboardType="default"
              placeholder="Degree"
              placeholderTextColor="#898989"
            />
            <CustomTextInput
              value={fieldOfStudy}
              onChangeText={(text)=>{setFieldOfStudy(text)}}
              keyboardType="default"
              placeholder="Field of Study"
              placeholderTextColor="#898989"
            />
            <CustomTextInput
              value={passoutYear}
              onChangeText={(text)=>{setPassoutYear(text)}}
              keyboardType="numeric"
              placeholder="Passout Year"
              placeholderTextColor="#898989"
            />
          </CustomModal>

          {/* Skill Modal */}
          <CustomModal save={SaveSkill} modalVisible={skillModalVisible} setModalVisible={setskillModalVisible}>
            <CustomTextInput
              value={skill}
              onChangeText={(text)=>{setSkill(text)}}
              keyboardType="default"
              placeholder="Skills (HTML/CSS)"
              placeholderTextColor="#898989"
            />
          </CustomModal>
        </View>
      </ScrollView>
        <View style={styles.buttonContainerSave}>
              <TouchableOpacity disabled={isDisable} style={[styles.buttonSave,{backgroundColor:isDisable?'#D7D7D7':'#00C879'}]} onPress={saveData}>
                <Text style={styles.buttonTextSave}>Save</Text>
              </TouchableOpacity>
            </View></>
          :  <View style={{display:"flex",minHeight:"80%",alignItems:"center",justifyContent:"center"}}>
        <ActivityIndicator size="large" color="#0000ff" />
        </View>
    }
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",    
    paddingVertical: 20,
  },
  scrollview: {
    width: "100%",
    padding: 20,
    backgroundColor: "#fff",
    marginBottom:50
  },
  inputContainer: {
    width: "100%",
    flexDirection: "column",
    display: "flex",
    gap: 10,
    marginBottom: 20,
  },
  buttonContainer: {
    width: "100%",
  },
  message: {
    color: "#000",
    fontSize: 30,
    fontWeight: "700",
    marginBottom: 20,
  },
  button: {
    borderColor: "#0061FF",
    padding: 15,
    borderRadius: 5,
    borderWidth: 2,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#0061FF",
    fontWeight: "bold",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    display: "flex",
    gap: 5,
    alignItems: "center",
  },
  modalButton: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
    paddingHorizontal: 50,
    marginTop: 20,
    alignItems: "center",
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  card: {
    padding: 10,
    backgroundColor: "#fff",
    width: "100%",
    borderRadius: 20,
    display: "flex",
    flexDirection: "column",
    shadowColor: "rgba(0,0,0,0.3)",
    shadowOpacity: 1,
    shadowRadius: 1,
    elevation: 100,
  },
  valueHead: {
    color: "#000",
    fontSize: 20,
    fontWeight: "700",
  },
  valueSub: {
    color: "#5B5B5B",
    fontSize: 20,
    fontWeight: "700",
  },
  valueDate: {
    color: "#000",
    fontSize: 15,
    fontWeight: "700",
  },
  label: {
    fontWeight: "bold",
    marginBottom: 4,
    fontSize: 14,
    color: "#737373",
  },
  exContainer: {
    marginBottom: 10,
  },
  skillSetContainer: {
    flexWrap: "wrap",
    marginBottom: 16,
    display:"flex",
    flexDirection: "row",
  },
  skill: {
    paddingRight:40,
    borderColor:"red",
    borderWidth:1,
    display:"flex",
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"center",
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginRight: 8,
    marginBottom: 8,
    borderRadius: 50,
  },
  skillText:{
    color:"red",
  },
  buttonContainerSave:{
    position:"absolute",
    bottom:0,
    width:"100%",
    marginHorizontal:20,
  },
  buttonSave:{
    // backgroundColor:"#66B06C",
    padding:20,
  },
  buttonTextSave:{
    textAlign:"center",
    color:"#fff",
    fontWeight:"700",
    fontSize:16

  },
  removeIconCon:{
    position:"absolute",
    right:-1,
    zIndex:1,
  },
  removeIcon:{
    width:30,
    height:30,
  },
  backIconCon:{
    backgroundColor:"#5606FF",
    padding:15,
    
    position:"absolute",
    zIndex:1,
    borderRadius:100,
    left:20,
    top:20,
  },
  backIcon:{
    width:22,
    height:23,
    transform:"rotate(180deg)",
  }
});

export default ProfileEditPanel;
