import Matter from "matter-js";
import React, {useRef} from "react";
import {nextLevel} from "@/utils/NextLevel";
import {playSound} from "@/utils/PlaySound";
import {Sound_Ball_Tap} from "@/constants/Sound";


export const useCollisionHandler = () => {
    const isLevelChanging = useRef(false);

    /**
     *
     * @param event Sự kiện có kiểu dữ liệu là 1 EventCollision
     * @param bricksRef Danh sách các viên gạch
     * @param world Đối tượng world được khởi tạo khi khởi động game
     * @param setBrickObj Đối tượng chứa các viên gạch
     * @param setCurrentLevel Cài đặt level
     * @param levels Danh sách các level trò chơi
     * @param setScore Tính điểm theo hitcount
     */
    const handleCollisionBrick = (
        event: Matter.IEventCollision<Matter.Engine>,
        bricksRef: React.MutableRefObject<{ body: Matter.Body; hitCount: number; showHitCount }[]>,
        world: Matter.World,
        setBrickObj: React.Dispatch<React.SetStateAction<Record<string, any>>>,
        setCurrentLevel: React.Dispatch<React.SetStateAction<number>>,
        levels: any[],
        setScore: React.Dispatch<React.SetStateAction<number>>,
    ) => {

        let brickIndex: number = -1;
        event.pairs.forEach(pair => {
            brickIndex = bricksRef.current.findIndex(brick => brick.body === pair.bodyA || brick.body === pair.bodyB);
            if (brickIndex !== -1) {
                const brick = bricksRef.current[brickIndex];
                if (brick) {
                    brick.hitCount -= 1;
                    playSound(Sound_Ball_Tap)
                    setScore(prevScore => prevScore + 5);
                    if (brick.hitCount <= 0) {
                        Matter.World.remove(world, brick.body);
                        bricksRef.current.splice(brickIndex, 1);
                    }

                    setBrickObj(prev => ({
                        ...prev,
                        [`brick_${brickIndex}`]: {
                            ...prev[`brick_${brickIndex}`],
                            hitCount: brick.hitCount
                        }
                    }));
                }
            }
        });

        // Kiểm tra nếu không còn viên gạch nào ko
        if (brickIndex === -1 && bricksRef.current.length === 0) {
            if (!isLevelChanging.current) {
                isLevelChanging.current = true;
                nextLevel(setCurrentLevel, levels, isLevelChanging);
            }
        }
    };

    return { handleCollisionBrick };
};
