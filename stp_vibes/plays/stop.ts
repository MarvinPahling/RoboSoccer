import * as World from "base/world";
import { MoveTo } from "stp_vibes/skills/moveto";
import { Position, Vector } from "base/vector";
import { Ball } from "base/ball";
import { Tacticone } from "stp_vibes/tactics/tacticone";
import { StartFormation } from "stp_vibes/tactics/startFormation";


export class Stop {

	constructor() {

	}

	run() {
		amun.log("Stop Play loop")
        const play = new StartFormation(World.FriendlyRobots, [1,1,1]);
		play.run();

	}
}
