// an Adhoc is just a pair of a predicate and an action.
// The predicate is applied to (current) game and the current input line
// If it is true, the action is executed.
// The game has a list of adhocs.  Each time the user types
// input, the entire set list is applied.  The first one to fire wins

function Adhoc (predicate, action) {
	this.predicate = predicate;
	this.action = action;
	this.active = true;
}

Adhoc.prototype.match = function (game, input) {
	return this.active && this.predicate.call(null, game, input);
};

Adhoc.prototype.execute = function (game, input) {
	this.action.call(this, game, input);
};


// A fluid interface for building the adhoc, especially the predicate
// The regexp is applied to the current input line
// All the other terms are combined with and
function Builder (game, regexp) {
	this.game = game;
	this.regexp = regexp;
	this.noun_in_room = null;
	this.noun_in_inventory = null;
	this.state_predicate = null;
	this.room_id = null;
}


// The object described by np must be in the same room
Builder.prototype.at = function (np) {
	this.noun_in_room = np;
	return this;
};

// The object described by np must be in the inventory
Builder.prototype.holding = function (np) {
	this.noun_in_inventory = np;
	return this;
};

Builder.prototype.state = function (f) {
	this.state_predicate = f;
	return this;
};

// the player must be in the named room
Builder.prototype.in = function (room_id) {
	this.room_id = room_id;
	return this;
};

// the lambda to be executed if the predicate matches.
Builder.prototype.do = function (lambda) {
	this.game.add_adhoc(new Adhoc (this.predicate(), lambda));
};

// generates the lambda expression predicate
Builder.prototype.predicate = function () {
	return (game, input) => {
		return this.regexp.test(input) &&
			(!this.state_predicate ||
			 this.state_predicate.call(game, game)) &&
			(!this.noun_in_room || game.player.room.find(this.noun_in_room)) &&
			(!this.room_id || game.player.room.id == this.room_id) &&
			(!this.noun_in_inventory || game.player.find(this.noun_in_inventory));
	};
};
		

exports.Builder = Builder;
