import Matter from "matter-js";

/**
 *
 * @param world Đối tượng được khỏe tạo từ màn hình trò chơi
 * @param width Độ rộng màn hình
 * @param height Chiều cao màn hình
 */
const createWalls = (world: Matter.World,width:number,height:number) => {
    const wallOptions = { isStatic: true, restitution: 1 };

   // {velocity:{x:0,y:0}}
    const wallTop = Matter.Bodies.rectangle(width / 2, 0, width, 1, wallOptions);
    const wallBottom = Matter.Bodies.rectangle(width / 2, height, width, 1,{isStatic: true, restitution: 0});
    const wallLeft = Matter.Bodies.rectangle(0, height / 2, 5, height , wallOptions);
    const wallRight = Matter.Bodies.rectangle(width, height / 2, 5, height, wallOptions);

    Matter.World.add(world,[wallBottom,wallTop,wallRight,wallLeft]);
    return { wallTop, wallBottom, wallLeft, wallRight };
};
export { createWalls };