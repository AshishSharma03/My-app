// CustomTextInput.tsx
import React, {useState } from 'react';
import { View, TextInput, StyleSheet, TextInputProps, TextStyle, KeyboardTypeOptions } from 'react-native';

interface CustomTextInputProps extends TextInputProps {
    frontComponent?:React.ReactNode,
    BackComponent?:React.ReactNode,
    placeholder: string;
    placeholderTextColor?: string;
    placeholderFontWeight?: TextStyle['fontWeight'];
}

const CustomTextInput: React.FC<CustomTextInputProps> = ({
    secureTextEntry,
    placeholder,
    placeholderTextColor,
    placeholderFontWeight,
    frontComponent,
    BackComponent,
    ...props
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [value, setValue] = useState('');

    return (
        <View style={styles.container}>
            {frontComponent}
            <TextInput
                style={styles.input}
                {...props}
                
                placeholder={placeholder}
                placeholderTextColor={placeholderTextColor}
                
                secureTextEntry={secureTextEntry}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                />
                {BackComponent}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        display:"flex",
        flexDirection:"row",
        width:"100%",
        backgroundColor: '#EDEDED',
        borderRadius: 10,
    },
    input:{
        paddingHorizontal:20,
        fontSize: 18,
        fontWeight: '600',
        color: '#000', 
        flex:1
    },
   
});

export default CustomTextInput;
