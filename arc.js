const opposite = require ("./opposite.js");

function Arc (from, to, direction, description) {
	this.from = from;
	this.to=to;
	this.direction=direction;
	this.description=description;
}

Arc.prototype.reverse_arc = function () {
	return new Arc(this.to, this.from,
			opposite.direction(this.direction), this.description);
}

exports.Arc = Arc;
