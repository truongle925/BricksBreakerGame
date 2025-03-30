import Matter from "matter-js";

export const calculateTrajectory = (startPos: Matter.Vector, velocity: Matter.Vector, width: number) => {
    let points = [];
    let pos = { x: startPos.x, y: startPos.y + 60};
    let vel = { x: velocity.x, y: velocity.y };

    for (let i = 0; i < 25; i++) { // Số điểm trên quỹ đạo
        // Cập nhật vị trí dựa trên vận tốc
        pos.x += vel.x;
        pos.y += vel.y;

        // Xử lý phản xạ khi chạm tường
        if (pos.x <= 0 || pos.x >= width) {
            vel.x = -vel.x;
        }
        if (pos.y <= 0) {
            vel.y = -vel.y;
        }

        points.push({ x: pos.x, y: pos.y });
    }

    return points;
};

