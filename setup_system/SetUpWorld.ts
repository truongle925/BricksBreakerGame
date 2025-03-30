import Matter from "matter-js";

/**
 * Hàm set up engine cho trò chơi bao gồm các sự kiện vật lý
 */
const setUpWorld = () => {
    const engine = Matter.Engine.create();
    engine.gravity.y = 0.5;
    engine.gravity.x = 0;

    const world = engine.world;
    return { engine, world };
}

export { setUpWorld };