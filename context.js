function Context (game, player) {
	this.game = game;
	this.player = player;
}

Context.prototype.find = function (np) {
	return this.player.find(np) || this.player.room.find(np);
};

Context.prototype.speak = function (x) {
	console.log(x);
};

Context.prototype.look = function () {
	this.speak(this.player.room.describe(this));
};

exports.Context = Context;
