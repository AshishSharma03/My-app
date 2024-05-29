import React, { useRef } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

interface OTPInputProps {
  length: number;
  onChange: (otp: string) => void;
  verify :string
}

const OTPInput: React.FC<OTPInputProps> = ({ length = 6, onChange,verify = "notverified" }) => {
  const inputs = useRef<Array<TextInput | null>>([]);
  const [otp, setOtp] = React.useState(Array(length).fill(''));

  const handleChangeText = (text: string, index: number) => {
    if (text.length > 1) {
      return;
    }
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    onChange(newOtp.join(''));

    if (text && index < length - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && index > 0 && !otp[index]) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.container}>
      {otp.map((value, index) => (
        <TextInput
          key={index}
          value={value}
          onChangeText={(text) => handleChangeText(text, index)}
          onKeyPress={(e) => handleKeyPress(e, index)}
          style={[styles.input,{borderColor:verify === "notverified"? "#D7D7D7" :verify === "done"?"green":"red"}]}
          keyboardType="numeric"
          maxLength={1}
          ref={(input) => (inputs.current[index] = input)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  input: {
    width: 45,
    height: 45,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 18,
    color: '#000',
    backgroundColor: '#F6F7FB',
    marginRight: 5,
  },
});

export default OTPInput;
