const opposite = require ("./opposite.js");

function Arc (from, to, direction, description) {
	this.from = from;
	this.to=to;
	this.direction=direction;
	this.description=description;
	this.visible = true;
}

Arc.directions = ["up", "down", "north", "south", "east", "west", "in", "out"];

Arc.isDirection = function (pp) {
	return Arc.directions.indexOf(pp) >= 0;
};

Arc.prototype.reverse_arc = function () {
	return new Arc(this.to, 
				   this.from,
				   opposite.direction(this.direction),
				   this.description);
}

Arc.prototype.describe = function () {
	return "A " + this.description + " leads " + this.direction;
};

Arc.prototype.follow = function (context) {
	// can add tests here to prohibit some arcs
	context.speak("You go " + this.direction);
	context.player.goto(this.to);
	context.speak(context.player.room.describe());
};


exports.Arc = Arc;
