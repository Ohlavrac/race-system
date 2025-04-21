const Delay = (time: number) => new Promise(resolve => setTimeout(resolve, time));

let DEFAULT_CHECKPOINT_OBJECT = 2707666095;
var DEFAULT_DISTANCE = 3;
let INCREASE_CHECKPOINT_SPACE_BUTTON = 39;
let DECREASE_CHECKPOINT_SPACE_BUTTON = 40;
let SET_CHECKPOINT_POS_BUTTON = 54;
let isCreateRaceEnable = false;

let checkpointLeft : number | null = null;
let checkpointRight : number | null = null;

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

function removeAllCheckpointsObj() {
	for (let index = 0; index < race.checkpoint.length; index++) {
		let getObjectLeft = GetClosestObjectOfType(race.checkpoint[index].coordLeft[0], race.checkpoint[index].coordLeft[1], race.checkpoint[index].coordLeft[2], 100.0, DEFAULT_CHECKPOINT_OBJECT, true, false, false);
		let getObjectRight = GetClosestObjectOfType(race.checkpoint[index].coordRight[0], race.checkpoint[index].coordRight[1], race.checkpoint[index].coordRight[2], 100.0, DEFAULT_CHECKPOINT_OBJECT, true, false, false);
		
		DeleteObject(getObjectLeft);
		DeleteObject(getObjectRight);
	}
}

RegisterCommand("createrace", () => {
	isCreateRaceEnable = true;
}, false);

RegisterCommand("exitcreaterace", () => {
	isCreateRaceEnable = false
}, false);

RegisterCommand("saverace", () => {

	//REMOVE ALL CHECKPOINTS
	if (race.checkpoint.length > 1) {
		removeAllCheckpointsObj();
	} 

	isCreateRaceEnable = false
}, false);

setTick(async () => {
	let playerEntity = GetPlayerPed(PlayerId());
	let coords = GetEntityCoords(playerEntity, true);

	let z = coords[2];
	let y = coords[1];
	let x = coords[0];

	if (isCreateRaceEnable) {
		let heading = GetEntityHeading(playerEntity);

		let angLeftToRads = getLeftHeading(heading) * Math.PI / 180;
		let angRightToRads = getRightHeading(heading) * Math.PI / 180;

		let newXLeft = x + DEFAULT_DISTANCE * Math.cos(angLeftToRads - 1.5);
		let newYLeft = y + DEFAULT_DISTANCE * Math.sin(angLeftToRads - 1.5);
		let newZLeft = z;

		let newXRight = x + DEFAULT_DISTANCE * Math.cos(angRightToRads - 1.5);
		let newYRight = y + DEFAULT_DISTANCE * Math.sin(angRightToRads - 1.5);
		let newZRight = z;

		// Cria os objetos apenas uma vez
		if (!checkpointLeft || !checkpointRight) {
			checkpointLeft = CreateObject(
				DEFAULT_CHECKPOINT_OBJECT,
				newXLeft,
				newYLeft,
				newZLeft,
				false,
				false,
				false
			);

			checkpointRight = CreateObject(
				DEFAULT_CHECKPOINT_OBJECT,
				newXRight,
				newYRight,
				newZRight,
				false,
				false,
				false
			);

			SetEntityAlpha(checkpointLeft, 150, false);
			SetEntityAlpha(checkpointRight, 150, false);

			SetEntityCollision(checkpointLeft, false, false);
			SetEntityCollision(checkpointRight, false, false);

			FreezeEntityPosition(checkpointLeft, true);
			FreezeEntityPosition(checkpointRight, true);
		}

		// Atualiza posição a cada tick
		SetEntityCoordsNoOffset(checkpointLeft, newXLeft, newYLeft, newZLeft, true, true, true);
		SetEntityCoordsNoOffset(checkpointRight, newXRight, newYRight, newZRight, true, true, true);

		PlaceObjectOnGroundProperly(checkpointLeft);
		PlaceObjectOnGroundProperly(checkpointRight);

		// Ajusta distância
		if (IsControlPressed(0, INCREASE_CHECKPOINT_SPACE_BUTTON)) {
			DEFAULT_DISTANCE += 1;
			console.log(DEFAULT_DISTANCE);
		}

		if (IsControlPressed(0, DECREASE_CHECKPOINT_SPACE_BUTTON) && DEFAULT_DISTANCE > 2) {
			DEFAULT_DISTANCE -= 1;
		}

		// Confirma e adiciona à lista
		if (IsControlJustPressed(0, SET_CHECKPOINT_POS_BUTTON)) {
			let checkpointObj: CheckpointModel = {
				checkpointIndex: race.checkpoint.length,
				coordLeft: [newXLeft, newYLeft, newZLeft],
				coordRight: [newXRight, newYRight, newZRight],
				coordCenter: [x, y],
			};

			race.checkpoint.push(checkpointObj);

			console.log("CheckpointIndex: ", checkpointObj.checkpointIndex);
			console.log(race.checkpoint);

			// Após confirmação, "reseta" para permitir novo preview
			checkpointLeft = null;
			checkpointRight = null;
		}
	}
});