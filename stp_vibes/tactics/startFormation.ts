import { FriendlyRobot } from "base/robot";
import * as Field from "base/field";
import * as World from "base/world";
import { MoveTo } from "stp_vibes/skills/moveto";
import { Position, Vector } from "base/vector";

export class StartFormation {
    private robots: FriendlyRobot[];

    constructor(robots: FriendlyRobot[]) {
        this.robots = robots;
    }

    public run() {
        
        // Move each robot to a different position
        this.robots.forEach((robot, index, robots) => {
            // Calculate a different position for each robot based on its index
            const newPosition = new Vector(3.1, 0.5 + index * 0.2);    

            // Create a new MoveTo object and move the robot to the calculated position
            const skill = new MoveTo(robot);
            skill.run(newPosition, 0);
        });

     

    }
}


