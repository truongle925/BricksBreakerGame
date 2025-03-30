import Brick from "@/components/Brick";
import Matter from "matter-js";

const createBricks = (level, world) => {
    if (!level) return [];

    return level.bricks.map(({ x, y, width, height, hitCount }) => {
        const brick = Matter.Bodies.rectangle(x, y, width, height, { isStatic: true,restitution:1.2 });
        Matter.World.add(world, brick);
        return { body: brick, hitCount };
    });
};

export default createBricks;