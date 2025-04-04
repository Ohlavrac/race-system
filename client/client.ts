const Delay = (time: number) => new Promise(resolve => setTimeout(resolve, time));

let DEFAULT_CHECKPOINT_OBJECT = 2707666095;
var DEFAULT_DISTANCE = 8;
let INCREASE_CHECKPOINT_SPACE_BUTTON = 39;
let DECREASE_CHECKPOINT_SPACE_BUTTON = 40;

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

setTick(async () => {
	let playerEntity = GetPlayerPed(PlayerId());
	let coords;

	coords = GetEntityCoords(playerEntity, true);

	let z = coords[2];
	let y = coords[1];
	let x = coords[0];

	let heading = GetEntityHeading(playerEntity);

	let angLeftToRads = getLeftHeading(heading) * 3.14 / 180;
	let angRightToRads = getRightHeading(heading) * 3.14 / 180;

	let newXLeft = x + DEFAULT_DISTANCE * Math.cos(angLeftToRads-1.5)
	let newYLeft = y + DEFAULT_DISTANCE * Math.sin(angLeftToRads-1.5)

	let newXRight = x + DEFAULT_DISTANCE * Math.cos(angRightToRads-1.5)
	let newYRight = y + DEFAULT_DISTANCE * Math.sin(angRightToRads-1.5)

	let object01 = CreateObject(
		DEFAULT_CHECKPOINT_OBJECT, //SEM LISTRA
		newXLeft,
		newYLeft,
		z,
		true,
		false,
		false,
	);

	let object02 = CreateObject(
		DEFAULT_CHECKPOINT_OBJECT, //COM LISTRA
		newXRight,
		newYRight,
		z,
		true,
		false,
		false,
	);

	PlaceObjectOnGroundProperly(object01);
	PlaceObjectOnGroundProperly(object02);

	if (IsControlPressed(0, INCREASE_CHECKPOINT_SPACE_BUTTON)) {
		DEFAULT_DISTANCE = DEFAULT_DISTANCE + 1;
		console.log(DEFAULT_DISTANCE);
	}
	
	if (IsControlPressed(0, DECREASE_CHECKPOINT_SPACE_BUTTON)) {	
		DEFAULT_DISTANCE-=1;
	}

	if (IsControlJustPressed(0, 54)) {
		console.log("OPA", DEFAULT_DISTANCE);
	} else {
		await Delay(0.1);
		DeleteObject(object01);
		DeleteObject(object02);
	}
});