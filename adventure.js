const loader = require("./loader.js");
const loop = require("./loop.js");

function adventure() {
	loop.interaction_loop(	loader.create());
}

adventure();

