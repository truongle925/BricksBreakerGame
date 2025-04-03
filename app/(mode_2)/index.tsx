import {Dimensions, PanResponder, View, StyleSheet, BackHandler} from "react-native";
import React, {useCallback, useEffect, useRef, useState} from "react";
import { GameEngine } from "react-native-game-engine";
import Matter from "matter-js";
import {setUpWorld} from "@/setup_system/SetUpWorld";
import {createWalls} from "@/setup_system/CreateWallFrame";
import BallCircle from "@/components/BallCircle";
import createPhysics from "@/setup_system/Physic";
import Frame from "@/components/Frame";
import {createListBalls} from "@/setup_system/CreateBall";
import createBricks from "@/setup_system/CreateBrick";
import BrickListRenderer from "@/components/Brick";
import {levels} from "@/constants/LevelMode_2";
import {useCollisionHandler} from "@/setup_system/HandleCollision";
import HeaderBar from "@/components/HeaderBar";
import {distanceHeaderAndFooter} from "@/constants/DistanceHeaderAndFooter";
import CustomModal from "@/components/Modal";
import {useRouter} from "expo-router";
import {resetListBricks} from "@/utils/ResetListBricks";
import {ChangingLevel} from "@/components/ChangingLevel";
import {GameOver} from "@/components/GameOver";
import CreatePaddle from "@/setup_system/CreatePaddle";
import Paddle from "@/components/Paddle";
import {playSound} from "@/utils/PlaySound";
import {Sound_Ball_Tap, Sound_Level_Completed, Sound_Level_Failed} from "@/constants/Sound";
import {saveHighScore} from "@/utils/SaveHighScore";
import {useSound} from "@/hooks/SoundContext";

const distanceHeaderFooter = distanceHeaderAndFooter
const width  = Dimensions.get("window").width;
const height = Dimensions.get("window").height - (distanceHeaderFooter.header + distanceHeaderFooter.footer);


