import Matter from "matter-js";
import BallCircle from "@/components/BallCircle";

/**
 * Hàm tạo thuộc tính vật lý cho bóng
 * @param world - World Game
 * @param width - Chiều rộng màn hình
 * @param height - Chiều cao màn hình
 */
const createBall = (world:Matter.World,width: number,height: number) => {
    const ball = Matter.Bodies.circle(width/2, height, 10, {
        restitution: 1,
        friction: 0,
        frictionAir: 0.02,
        inertia: Infinity,
        collisionFilter: {
            group: -1, // Bóng trong cùng nhóm (-1) sẽ không va chạm nhau
        },

    });
    Matter.Body.set(ball, {
        angularVelocity: 0,
        angularDamping: 1,
    });
    Matter.World.add(world,[ball]);
    return { ball };
}

/**
 * Hàm tạo danh sách bóng
 * @param numBalls - Số lượng bóng
 * @param world - World Game
 * @param width - Chiều rộng màn hình
 * @param height - Chiều cao màn hình
 */
const createListBalls = (numBalls: number, world: Matter.World, width:number, height:number) => {
    //console.log(numBalls)
    return Array.from({ length: numBalls }, () => {
        const ballData = createBall(world, width, height);

        return ballData.ball;
    });
};




export  {createBall,createListBalls} ;