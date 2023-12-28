import { FriendlyRobot } from "base/robot";
import { MoveTo } from "stp_vibes/skills/moveto";
import { Position, Vector } from "base/vector";

export class Tacticone {
    private robots: FriendlyRobot[];

    constructor(robots: FriendlyRobot[]) {
        this.robots = robots;
    }

    public run() {

        this.robots.forEach((robot, index, robots) => {
            // Calculate a different position for each robot based on its index
            const newPosition = new Vector(0.5 + index * 0.2, 0.5);

            // Create a new MoveTo object and move the robot to the calculated position
            const skill = new MoveTo(robot);
            skill.run(newPosition, 0);
        });

    }
}


