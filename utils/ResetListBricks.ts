import Matter from "matter-js";
import React from "react";

// Hàm reset danh sách bricks
export const resetListBricks = (
    bricksRef: React.MutableRefObject<{ body: Matter.Body; hitCount: number }[]>,
    world: Matter.World
) => {
    bricksRef.current.forEach(brick => Matter.World.remove(world, brick.body));
    bricksRef.current = [];
};