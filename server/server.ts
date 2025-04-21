console.log("Race Systen V0.1 is running")

onNet("server:deleteObj", (netId: number) => {
    emitNet('deleteobject:allow', -1, netId);
})