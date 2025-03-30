import React from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Text, Defs, LinearGradient, Stop } from "react-native-svg";

type GradientTextProps = {
    text: string;
    fontSize?: string;
    offset0?: string;
    offset100?: string;
}
const GradientText = (props:GradientTextProps) => {
    return (
        <View style={styles.container}>
            <Svg height="50" width="150">
                <Defs>
                    <LinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <Stop offset="0%" stopColor={props?.offset0 ?? "#FB8811"} stopOpacity="1" />
                        <Stop offset="100%" stopColor={props.offset100 ?? "#FD067E"} stopOpacity="1" />
                    </LinearGradient>
                </Defs>

                <Text
                    x="50%"
                    y="50%"
                    fontSize= {props?.fontSize ?? 20}
                    fontWeight="bold"
                    textAnchor="middle"
                    fill="url(#grad)"
                >
                    {props.text}%
                </Text>
            </Svg>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
    },
});

export default GradientText;
