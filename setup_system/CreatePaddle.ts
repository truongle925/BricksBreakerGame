import Matter from "matter-js";

const CreatePaddle = (world,width,height) => {
    const paddle = Matter.Bodies.rectangle((width / 2), height, 100, 20, {
        isStatic: true,
    });
    Matter.World.add(world, [paddle]);
    return {paddle};
}

export default CreatePaddle;