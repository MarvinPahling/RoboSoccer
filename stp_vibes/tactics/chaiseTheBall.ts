import { FriendlyRobot } from "base/robot";
import * as Field from "base/field";
import * as World from "base/world";
import { Ball } from "base/ball";
import { MoveTo } from "stp_vibes/skills/moveto";
import { PassTo } from "stp_vibes/skills/passTo";
import { Position, Vector } from "base/vector";

export class ChaiseTheBall {
    private robots: FriendlyRobot[];
    private formation: number[];

    constructor(robots: FriendlyRobot[], formation: number[]) {
        this.robots = robots;
        this.formation = formation;
    }

    public run() {


        // Get the field dimensions
        const G: Readonly<World.GeometryType> = World.Geometry;
        const fieldWith = G.FieldHeight;
        const fieldHeight = G.FieldWidth;
        const fieldHalf = G.FieldHeightHalf;

        // Get the ball position
        const ballPosition = World.Ball.pos;

        // Get the Robots distances to the ball
        const distances : number[] = [];

        this.robots.forEach((robot, index, robots) => {
            const robotPosition = robot.pos;
            const distance = robotPosition.distanceTo(ballPosition);
            distances.push(distance);
        });

        // Get the closest robot index
        const closestRobotIndex = distances.indexOf(Math.min(...distances));
        // Get the furthest robot index
        const furthestRobotIndex = distances.indexOf(Math.max(...distances));
        // Get the second closest robot index
        const secondClosestRobotIndex = distances.indexOf(Math.min(...distances.filter((_, index) => index != closestRobotIndex)));
        

        // Boolean Array to ckeck which robot already recieved a command
        let hasReceivedCommand = new Array(this.robots.length).fill(false);

        const nearestRobotsArroundChaiser = getIndexOfNearestRobots(closestRobotIndex, 3, this.robots);
        const circlePositions = getPositionInCircleArround(closestRobotIndex, nearestRobotsArroundChaiser, this.robots, ballPosition);

        let c : number = 0;

		World.FriendlyRobots.forEach((robot, index, robots) => {
           
            //Check if Robot is the closest Robot
            if (index == closestRobotIndex){
                passTo(index, secondClosestRobotIndex, this.robots);
                hasReceivedCommand[index] = true;
               
            //Check if Robot is one of the nearest Robots arround the closest Robot
            } else if (nearestRobotsArroundChaiser.includes(index)){
                moveTo(index, circlePositions[c], this.robots);
                hasReceivedCommand[index] = true;
                c++;
            //Check if the Robot has not received a command yet
            } else if (!hasReceivedCommand[index]){
                moveToKickoffPosition(index, ballPosition, this.robots, this.formation);
                hasReceivedCommand[index] = true;
            }


			// if (index != closestRobotIndex){
            //     moveToKickoffPosition(index, ballPosition, this.robots, this.formation);
            // } else if (index == closestRobotIndex){
            //     passTo(index, secondClosestRobotIndex, this.robots);
            // }
		})
    

        function passTo(indexShooter : number, indexReciever : number, robots : FriendlyRobot[]){
            let shooter = robots[indexShooter];
            let reciever = robots[indexReciever];
            const passTo = new PassTo(shooter, reciever);
            passTo.run();
        }

        function moveTo(index : number, position : Position, robots : FriendlyRobot[]){
            let robot = robots[index];
            const skill = new MoveTo(robot);
            skill.run(position, 0);
        }

        function moveToKickoffPosition(index : number, position : Position, robots : FriendlyRobot[], formation : number[] = [3,4,3]){
            let robot = robots[index];
            const skill = new MoveTo(robot);
            skill.run(kickoffPosition(index, formation[0], formation[1], formation[2]), 0);
        }
        
        

        function kickoffPosition(index: number, front: number, middle: number, back: number) {
            const G: Readonly<World.GeometryType> = World.Geometry;
            const fieldHeight = G.FieldHeight;

            const offsetFromFieldHalf = 0;

            if (index == 0) {
                return new Vector(0, 3.5);
            } else if (index <= front) {
                return new Vector(-fieldHeight / 2 + fieldHeight / (front + 1) * index, -0.5 + offsetFromFieldHalf);
            } else if (index <= (front + middle)) {
                return new Vector(-fieldHeight / 2 + fieldHeight / (middle + 1) * (index - front), -1.5 + offsetFromFieldHalf);
            } else {
                return new Vector(-fieldHeight / 2 + fieldHeight / (back + 1) * (index - (front + middle)), -2.5 + offsetFromFieldHalf);
            }
        }

        function getPositionInCircleArround(indexCenterRobbot : number, indexRobotsToMove : number[], robots : FriendlyRobot[], ballPosition : Position){
          
            let radius = 2;
            let angle = 0;
            let positions : Vector[] = [];
            let centerRobot = robots[indexCenterRobbot];

            indexRobotsToMove.forEach((index, indexIndex, indexRobotsToMove) => {
                let robot = robots[index];
                let position = new Vector(centerRobot.pos.x + radius * Math.cos(angle), centerRobot.pos.y + radius * Math.sin(angle));
                positions.push(position);
                angle += 2 * Math.PI / indexRobotsToMove.length;
            });
            return positions;
           
        }

        function getIndexOfNearestRobots(indexCenterRobbot : number, numberOfRobots : number, robots : FriendlyRobot[]){
            let distances : number[] = [];
            let indexRobotsToMove : number[] = [];
            robots.forEach((robot, index, robots) => {
                let distance = robot.pos.distanceTo(robots[indexCenterRobbot].pos);
                distances.push(distance);
            });
            for (let i = 0; i < numberOfRobots; i++) {
                let index = distances.indexOf(Math.min(...distances));
                indexRobotsToMove.push(index);
                distances[index] = 1000;
            }
            return indexRobotsToMove;
        }


        // // Move each robot to a different position
        // this.robots.forEach((robot, index, robots) => {
        //     // Calculate a different position for each robot based on its index
        //     const newPosition = ballPosition;    

        //     // Create a new MoveTo object and move the robot to the calculated position
        //     const skill = new MoveTo(robot);
        //     skill.run(newPosition, 0);
        // });



    }
}


