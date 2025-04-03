import Matter from "matter-js";

/**
 * Hàm set up vật lys custom theo entities
 * @param width - Chiều rộng màn hình
 * @param height - Chiều cao màn hình
 * @param startPosition - Vị trí bắt đầu spawn entities
 * @param mode - Chế độ game
 */
const createPhysics = (width: number, height: number, startPosition, mode) => {
    return (entities: any, { time }: any) => {
        let engine = entities.physics.engine;
        Matter.Engine.update(engine, Math.min(time.delta, 16.667));
        // Duyệt qua tất cả các bóng
        Object.keys(entities).forEach((key) => {
           // console.log(key)
            if (key.startsWith("ball_")) {
                let ball = entities[key]?.body;
                if (!ball) return;

                // Giới hạn bóng trong màn hình
                if (ball.position.x < 10) {
                    Matter.Body.setPosition(ball, { x: 10, y: ball.position.y });
                    //Matter.Body.setVelocity(ball, { x: Math.abs(ball.velocity.x), y: ball.velocity.y });
                    Matter.Body.setVelocity(ball, { x: Math.max(Math.abs(ball.velocity.x) + 5, 2), y: ball.velocity.y + 5 });
                }
                if (ball.position.x > width - 10) {
                    Matter.Body.setPosition(ball, { x: width - 10, y: ball.position.y });
                   // Matter.Body.setVelocity(ball, { x: -Math.abs(ball.velocity.x), y: ball.velocity.y });
                    Matter.Body.setVelocity(ball, { x: -Math.max(Math.abs(ball.velocity.x) + 5, 2), y: ball.velocity.y + 5});
                }
                if (ball.position.y < 10) {
                    Matter.Body.setPosition(ball, { x: ball.position.x, y: 10 });
                   // Matter.Body.setVelocity(ball, { x: ball.velocity.x, y: Math.abs(ball.velocity.y) });
                    Matter.Body.setVelocity(ball, { x: ball.velocity.x + 5, y: Math.max(Math.abs(ball.velocity.y) + 5, 2) });
                }
                if (ball.position.y > height - 20) {
                   //console.log(startPosition == 0 ? ball.position.x : startPosition.x+"aaaaa")
                    if (mode === 1){
                        Matter.Body.setPosition(ball, { x: startPosition == 0 ? ball.position.x : startPosition.x, y: height - 10 });
                        Matter.Body.setVelocity(ball, { x: 0, y: 0 });
                    }
                    else{
                        //console.log(startPosition)
                        Matter.Body.setPosition(ball, { x: startPosition == 0 ? ball.position.x : startPosition.x, y: startPosition == 0 ? ball.position.y + 10  : startPosition.y - 10  });
                        // Matter.Body.setVelocity(ball, { x: ball.velocity.x, y: Math.abs(ball.velocity.y) });
                        Matter.Body.setVelocity(ball, { x: ball.velocity.x, y: -Math.max(Math.abs(ball.velocity.y), 2) });
                    }


                }
            }
            if (key.startsWith("paddle")) {
                //console.log(startPosition)
                let paddle = entities[key]?.body;
                if (!paddle) return;
                Matter.Body.setPosition(paddle, { x: startPosition == 0 ? paddle.position.x : startPosition.x, y: startPosition == 0 ? paddle.position.y  : startPosition.y  });
            }
        });

        return entities;
    };
};

export default createPhysics;