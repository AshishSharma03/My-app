import React from 'react'
import { Text, View, TouchableOpacity } from 'react-native'

interface TextLink {
    message: string;
    link:string;
    color:string;
    fontSize: number;
    onPress: () => void; 
  }

const TextLink:React.FC<TextLink>=({message,link,onPress,fontSize,color="blue"}) => {
  return (
    
      <View style={{display:"flex",flexDirection:"row",gap:3,margin:12,alignItems:"center",justifyContent:"center"}}>
                <Text style={{color:"#000",fontWeight:"600",fontSize:fontSize}}>{message}</Text><TouchableOpacity onPress={() => onPress()}>
                    <Text style={{color:color,fontWeight:"600",fontSize:fontSize}}>{link}</Text>
                    </TouchableOpacity>
     </View>
    
  )
}

export default TextLink