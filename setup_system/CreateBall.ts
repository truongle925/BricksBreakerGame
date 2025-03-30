import Matter from "matter-js";
import BallCircle from "@/components/BallCircle";

const createBall = (world:Matter.World,width: number,height: number) => {
    const ball = Matter.Bodies.circle(width/2, height, 10, {
        restitution: 1,
        friction: 0,
        frictionAir: 0.02,
        collisionFilter: {
            group: -1, // Bóng trong cùng nhóm (-1) sẽ không va chạm nhau
        },

    });
    Matter.World.add(world,[ball]);
    return { ball };
}

const createListBalls = (numBalls: number, world: Matter.World, width:number, height:number) => {
    console.log(numBalls)
    return Array.from({ length: numBalls }, () => {
        const ballData = createBall(world, width, height);

        return ballData.ball;
    });
};




export  {createBall,createListBalls} ;