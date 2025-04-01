/**
 * Hàm check game over cho game mode 1
 * @param bricksRef - Danh sách các viên gạch
 * @param height - Chiều cao của màn hình
 */
const checkGameOver_GameMode1 = (bricksRef, height) => {
    for (const brick of bricksRef.current) {
        if (brick.body.position.y >= height - 200) {
            //console.log("Game Over! Người chơi đã thua.");
            return true;
        }
    }
    return false;
};

export default checkGameOver_GameMode1;
