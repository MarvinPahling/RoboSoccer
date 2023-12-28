import * as World from "base/world";

export class Halt {

    constructor() {

    }

    run() {
        amun.log("Halt Play");

        for (let robot of World.FriendlyRobots) {
            if (robot.moveCommand == undefined) {
                robot.setStandby(true);
                robot.halt();
            }
        }
    }
}