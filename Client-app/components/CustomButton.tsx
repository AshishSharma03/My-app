// CustomButton.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, GestureResponderEvent, ViewStyle, TextStyle, Image,ImageSourcePropType } from 'react-native';  

interface CustomButtonProps {
    title: string;
    onPress: (event: GestureResponderEvent) => void;
    buttonStyle?: ViewStyle;
    textStyle?: TextStyle;
    verify : boolean,
    source : ImageSourcePropType,
    sourceFalse : boolean,
    disabled : boolean
}

const CustomButton: React.FC<CustomButtonProps> = ({ title, onPress, buttonStyle, textStyle,verify ,source,sourceFalse,disabled}) => {
    return (
        <TouchableOpacity disabled={disabled} style={[styles.button, buttonStyle, {backgroundColor:verify? disabled?'#D7D7D7':'#00C879':disabled?'#D7D7D7':'#5606FF',}]} onPress={onPress}>
            <Text style={[styles.buttonText, textStyle,{color:disabled?"#979797":"#fff"}]}>{title}</Text>
            {
                !sourceFalse?disabled?'' :
                <Image  source={source}  style={styles.icon}/>
                :""
            }
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        display:"flex",
        flexDirection:"row",
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight:"600",
        
    },
    icon:{
        position:"absolute",
        right:10,
        width:21,
        height:25,
    }
});

export default CustomButton

