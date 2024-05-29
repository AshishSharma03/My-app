import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';

interface Country {
  label: string;
  value: string;
}

interface PhoneNumberDropdownProps {
  onSelectCountry: (country: Country) => void;
}

const PhoneNumberDropdown: React.FC<PhoneNumberDropdownProps> = ({onSelectCountry }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  
  const countryCodes: Country[] = [
    { label: '+1 (US)', value: '+1' },
    { label: '+44 (UK)', value: '44' },
    { label: '+91 (India)', value: '91' },
   
  ];
  
  const handleSelectCountry = (country: Country) => {
    setSelectedCountry(country);
    onSelectCountry(country); 
    setModalVisible(false);
  };
  
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.dropdownButton}>
        <Text style={styles.dropdownText}>{selectedCountry ? selectedCountry.label : countryCodes[2].label}</Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {countryCodes.map((country, index) => (
              <TouchableOpacity
                key={index}
                style={styles.countryItem}
                onPress={() => handleSelectCountry(country)}
              >
                <Text style={styles.clabel}>{country.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropdownButton: {
    padding: 15,
    borderColor: "#EDEDED",
    borderWidth: 3,
    borderRadius: 10,
    backgroundColor: '#fff',
   
  },
  dropdownText: {
    fontSize: 16,
    color: "#000",
    fontWeight:"700",
  
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor:"#fff",
    paddingVertical: 10,
  },
  countryItem: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  clabel:{
    color:"#000",
    fontSize:20,
    fontWeight:"700"
  }
});


export default PhoneNumberDropdown;