const mode_2 = () => {

    //#region State
    const [gameEngine, setGameEngine] = useState<GameEngine | null>(null); // Biến lưu engine trong trò chơi
    const [entities, setEntities] = useState({}); // Biến lưu thực thể
    const [brickObj,setBrickObj] = useState({}); // Biến lưu thực thể
    const [ballObject, setBallObject] = useState({}); // Biến lưu thực thể
    const [wallObject, setWallObject] = useState({}); // Biến lưu thực thể
    const [startPosition, setStartPosition] = useState<any>(0); // Biến vị trí bóng khi spawn
    const [currentLevel, setCurrentLevel] = useState(0); // Biến set level
    const [engineKey, setEngineKey] = useState(0); // Biến khởi tạo phục vụ việc re-render
    const [stateGameOver, setStateGameOver] = useState<boolean>(false); // Biến check over game
    const [pauseGame,setPauseGame] = useState<boolean>(false); // Biến pause game
    const [restartGame,setRestartGame] = useState<boolean>(false); // Biến check restart game
    const [quitGame,setQuitGame] = useState<boolean>(false); // Biến show model quit game
    const [score, setScore] = useState(0); // Hiển thị điểm
    const [numBalls,setNumBalls] = useState(2); // Số lượng bóng mỗi level
    const [countBalls,setCountBalls] = useState(0); // Biến đếm hiển thị bóng trên UI
    const [paddleObject, setPaddleObject] = useState({});
    const [showChangingLevel, setShowChangingLevel] = useState(true);
    //#endregion

    //#region useRef Variable
    const startPos = useRef<{ x: number; y: number } | null>(null); // Vị trí khi người dùng bắt đầu chạm màn hình
    const ballsRef = useRef<Matter.Body[]>([]); // Lấy object Ball
    const bricksRef = useRef<{ body: Matter.Body; hitCount: number; showHitCount:boolean}[]>([]); // Lấy objject bricks
    const isFirstMove = useRef(true); // Biến kiểm tra trạng thái chuyển động của bóng
    const ballCountRef = useRef(0); // Biến đếm bóng chạm đáy
    const paddleRef = useRef<Matter.Body>(); // Biến chứa paddle
    const oldLevelRef = useRef<number>(0); // Biến chứa level previous
    //#endregion

    //#region set up variable
    const {engine, world} = setUpWorld(); // Khởi taoj world nơi chứa các thực thể trong trò chơi
    const delayBetweenBalls = 100; // Độ trễ giữa mỗi quả bóng (ms)
    const {wallTop,wallRight,wallLeft,wallBottom} = createWalls(world,width,height + 40); // Khởi tạo wall frame trò chơi
    const ballColors = ["white"]; // Danh sách màu cho bóng
    //#endregion

    //#region Hook
    const { handleCollisionBrick } = useCollisionHandler(); // Hook custom handle logic va chạm với gạch
    const router = useRouter();
    const soundHook = useSound();
    //#endregion

    //#region Cập nhật key engine
    useEffect(() => {
        setEngineKey(prev => prev + 1); // Cập nhật key để ép `GameEngine` render lại

    }, [entities]);
    //#endregion

    //#region Khởi tạo thực thể cho trò chơi
    useEffect(() => {
        //console.log(isFirstMove.current);
        ballCountRef.current = 0
        setCountBalls(numBalls)

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

        if (paddleRef.current) {
            Matter.World.remove(world, paddleRef.current); // Xóa paddle cũ khỏi Matter.js
        }
        const {paddle} = CreatePaddle(world, width, height);
        paddleRef.current = paddle
        //console.log(paddle.position.x, paddle.position.y);
        //console.log(paddle,'paddleeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee');
        if (levels[currentLevel]) {
            bricksRef.current = createBricks(levels[currentLevel], world);
            for(const index in bricksRef.current) {
                bricksRef.current[index].showHitCount = false;
            }
        }

        // Tạo danh sách bóng
        ballsRef.current = createListBalls(numBalls,world,width,height);
        const posBall = {
            x: ballsRef.current[0].position.x,
            y:ballsRef.current[0].position.y,
        }
        setStartPosition(posBall);
        //console.log(posBall)
        //console.log(startPosition);
        //console.log(paddle.position,'padđle');
        setPaddleObject({
            paddle: {body: paddleRef.current, renderer: Paddle },
        })

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
                        acc[`ball_${index}`] = { body: ball, renderer: BallCircle,color: ballColors[0], };
                    }
                    return acc;
                }, {}) : {}),
        })
    }, [currentLevel,restartGame,stateGameOver, numBalls]);
    //#endregion

    //#region Xử lý va chạm giữa bóng và gạch
    useEffect(() => {
        Matter.Events.on(engine, "collisionStart", (event) =>
                handleCollisionBrick(event, bricksRef, world, setBrickObj,setCurrentLevel,levels,setScore)

        );

        return () => {
            Matter.Events.off(engine, "collisionStart", (event) =>
                    handleCollisionBrick(event, bricksRef, world, setBrickObj,setCurrentLevel,levels,setScore)
            );
        };

    },[currentLevel,restartGame,numBalls] );
    //#endregion

    //#region Hàm xử lý chuyển level
    useEffect(() => {
       // console.log(oldLevelRef.current,currentLevel,'levelprevious');
        if(oldLevelRef.current < currentLevel){
            setNumBalls(prev => prev + 2);
        }
        else if(oldLevelRef.current >= levels.length - 1 ){
            oldLevelRef.current = 0
            setNumBalls(2)
            setScore(0)
        }
        oldLevelRef.current = currentLevel;
        isFirstMove.current = true
        setShowChangingLevel(true); // Hiển thị khi level thay đổi
        if(currentLevel != 0){
            playSound(Sound_Level_Completed,soundHook.mute)
        }
        const timer = setTimeout(() => {setShowChangingLevel(false)}, 2000);
        return () => clearTimeout(timer); // Xóa timer khi component unmount
    }, [currentLevel]);
    //#endregion

    //#region Hàm xử lý logic khi bóng chạm paddle
    useEffect(() => {
        if(stateGameOver) {
            handleSaveScore()
        }
        const collisionHandler = (event) => {
            event.pairs.forEach(({ bodyA, bodyB }) => {
                const ball = ballsRef.current.find(b => b.id === bodyA.id || b.id === bodyB.id);
                //console.log('Logic')
                playSound(Sound_Ball_Tap,soundHook.mute)
                if(bricksRef.current.length === 0){
                    setStartPosition(0)
                }
                if (ball && (bodyA === paddleRef.current || bodyB === paddleRef.current )) {
                    handleBallBounce(ball);

                }

                    if (ball && (bodyA === wallBottom || bodyB === wallBottom)) {
                        Matter.World.remove(world, ball);
                        ballCountRef.current += 1;
                        //console.log(ballsRef.current.length,ballCountRef.current)
                        if(bricksRef.current.length !=0 ){
                            if(ballCountRef.current === ballsRef.current.length){
                                playSound(Sound_Level_Failed,soundHook.mute)
                                setStateGameOver(true);
                            }
                    }
                }
            });
        };
        if(showChangingLevel) {
            Matter.Events.on(engine, "collisionStart", collisionHandler);
        }

        return () => {
            Matter.Events.off(engine, "collisionStart",collisionHandler);
        }
    },[currentLevel,restartGame,numBalls]);
    //#endregion

    //#region Xử lý kéo thả
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderGrant: (_, gesture) => {
                startPos.current = { x: gesture.x0, y: gesture.y0 - distanceHeaderFooter.footer}; // Lấy tọa độ khi chạm vào màn hình
            },
            onPanResponderMove: (_, gesture) => {

                const newX = Math.min(Math.max(gesture.moveX, 100 / 2), width - 100 / 2);
                //console.log(newX)
                Matter.Body.setPosition(paddleRef.current, { x: newX, y: height });
                if (isFirstMove.current) {
                    isFirstMove.current = false; // Đánh dấu đã di chuyển
                    startBallMovement();
                }

            }
        })
    ).current;
    //#endregion

    //#region RestartGame
    const handleRestartGame = () => {
        setRestartGame(false);
        setPauseGame(false);
        setStateGameOver(false);
        setCurrentLevel(0);
        setScore(0);
        setCountBalls(0);
        setNumBalls(2);
        isFirstMove.current = true

    }
    //#endregion

    //#region Hàm set giá trị bound cho bóng
    const handleBallBounce = (ball) => {
        //console.log('goi bound')
        if(isFirstMove.current) return

        const speed = 26; // Tốc độ mới của bóng sau khi va chạm
        const angle = Math.random() * (Math.PI / 2) - Math.PI / 4; // Phản xạ trong khoảng [-45, 45] độ

        const newVelocity = {
            x: speed * Math.sin(angle),
            y: -Math.abs(speed * Math.cos(angle)), // Đảm bảo bóng luôn đi lên
        };

        Matter.Body.setVelocity(ball, newVelocity);
    };
    //#endregion

    //#region Hàm set vận tốc vecto theo trục y cho lần đầu start game
    const startBallMovement = () => {
        if(!showChangingLevel) return;
        const initialVelocity = { x: 0, y: -20 }; // Hướng bay lên
        setStartPosition(0)
        ballsRef.current.forEach((ball, index) => {
            setTimeout(() => {
                Matter.Body.setVelocity(ball, initialVelocity);
            }, index * delayBetweenBalls); // Mỗi bóng sẽ bay lên cách nhau 200ms
        });
    };
    //#endregion

    //#region handle save score
    const handleSaveScore = async () => {
        await saveHighScore(score, 'line_breaker');
    };

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

    const handleButtonPress = (buttonKey) => {
        //console.log(buttonKey);

        switch (buttonKey) {
            case "btnResume":
                setPauseGame(false);
                gameEngine.start();
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
                gameEngine.stop();
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
                                systems={[createPhysics(width, height,startPosition,2)]}
                                entities={{...entities,...brickObj, ...ballObject,...wallObject, ...paddleObject}}
                    />
                )}

            </View>

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
        backgroundColor: "#000B22",
    },
});

export default mode_2;