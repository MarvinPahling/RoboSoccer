import { FriendlyRobot } from "base/robot";
import * as Field from "base/field";
import * as World from "base/world";
import { MoveTo } from "stp_vibes/skills/moveto";
import { Position, Vector } from "base/vector";

export class Kickoff {
    private robots: FriendlyRobot[];
    private formation: number[];

    constructor(robots: FriendlyRobot[], formation: number[]) {
        this.robots = robots;
        this.formation = formation;
    }

    public run() {
        const G: Readonly<World.GeometryType> = World.Geometry;
        const fieldWith = G.FieldHeight;
        const fieldHeight = G.FieldWidth;
        const fieldHalf = G.FieldHeightHalf;

        // Print some information about the field
        amun.log(fieldHeight + " " + fieldWith + " " + fieldHalf);

        // Move each robot to a different position
        this.robots.forEach((robot, index, robots) => {
            // Calculate a different position for each robot based on its index
            const newPosition = kickoffPosition(index, this.formation[0], this.formation[1], this.formation[3]);    

            // Create a new MoveTo object and move the robot to the calculated position
            const skill = new MoveTo(robot);
            skill.run(newPosition, 0);
        });

        function kickoffPosition(index: number, front : number, middle : number, back : number) {
            if(index == 0){
                return new Vector(0, 3,5);
            }
            else if(index <= front){
                return new Vector(-fieldHeight/2 + fieldHeight/(front + 1) * index, 0.5);
            }
            else if(index <= (front + middle)){
                return new Vector(-fieldHeight/2 + fieldHeight/(middle + 1) * (index - front), 1.5);
            }
            else{
                return new Vector(-fieldHeight/2 + fieldHeight/(back + 1) * (index - (front + middle)), 2.5);
            }
        }

    }
}


