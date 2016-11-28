var _ = require('lodash');

function Room(id, brief, description) {
	this.id = id;
	this.brief = brief;
	this.description=description;
	this.supporter = false;
	this.arcs = {};
	this.contents = [];
}

Room.prototype.describe = function () {
	var s = "You are " + this.preposition() + " " + this.description;
	if (this.contents.length > 0) {
		s += "\nYou see:\n";
		s += _.map(this.contents, n => n.description).join("\n");
	}

	if (this.visible_exits()) {
		s += "\n" + this.visible_exits().map(arc => arc.describe()).join("\n");
	}

	return s;
};

Room.prototype.visible_exits = function () {
	return _.filter(this.arcs, "visible");
};

Room.prototype.preposition = function () {
	return this.supporter ? "on" : "in";
};

Room.prototype.add_arc = function (arc) {
	this.arcs[arc.direction]=arc;
};

Room.prototype.has_arc = function (direction) {
	return this.arcs[direction];
};

Room.prototype.has_item = function (noun) {
	return this.contents.indexOf(noun) >= 0;
};

Room.prototype.add_item = function (noun) {
	this.contents.push(noun);
	return noun;
};

Room.prototype.remove_item = function (noun) {
	var idx = this.contents.indexOf(noun);
	if (idx < 0) {
		throw("Room " + this + " does not contain " + noun);
	} else {
		this.contents.splice(idx, 1)
		return noun;
	}
}

Room.prototype.set_supporter = function (b) {
	this.supporter = b;
	return this;
};

Room.prototype.find = function (np) {
	return _.find(this.contents, n => n.match(np));
};

exports.Room = Room;
