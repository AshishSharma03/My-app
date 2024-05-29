// IconButton.tsx
import React from "react";
import { TouchableOpacity, Image, StyleSheet, ImageSourcePropType } from "react-native";

interface IconButtonProps {
    onPress: () => void;
    source: ImageSourcePropType;
    Icon_container: any;
    icon_img: any; 

}

const IconButton: React.FC<IconButtonProps> = ({ onPress, source, Icon_container,icon_img }) => {
    return (
        <TouchableOpacity style={Icon_container} onPress={onPress}>
            <Image source={source} style={icon_img} />
        </TouchableOpacity>
    );
};

export default IconButton;
