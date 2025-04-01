import Matter from "matter-js";
import React from "react";

/**
 * Hàm reset gạch trong game
 * @param bricksRef - Đây là 1 biến reference danh sch gạch
 * @param world - World Game
 */
export const resetListBricks = (
    bricksRef: React.MutableRefObject<{ body: Matter.Body; hitCount: number }[]>,
    world: Matter.World
) => {
    bricksRef.current.forEach(brick => Matter.World.remove(world, brick.body));
    bricksRef.current = [];
};