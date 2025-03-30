import {Text, View} from "react-native";
import {ColorsBricks} from "@/constants/ColorsBricks";

const Brick = ({ body, hitCount, showHitCount = false }: {body:any,hitCount:number,showHitCount:boolean}) => {
    const { position, bounds } = body;
    const width = bounds.max.x - bounds.min.x;
    const height = bounds.max.y - bounds.min.y;
    const colorIndex = Math.min(hitCount, ColorsBricks.length - 1);
    const brickColor = ColorsBricks[colorIndex];
    return (
        <View
            style={{
                position: "absolute",
                left: position.x,
                top: position.y - height / 2,
                width,
                height,
                backgroundColor: hitCount > 0 ? `#${brickColor.backgroundColor}` : "transparent",
                borderWidth: 2,
                borderColor: hitCount > 0 ? `#${brickColor.borderBrick}` : "transparent",
                borderRadius: 4,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            {
                showHitCount && (
                    hitCount > 0 && (
                        <Text style={{ color: "white", textAlign: "center", fontWeight: "bold" }}>
                            {hitCount}
                        </Text>
                    )
                )
            }
            {/*{hitCount > 0 && (*/}
            {/*    <Text style={{ color: "white", textAlign: "center", fontWeight: "bold" }}>*/}
            {/*        {hitCount}*/}
            {/*    </Text>*/}
            {/*)}*/}
        </View>
    );
};

const BrickListRenderer = ({ list }: {list:any}) => {
    return list.map((brick: any, index: number) => (
        <Brick key={index} body={brick.body} hitCount={brick.hitCount} showHitCount={brick.showHitCount} />
    ));
};

export default BrickListRenderer;