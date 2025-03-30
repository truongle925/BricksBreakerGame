import {Text, View, StyleSheet} from "react-native";
import Svg, {Circle, Defs, LinearGradient, Stop} from "react-native-svg";

const LevelFrame = (props) => {
    const {level} = props;
    return (
        <View style={{ justifyContent: "center", alignItems: "center", flex: 1, backgroundColor: "black" }}>
            <Svg height="60" width="60" >
                {/* Tạo gradient cho hình tròn */}
                <Defs>
                    <LinearGradient id="goldGradient" x1="0" y1="0" x2="1" y2="1">
                        <Stop offset="0%" stopColor="#FFD700" stopOpacity="1" />
                        <Stop offset="50%" stopColor="#FFA500" stopOpacity="1" />
                        <Stop offset="100%" stopColor="#FF8C00" stopOpacity="1" />
                    </LinearGradient>
                </Defs>

                {/* Vẽ hình tròn */}
                <Circle cx="30" cy="30" r="28" fill="url(#goldGradient)" stroke="#FFB11F" strokeWidth="3" />
                {/* Ánh sáng góc trên bên trái */}
                <Circle cx="12" cy="12" r="4" fill="yellow" opacity="0.8" />
            </Svg>
            <View style={styles.textContainer}>
                <Text style={styles.text}>{level}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({

    textContainer: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
        fontSize: 25,
        fontWeight: "bold",
        color: "white",
    },
})
export default LevelFrame;