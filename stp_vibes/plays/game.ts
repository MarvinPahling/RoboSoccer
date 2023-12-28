import * as World from "base/world";
import * as amun from "base/amun";
import { MoveTo } from "stp_vibes/skills/moveto";
import { Position, Vector } from "base/vector";
import { Ball } from "base/ball";
import { ChaiseTheBall } from "stp_vibes/tactics/chaiseTheBall";
import { Defence } from "stp_vibes/tactics/defence";
import { Offence } from "stp_vibes/tactics/offence"; 


export class Game {


	constructor(formation: number[]) {

	}

	run() {

		if(World.TeamIsBlue){
			amun.log("Game is running");
			const ballPosition : Vector = World.Ball.pos;
			const formation : number[] = [3,4,3];
			amun.log("Ball position: " + ballPosition.x + " " + ballPosition.y);

			if(ballPosition.y > 0){
				const offence = new Offence(World.FriendlyRobots, formation);
				offence.run();
				amun.log("Ball in other half")
			} else {
				const defence = new Defence(World.FriendlyRobots, formation);
				defence.run();
				amun.log("Ball in our half")
			}
		}else{
			amun.log("Game is running");
			const ballPosition : Vector = World.Ball.pos;
			const formation : number[] = [2,3,5];
			amun.log("Ball position: " + ballPosition.x + " " + ballPosition.y);

			if(ballPosition.y > 0){
				const offence = new Offence(World.FriendlyRobots, formation);
				offence.run();
				amun.log("Ball in other half")
			} else {
				const defence = new Defence(World.FriendlyRobots, formation);
				defence.run();
				amun.log("Ball in our half")
			}
		}
	

	}
}
