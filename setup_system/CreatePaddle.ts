import Matter from "matter-js";

/**
 * Hàm tạo thanh paddle
 * @param world - World Game
 * @param width - Chiều rộng màn hình
 * @param height - Chiều cao màn hình
 * @constructor
 */
const CreatePaddle = (world,width,height) => {
    const paddle = Matter.Bodies.rectangle((width / 2), height, 100, 20, {
        isStatic: true,
    });
    Matter.World.add(world, [paddle]);
    return {paddle};
}

export default CreatePaddle;