const Delay = (time: number) => new Promise(resolve => setTimeout(resolve, time));

let DEFAULT_CHECKPOINT_OBJECT = 2707666095;
var DEFAULT_DISTANCE = 8;
let INCREASE_CHECKPOINT_SPACE_BUTTON = 39;
let DECREASE_CHECKPOINT_SPACE_BUTTON = 40;
let SET_CHECKPOINT_POS_BUTTON = 54;
let isCreateRaceEnable = false;

let race: RaceModel = {
	raceName: "FirstRace",
	checkpoint: []
}

function getLeftHeading(headingValue: number) {
	let result = headingValue - 90;

	if (result <  0) {
		let resultPositive = result *= -1;
		return 360 - resultPositive;
	} else {
		return result;
	}
}

function getRightHeading(headingValue: number) {
	let result = headingValue + 90;

	if (result >  360) {
		let resultFix = result - 360;
		return resultFix;
	} else {
		return result;
	}
}

RegisterCommand("createrace", () => {
	isCreateRaceEnable = true;
}, false);

RegisterCommand("exitcreaterace", () => {
	isCreateRaceEnable = false
}, false);

RegisterCommand("saverace", () => {
	//for (let index = 0; index < race.checkpoint.length; index++) {
		//DeleteObject()
	//}
	let getObjectLeft = GetClosestObjectOfType(race.checkpoint[0].coordLeft[0], race.checkpoint[0].coordLeft[1], race.checkpoint[0].coordLeft[2], 100.0, DEFAULT_CHECKPOINT_OBJECT, true, false, false);
	let getObjectRight = GetClosestObjectOfType(race.checkpoint[0].coordRight[0], race.checkpoint[0].coordRight[1], race.checkpoint[0].coordRight[2], 100.0, DEFAULT_CHECKPOINT_OBJECT, true, false, false);

	DeleteObject(getObjectLeft);
	DeleteObject(getObjectRight);
}, false);

setTick(async () => {
	let playerEntity = GetPlayerPed(PlayerId());
	let coords;

	coords = GetEntityCoords(playerEntity, true);

	let z = coords[2];
	let y = coords[1];
	let x = coords[0];

	if (isCreateRaceEnable) {
		let heading = GetEntityHeading(playerEntity);

		let angLeftToRads = getLeftHeading(heading) * 3.14 / 180;
		let angRightToRads = getRightHeading(heading) * 3.14 / 180;

		let newXLeft = x + DEFAULT_DISTANCE * Math.cos(angLeftToRads-1.5);
		let newYLeft = y + DEFAULT_DISTANCE * Math.sin(angLeftToRads-1.5);
		let newZLeft = z;

		let newXRight = x + DEFAULT_DISTANCE * Math.cos(angRightToRads-1.5);
		let newYRight = y + DEFAULT_DISTANCE * Math.sin(angRightToRads-1.5);
		let newZRight = z;

		let checkpontLeft = CreateObjectNoOffset(
			DEFAULT_CHECKPOINT_OBJECT,
			newXLeft,
			newYLeft,
			z,
			false,
			false,
			false,
		);

		let checkpointRight = CreateObjectNoOffset(
			DEFAULT_CHECKPOINT_OBJECT,
			newXRight,
			newYRight,
			z,
			false,
			false,
			false,
		);

		PlaceObjectOnGroundProperly(checkpontLeft);
		PlaceObjectOnGroundProperly(checkpointRight);

		if (IsControlPressed(0, INCREASE_CHECKPOINT_SPACE_BUTTON)) {
			DEFAULT_DISTANCE = DEFAULT_DISTANCE + 1;
			console.log(DEFAULT_DISTANCE);
		}
		
		if (IsControlPressed(0, DECREASE_CHECKPOINT_SPACE_BUTTON) && DEFAULT_DISTANCE > 2) {	
			DEFAULT_DISTANCE-=1;
		}

		if (IsControlJustPressed(0, SET_CHECKPOINT_POS_BUTTON)) {
			let checkpointObj: CheckpointModel = {
				checkpointIndex: race.checkpoint.length,
				coordLeft: [newXLeft, newYLeft, newZLeft],
				coordRight: [newXRight, newYRight, newZRight],
				coordCenter: [x, y],
			}
			race.checkpoint.push(checkpointObj);

			console.log("CheckpontIndex: ", checkpointObj.checkpointIndex);
			console.log(race.checkpoint);
		} else {
			await Delay(0.1);

			let getObjectLeft = GetClosestObjectOfType(newXLeft, newXLeft, z, 100.0, DEFAULT_CHECKPOINT_OBJECT, true, false, false);
			let getObjectRight = GetClosestObjectOfType(newXRight, newXRight, z, 100.0, DEFAULT_CHECKPOINT_OBJECT, true, false, false);

			/*if (DoesEntityExist(getObjectLeft)) {
				SetEntityAsMissionEntity(getObjectLeft, true, true);
				//DeleteObject(getObjectLeft);
				console.log("ODIO");
			}*/

			console.log(getObjectLeft, getObjectRight);

			DeleteObject(checkpontLeft);
			DeleteObject(checkpointRight);
		}
	}
});