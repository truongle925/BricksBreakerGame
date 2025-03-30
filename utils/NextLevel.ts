import React from "react";

/**
 *
 * @param setCurrentLevel - Cài đặt level
 * @param levels - Danh sách thiết lập các level cho trò chơi
 * @param isLevelChanging - Biến trạng thái check chuyển level
 */
const nextLevel = (
    setCurrentLevel: React.Dispatch<React.SetStateAction<number>>,
    levels: any[],
    isLevelChanging: React.MutableRefObject<boolean>
) => {
    setTimeout(() => {
        setCurrentLevel(prev => (prev + 1) % levels.length);
        isLevelChanging.current = false;
    }, 1000);
};
export {nextLevel}