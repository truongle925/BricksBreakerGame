import {Dimensions, PanResponder, View, StyleSheet, Text, BackHandler,Image} from "react-native";
import React, {useCallback, useEffect, useRef, useState} from "react";
import { GameEngine } from "react-native-game-engine";
import Matter from "matter-js";
import {setUpWorld} from "@/setup_system/SetUpWorld";
import {createWalls} from "@/setup_system/CreateWallFrame";
import BallCircle from "@/components/BallCircle";
import createPhysics from "@/setup_system/Physic";
import Frame from "@/components/Frame";
import {createListBalls} from "@/setup_system/CreateBall";
import {calculateTrajectory} from "@/setup_system/CalculateTrajectory";
import createBricks from "@/setup_system/CreateBrick";
import BrickListRenderer from "@/components/Brick";
import {levels} from "@/constants/LevelMode_1";
import {useCollisionHandler} from "@/setup_system/HandleCollision";
import checkGameOver_GameMode1 from "@/utils/CheckGameOver";
import HeaderBar from "@/components/HeaderBar";
import {distanceHeaderAndFooter} from "@/constants/DistanceHeaderAndFooter";
import CustomSlider from "@/components/Slider";
import CustomModal from "@/components/Modal";
import {useRouter} from "expo-router";
import {resetListBricks} from "@/utils/ResetListBricks";
import LevelFrame from "@/components/LevelFrame";
import {ChangingLevel, changingLevel} from "@/components/ChangingLevel";
import {GameOver} from "@/components/GameOver";

const distanceHeaderFooter = distanceHeaderAndFooter
const width  = Dimensions.get("window").width;
const height = Dimensions.get("window").height - (distanceHeaderFooter.header + distanceHeaderFooter.footer);

//#region Hàm lấy vị trí bóng đầu tiên chạm đáy
// useEffect(() => {
//     const updateBallPosition = () => {
//        // console.log("câccacaca",stateMoveBallRef.current)
//        if (!stateMoveBallRef.current) return;
//         if (ballsRef.current.length > 0) {
//            // const ball = ballsRef.current[0]; // Lấy quả bóng đầu tiên
//             for(const ball of ballsRef.current) {
//                 if(ball.position.y >= height - 40){
//                     setStartPosition(ball.position);
//                     stateMoveBallRef.current = false
//                   console.log("Bóng chạm đáy!", ball.position);
//                     break;
//                 }
//
//             }
//         }
//     };
//
//     Matter.Events.on(engine, "beforeUpdate", updateBallPosition);
//
//     return () => {
//         Matter.Events.off(engine, "beforeUpdate", updateBallPosition);
//     };
// }, [currentLevel]);
//#endregion

//#region Hàm tăng position y của hàng gạch
// useEffect(() => {
//
//     const collisionHandler = (event) => {
//         if (!stateMoveBallRef.current) return;
//         //console.log("gọi va chạm");
//         for (const pair of event.pairs) {
//             const { bodyA, bodyB } = pair;
//             //console.log(bodyA, bodyB);
//             if (bodyA === wallBottom || bodyB === wallBottom) {
//                 const ball = bodyA === wallBottom ? bodyB : bodyA;
//                 console.log("Bóng đầu tiên chạm đáy:", ball.position.x);
//                 Matter.Body.setVelocity(ball, { x: 0, y: 0 });
//                 // Matter.Body.setStatic(ball, true);
//                 setStartPosition(ball.position);
//                 stateMoveBallRef.current = false
//
//                 break;
//             }
//         }
//     };
//
//     Matter.Events.on(engine, "collisionStart", collisionHandler);
//
//     return () => {
//         Matter.Events.off(engine, "collisionStart", collisionHandler);
//     };
// },[currentLevel]);
//#endregion

