const opposite = require ("./opposite.js");

function Arc (from, to, direction, description) {
	this.from = from;
	this.to=to;
	this.direction=direction;
	this.description=description;
}

Arc.directions = ["up", "down", "north", "south", "east", "west", "in", "out"];

Arc.isDirection = function (pp) {
	return Arc.directions.indexOf(pp) >= 0;
};

Arc.prototype.is_visible = function (context) {
	return true;
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

Arc.prototype.enabled = function (context) {
	return true;
};

Arc.prototype.follow = function (context) {
	if (this.enabled(context)) {
		context.speak("You go " + this.direction + ".\n");
		context.player.goto(this.to);
		context.speak(context.player.room.describe());
	} else {
		if (this.is_visible(context)) {
			context.speak("You can't");
		} else {
			context.speak("You can't go that way.");
		}
	}
};


exports.Arc = Arc;
