import {View} from "react-native";

const BallCircle = (props) => {
    const { body, color } = props;

    return (
        <View
            style={{
                position: "absolute",
                width: 20,
                height: 20,
                backgroundColor: color || "red",
                borderRadius: 10,
                left: body.position.x - 10,
                top: body.position.y - 10,

            }}
        />
    );
};

export default BallCircle;