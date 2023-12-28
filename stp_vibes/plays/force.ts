import * as World from "base/world";
import * as amun from "base/amun";
import { MoveTo } from "stp_vibes/skills/moveto";
import { Position, Vector } from "base/vector";
import { Ball } from "base/ball";
import { ChaiseTheBall } from "stp_vibes/tactics/chaiseTheBall";
import { Defence } from "stp_vibes/tactics/defence";
import { Offence } from "stp_vibes/tactics/offence"; 


export class Force {


	constructor(formation: number[]) {

	}

	run() {

		amun.log("Force is running");
	

	}
}
