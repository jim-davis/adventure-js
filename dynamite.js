const Noun = require("./noun.js").Noun;
const c = require("./categories.js");

function Dynamite () {
	Noun.call(this, "rod", [c.MOVEABLE],
					   "thick red rod twice as long as your hand",
					   "At one end there's a push button");
	this.add_adhoc_sentence_handler("push button", 
				   game => {
					   if (game.player.has_item(this)) {
						   if (this.get_state("pushed")) {
							   game.speak("The rod stops glowing, and the screen goes blank");
							   this.set_state("pushed", false);
						   } else {
							   game.speak("The button makes a faint click.\nThe rod begins to glow dimly.  A small rectangle on the side of rod shows the number 5 in bright yellow dots.");
							   this.set_state("pushed", true);
							   this.set_state("countdown", this.fuse_length);
						   }
						   return true;
					   } else {
						   game.speak("You have to pick it up first.");
						   return true;
					   }
				   });
	this.set_state("pushed", false);
	this.fuse_length = 5;
}

Dynamite.prototype = new Noun();

Dynamite.prototype.get_count = function () {
	return this.get_state("pushed") && this.get_state("countdown");
};

Dynamite.prototype.countdown = function () {
	this.set_state("countdown", this.get_count() - 1);
};

Dynamite.prototype.explode = function (game) {
	if (game.player.has_item(this)) {
		game.speak("Kablam!  You are blown into a million pieces!\n\nAll your pieces drift in the wind, and reassemble themselves  on the sidewalk where you started.");
		game.restart();
		game.look();
	} else {
		game.speak("Kablam!  The rod explodes in a powerful blast");
		game.player.room.remove_item(this);
		var r;
		// this is really adhoc.  could we generalize this into some 
		// effect, e.g. KILL on every ANIMATE noun?
		if (r = game.player.room.find_noun("raccoon")) {
			game.speak("The force of the blast knocks the raccoon over the fence.");
			game.player.room.remove_item(r);
		};
	}
};
			
Dynamite.prototype.get_detail = function () {
	return this.get_state("pushed") ?
		"A small rectangle on the side of the rod shows the number " + this.get_count() :
		"At one end there's a push button.";
};

Dynamite.prototype.tick = function (game) {
	if (this.get_state("pushed")) {
		if (this.get_count() == 0) {
			this.explode(game);
		} else {
			if (this.get_count() < this.fuse_length &&
				game.player.has_item(this)) {
					game.speak("The rectangle on the side of the rod now shows the number " + this.get_count());
			}
			this.countdown();
		}
	}
};

exports.Dynamite = Dynamite;
