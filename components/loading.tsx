import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet, Text } from "react-native";
import GradientText from "@/components/GradientText";

type loadingProps = {
    size?: number;
    valueLoading?: string;
}
const LoadingWave = (props:loadingProps) => {
    const dots = Array(5).fill(null); // Tạo 5 dấu chấm
    const animations = useRef(dots.map(() => new Animated.Value(0))).current; // Lấy giá trị hiện tại của dot
    const dotsColors = ["#FB8811","#FC7023","#FD4843","#FD2A5D","#FD0B78"];

    const styles = StyleSheet.create({
        container: {
            alignItems: "center",
            marginTop: 20,
        },
        dotContainer: {
            flexDirection: "row",
        },
        dot: {
            width: props?.size ?? 10,
            height: props?.size ?? 10,
            borderRadius: 5,
            marginHorizontal: 5,
        },
    });

    useEffect(() => {

        // Tạo 1 stack animation cho dots array, mỗi dot sẽ có 2 animation trong frame time 400ms
        const animationsSequence = dots.map((_, index) =>
            Animated.sequence([
                Animated.timing(animations[index], {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                }),
                Animated.timing(animations[index], {
                    toValue: 0,
                    duration: 400,
                    useNativeDriver: true,
                }),
            ])
        );

        // Tạo hiệu ứng lượn sóng với stagger và mỗi hiệu ứng cách nhau 100ms
       Animated.loop(Animated.stagger(100, animationsSequence)).start();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.dotContainer}>
                {dots.map((_, index) => (
                    <Animated.View
                        key={index}
                        style={[
                            styles.dot,
                            {
                                backgroundColor: dotsColors[index],
                                opacity: animations[index].interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0.3, 1],
                                }),
                                transform: [
                                    {
                                        translateY: animations[index].interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [0, -5],
                                        }),
                                    },
                                ],
                            },
                        ]}
                    />
                ))}
            </View>
            <Text>
                <GradientText text={props?.valueLoading ?? "" } fontSize={"14"} />
            </Text>
        </View>
    );
};



export default LoadingWave;
