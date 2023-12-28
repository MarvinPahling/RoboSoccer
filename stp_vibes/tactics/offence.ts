import { FriendlyRobot } from "base/robot";
import * as Field from "base/field";
import * as World from "base/world";
import * as amun from "base/amun";
import { Ball } from "base/ball";
import { MoveTo } from "stp_vibes/skills/moveto";
import { PassTo } from "stp_vibes/skills/passTo";
import { ShootTo } from "stp_vibes/skills/shootTo";
import { Position, Vector } from "base/vector";

export class Offence {
    private robots: FriendlyRobot[];
    private formation: number[];

    constructor(robots: FriendlyRobot[], formation: number[]) {
        this.robots = robots;
        this.formation = formation;
    }

    public run() {
        //amun.log("The team is in defencive mode")

        // Get the field dimensions
        const G: Readonly<World.GeometryType> = World.Geometry;
        let fieldWith: number = G.FieldHeight;
        let fieldHeight: number = G.FieldWidth;
        const fieldHalf: Vector = G.FieldHeightHalf;
        const friendlyGoal: Vector = G.FriendlyGoal;
        const enemyGoal: Vector = G.OpponentGoal;


        //Reference the different robots
        let keeper: FriendlyRobot = World.FriendlyRobots[0];
        let front: FriendlyRobot[] = [];
        let middle: FriendlyRobot[] = [];
        let back: FriendlyRobot[] = [];
        World.FriendlyKeeper = keeper;
        
        //amun.log("The keeper is: " + keeper);
        this.robots.forEach((robot, index, robots) => {
            if (index == 0) {
                keeper = robot;
            } else if (index <= this.formation[0]) {
                front.push(robot);
            } else if (index <= (this.formation[0] + this.formation[1])) {
                middle.push(robot);
            } else {
                back.push(robot);
            }
        });



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

        const nearestRobotsArroundChaiser = getIndexOfNearestRobots(closestRobotIndex, 3, this.robots);

        const circlePositions = getPositionInCircleArround(closestRobotIndex, nearestRobotsArroundChaiser, this.robots, ballPosition);

        amun.log(enemyGoal);

       //logic of the last row
       for (let i = 0; i < back.length; i++) {
        let p = new Vector((-fieldHeight / 2) + (fieldHeight / (back.length + 1)) * (i+1), ballPosition.y -2.5);
        if(back[i].pos.distanceTo(ballPosition) < 1 && p.distanceTo(ballPosition) < 1){
            shootTo(i, enemyGoal, back);
        }
        else{
            moveTo(i, p, back);
        }
        }



        //logic of the middle row
        for (let i = 0; i < middle.length; i++) {
            let p = new Vector((-fieldHeight / 2) + (fieldHeight / (middle.length + 1)) * (i+1), ballPosition.y -1.5);
            if(middle[i].pos.distanceTo(ballPosition) < 1 && p.distanceTo(ballPosition) < 1){
                shootTo(i, enemyGoal, middle);
            }
            else{
                moveTo(i, p, middle);
            }
        }

        //Logic for the front row
        let distsFront: number[] = [];
        for (let i = 0; i < front.length; i++) {
            distsFront.push(front[i].pos.distanceTo(ballPosition));
        }
        let closestFront = distsFront.indexOf(Math.min(...distsFront));
    
        shootTo(closestFront, enemyGoal, front);
        for (let i = 0; i < front.length; i++) {
           if(i != closestFront && front[closestFront].pos.distanceTo(ballPosition) > 3 ){

               passTo(i, closestFront, front);
           }
        }

        //logic of the keeper
        amun.log("The keeper is: " + keeper);
        if (keeper.pos.distanceTo(ballPosition) < 1 && keeper.pos.distanceTo(friendlyGoal) < 10) {
            shootToS(enemyGoal, keeper);
        } else {
            moveToS(friendlyGoal, keeper);
        }
       


        // Class funtions
        function shootTo(index : number, position : Vector, robots : FriendlyRobot[]){
            let robot = robots[index];
            const skill = new ShootTo(robot, position);
            skill.run();
        }
        function shootToS(position : Vector, robot : FriendlyRobot){
            const skill = new ShootTo(robot, position);
            skill.run();
        }



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

        function moveToS(position : Position, robot : FriendlyRobot){
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

            const offsetFromFieldHalf = -ballPosition.x;

            if (index == 0) {
                return new Vector(0, -3.5);
            } else if (index <= front) {
                return new Vector(-fieldHeight / 2 + fieldHeight / (front + 1) * index, -(0.5 + offsetFromFieldHalf));
            } else if (index <= (front + middle)) {
                return new Vector(-fieldHeight / 2 + fieldHeight / (middle + 1) * (index - front), -(1.5 + offsetFromFieldHalf));
            } else {
                return new Vector(-fieldHeight / 2 + fieldHeight / (back + 1) * (index - (front + middle)), -(2.5 + offsetFromFieldHalf));
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

        function calculateVectorOfIntersection(intersecY : number, ballPosition : Vector, goalPosition : Vector){
            let dir = goalPosition.sub(ballPosition).normalized();
            let r = (ballPosition.y - intersecY) / dir.y;
            let x = -r * dir.x + ballPosition.x;
            return new Vector(x, intersecY);
        }
    }
}