const mode_1 = () => {

    //#region State
    const [gameEngine, setGameEngine] = useState<GameEngine | null>(null); // Biến lưu engine trong trò chơi
    const [entities, setEntities] = useState({}); // Biến lưu thực thể
    const [brickObj,setBrickObj] = useState({}); // Biến lưu thực thể
    const [ballObject, setBallObject] = useState({}); // Biến lưu thực thể
    const [wallObject, setWallObject] = useState({}); // Biến lưu thực thể
    const [startPosition, setStartPosition] = useState<any>(0); // Biến vị trí bóng khi spawn
    const [trajectory, setTrajectory] = useState<{ x: number; y: number }[]>([]); // Biến vẽ quỹ đạo bóng
    const [currentLevel, setCurrentLevel] = useState(0); // Biến set level
    const [engineKey, setEngineKey] = useState(0); // Biến khởi tạo phục vụ việc re-render
    const [stateGameOver, setStateGameOver] = useState<boolean>(false); // Biến check over game
    const [pauseGame,setPauseGame] = useState<boolean>(false); // Biến pause game
    const [restartGame,setRestartGame] = useState<boolean>(false); // Biến check restart game
    const [quitGame,setQuitGame] = useState<boolean>(false); // Biến show model quit game
    const [score, setScore] = useState(0); // Hiển thị điểm
    const [numBalls,setNumBalls] = useState(5); // Số lượng bóng mỗi level
    const [countBalls,setCountBalls] = useState(0); // Biến đếm hiển thị bóng trên UI
    //#endregion

    //#region useRef Variable
    const startPos = useRef<{ x: number; y: number } | null>(null); // Vị trí khi người dùng bắt đầu chạm màn hình
    const ballsRef = useRef<Matter.Body[]>([]); // Lấy object Ball
    const bricksRef = useRef<{ body: Matter.Body; hitCount: number; showHitCount:boolean }[]>([]); // Lấy objject bricks
    const stateMoveBallRef = useRef(false); // Tạo ref để theo dõi state
    const ballCountRef = useRef(0); // Biến đếm bóng chạm đáy
    const oldLevelRef = useRef<number>(0); // Biến chứa level previous
    //#endregion

    //#region set up variable
    const {engine, world} = setUpWorld(); // Khởi taoj world nơi chứa các thực thể trong trò chơi
    const delayBetweenBalls = 100; // Độ trễ giữa mỗi quả bóng (ms)
    const {wallTop,wallRight,wallLeft,wallBottom} = createWalls(world,width,height); // Khởi tạo wall frame trò chơi
    const ballColors = ["red", "green", "yellow", "purple", "orange", "white"]; // Danh sách màu cho bóng
    //#endregion

    //#region Hook
    const { handleCollisionBrick } = useCollisionHandler(); // Hook custom handle logic va chạm với gạch
    const router = useRouter();
    //#endregion

    //#region Cập nhật key engine
    useEffect(() => {
        setEngineKey(prev => prev + 1); // Cập nhật key để ép `GameEngine` render lại

    }, [entities]);
    //#endregion

    //#region Khởi tạo thực thể cho trò chơi
    useEffect(() => {
        stateMoveBallRef.current = false
        ballCountRef.current = 0
        setCountBalls(numBalls)
        console.log(numBalls,'renderrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr')

        // Kiểm tra trạng thái của state restart game
        if(restartGame){
            handleRestartGame()
        }

        // Kiểm tra xem world có tồn tại không trước khi tạo bóng
        if (!world) return;

        // Gọi hàm làm mới list brick
        resetListBricks(bricksRef,world);

        ballsRef.current.forEach(ball => {
            Matter.World.remove(world, ball);
        })
        ballsRef.current = []

        if (levels[currentLevel]) {
            bricksRef.current = createBricks(levels[currentLevel], world);
            for(const index in bricksRef.current) {
                bricksRef.current[index].showHitCount = true;
            }
        }

        // Tạo danh sách bóng
        ballsRef.current = createListBalls(numBalls,world,width,height);
        const posBall = {
            x: ballsRef.current[0].position.x,
            y:ballsRef.current[0].position.y,
        }
        setStartPosition(posBall);


        setEntities({
            physics: { engine, world },
        });

        setWallObject({
            wallTop: { body: wallTop, renderer: Frame },
            wallBottom: { body: wallBottom, renderer: Frame },
            wallLeft: { body: wallLeft, renderer: Frame },
            wallRight: { body: wallRight, renderer: Frame },
        });

        setBrickObj({
            bricks: { list: bricksRef.current, renderer: BrickListRenderer },
        })

        setBallObject({
            ...((ballsRef.current && ballsRef.current.length > 0) ?
                ballsRef.current.reduce<Record<string, any>>((acc, ball, index) => {
                    if (ball) {
                        acc[`ball_${index}`] = { body: ball, renderer: BallCircle,color: ballColors[index] || "gray", };
                    }
                    return acc;
                }, {}) : {}),
        })
    }, [currentLevel,restartGame,stateGameOver,numBalls]);
    //#endregion

    //#region Xử lý va chạm giữa bóng và gạch
    useEffect(() => {
        Matter.Events.on(engine, "collisionStart", (event) =>
            handleCollisionBrick(event, bricksRef, world, setBrickObj,setCurrentLevel,levels,setScore)
           // handleCollisionBrick(event)
        );
       // console.log(bricksRef.current.length,"danh sach hien tai");
        return () => {
            Matter.Events.off(engine, "collisionStart", (event) =>
                handleCollisionBrick(event, bricksRef, world, setBrickObj,setCurrentLevel,levels,setScore)
               // handleCollisionBrick(event)
            );
        };

    },[currentLevel,restartGame,stateGameOver,numBalls] );
    //#endregion

    //#region Xử lý set position của gạch sau 1 turn và check game over
    useEffect(() => {

        const collisionHandler = (event) => {
            if (!stateMoveBallRef.current) return;

            for (const pair of event.pairs) {
                const { bodyA, bodyB } = pair;

                if (bodyA === wallBottom || bodyB === wallBottom) {
                    // Đếm số lượng bóng đã chạm đáy
                    ballCountRef.current += 1;
                    setCountBalls(ballCountRef.current);
                    //console.log("collisionHandlerrrrrrrrrrrrrrrrrrrrrrrr",ballCountRef.current);
                    if (ballCountRef.current >= ballsRef.current.length) {
                        //console.log("Tất cả bóng đã chạm đáy. Đẩy viên gạch xuống!");

                        // Đẩy tất cả viên gạch xuống một hàng
                        bricksRef.current.forEach(brick => {
                            Matter.Body.setPosition(brick.body, {
                                x: brick.body.position.x,
                                y: brick.body.position.y + 20
                            });
                        });

                        // Kiểm tra thua cuộc
                        if (checkGameOver_GameMode1(bricksRef,height)) {
                            // console.log("Trò chơi kết thúc!");
                            setStateGameOver(true);
                            return;
                        }

                        // Reset lại biến đếm
                        ballCountRef.current = 0;
                        stateMoveBallRef.current = false;
                        console.log("collisionHandlerrrrrrrrrrrrrrrrrrrrrrrr",ballCountRef.current);
                    }

                }
            }
        };

        Matter.Events.on(engine, "collisionStart", collisionHandler);

        return () => {
            Matter.Events.off(engine, "collisionStart", collisionHandler);
        };
    },[currentLevel,restartGame,stateGameOver,numBalls]);
    //#endregion

    const [showChangingLevel, setShowChangingLevel] = useState(true);
    useEffect(() => {
        if(oldLevelRef.current < currentLevel){
            setNumBalls(prev => prev + 2);
        }
        else if(oldLevelRef.current >= levels.length - 1 ){
            oldLevelRef.current = 0
            setNumBalls(2)
        }
        oldLevelRef.current = currentLevel;
        setShowChangingLevel(true); // Hiển thị khi level thay đổi
        const timer = setTimeout(() => setShowChangingLevel(false), 2000);
        return () => clearTimeout(timer); // Xóa timer khi component unmount
    }, [currentLevel]);


    //#region Xử lý kéo thả
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderGrant: (_, gesture) => {
                startPos.current = { x: gesture.x0, y: gesture.y0 - distanceHeaderFooter.footer}; // Lấy tọa độ khi chạm vào màn hình
            },
            onPanResponderMove: (_, gesture) => {
                //stateMoveBallRef.current = true
                if (startPos.current) {
                    const dx = gesture.moveX - startPos.current.x;
                    const dy = gesture.moveY - startPos.current.y;

                    const trajectory: {x: number,y: number}[] = calculateTrajectory(ballsRef.current[0].position, { x: -dx * 0.1, y: -dy * 0.1 },width);
                    setTrajectory(trajectory);
                }
            },
            onPanResponderRelease: (_, gesture) => {
                stateMoveBallRef.current = true
                if (startPos.current) {
                    // Tính khoảng cách từ điểm chạm màn hình đến điểm kết thúc
                    const dx = gesture.moveX - startPos.current.x;
                    const dy = gesture.moveY - startPos.current.y;

                    const velocityFactor = 0.18;

                    ballsRef.current.forEach((ball, index) => {

                        setTimeout(() => {
                            setCountBalls(prev => prev - 1);
                            Matter.Body.setVelocity(ball, {
                                //-dx * velocityFactor
                                x: -dx * velocityFactor ,
                                y: -dy * velocityFactor
                            });
                        }, index * delayBetweenBalls);
                    });
                }
                setTrajectory([]);
            },
        })
    ).current;
    //#endregion

    //#region RestartGame
    const handleRestartGame = () => {
            setRestartGame(false);
            setStateGameOver(false);
            setCurrentLevel(0);
            setScore(0);
            setCountBalls(0);
            console.log("restartGame",stateGameOver);
    }
    //#endregion

    //#region Hàm thay đổi vị trí bóng bằng slider
    const handleSliderChange = (value) => {
        setStartPosition((prev) => ({ ...prev, x: value })); // Chỉ cập nhật giá trị x

        if (ballsRef.current.length > 0) {
            Matter.Body.setPosition(ballsRef.current[0], { x: value, y: ballsRef.current[0].position.y });
        }
    };
    //#endregion

    //#region Hafm xử lý button pause
    // const onClickPause = () => {
    //     setPauseGame(true)
    // }
    //#endregion

    //#region Hàm xuwr lý button main menu
    const handleMainMenu = () => {
        router.back("/")
    }
    //#endregion

    //#region Hàm thoát ứng dụng
    const handleQuit = () => {
        setQuitGame(false);
        BackHandler.exitApp();
    }
    //#endregion

    //#region Hàm xử lý các sự kiện của button
    // const handleButtonPress = (buttonKey) => {
    //     console.log(buttonKey);
    //     setAction(buttonKey);
    // };
    //
    // useEffect(() => {
    //     console.log('uEffect')
    //     const temp = action
    //     switch (temp) {
    //         case "btnResume":
    //             setPauseGame(false);
    //             break;
    //         case "btnRestart":
    //             setRestartGame(true);
    //             break;
    //         case "btnMainMenu":
    //             handleMainMenu();
    //             break;
    //         case "btnQuit":
    //             //console.log('aaa')
    //             setQuitGame(true);
    //             setPauseGame(false);
    //             break;
    //         case "btnExit":
    //             handleQuit();
    //             break;
    //         case "btnCancel":
    //             //console.log('aaa')
    //             setQuitGame(false);
    //             break;
    //         default:
    //             break;
    //     }
    // }, [action]);
    const handleButtonPress = (buttonKey) => {
        console.log(buttonKey);

        switch (buttonKey) {
            case "btnResume":
                setPauseGame(false);
                break;
            case "btnRestart":
                setRestartGame(true);
                break;
            case "btnMainMenu":
                handleMainMenu();
                break;
            case "btnQuit":
                setQuitGame(true);
                setPauseGame(false);
                break;
            case "btnExit":
                handleQuit();
                break;
            case "btnCancel":
                setQuitGame(false);
                break;
            case "btnPause":
                setPauseGame(true);
                break;
            default:
                break;
        }
    };
    //#endregion


    return (
        <View style={styles.container}>
            <HeaderBar Level={currentLevel} onButtonPress={handleButtonPress} Score={score} Ball={countBalls}/>
            <View style={[{height:height}]}  {...panResponder.panHandlers}>
                {Object.keys(entities).length > 0 && (
                    <GameEngine key={engineKey}
                                ref={(ref: GameEngine | null) => setGameEngine(ref)}
                                systems={[createPhysics(width, height,startPosition,1
                                )]}
                                entities={{...entities,...brickObj, ...ballObject,...wallObject}}
                    />
                )}

                {trajectory.map((point, index) => (
                    <View key={index} style={{
                        position: "absolute",
                        width: 5,
                        height: 5,
                        borderRadius: 2.5,
                        backgroundColor: "white",
                        left: point.x,
                        top: point.y - distanceHeaderFooter.footer
                    }} />
                ))}
            </View>

            <CustomSlider width={width} initialValue={startPosition.x} onChange={handleSliderChange} />

            {(pauseGame) && <CustomModal onButtonPress={handleButtonPress} title={"Game Pause"} type={1}/>}
            {(quitGame) && <CustomModal onButtonPress={handleButtonPress} title={"Quit game ?"} type={2} widthModal={'60%'}/>}

            {showChangingLevel && <ChangingLevel text={currentLevel}/>}

            {stateGameOver && <GameOver onButtonPress={handleButtonPress}/>}


        </View>


    );
};



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
    },
});

export default mode_1;