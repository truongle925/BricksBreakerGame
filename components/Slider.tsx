import React, { useState, useEffect } from "react";
import { View } from "react-native";
import Slider from "@react-native-community/slider";

const CustomSlider = ({ width, initialValue, onChange }) => {
    const [sliderValue, setSliderValue] = useState(initialValue);

    useEffect(() => {
        setSliderValue(initialValue);
    }, [initialValue]);

    const handleSliderChange = (value) => {
        setSliderValue(value);
        if (onChange) {
            onChange(value);
        }
    };

    return (
        <View style={{ padding: 20, alignItems: "center",borderTopWidth:1,borderTopColor:'white' }}>
            <Slider
                style={{ width: "60%",backgroundColor:'#FFA500',height: 6,borderRadius:6 }}
                minimumValue={20}
                maximumValue={width - 20 }
                value={sliderValue}
                onValueChange={handleSliderChange}
                minimumTrackTintColor="#FFA500"
                maximumTrackTintColor="#FFA500"
                thumbTintColor="white"
            />
        </View>
    );
};

export default CustomSlider;
