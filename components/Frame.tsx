import {View} from "react-native";

const Frame = ({ body }) => {
    const { position, bounds } = body;
    const width = bounds.max.x - bounds.min.x;
    const height = bounds.max.y - bounds.min.y;

    return (
        <View
            style={{
                position: "absolute",
                left: position.x - width / 2,
                top: position.y - height / 2,
                width: width,
                height: height,
                backgroundColor: "000B22",
            }}
        />
    );
};

export default Frame;