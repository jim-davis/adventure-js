const ActiveNoun = require("./active-noun.js").ActiveNoun;
const c = require("./categories.js");

function Dynamite () {
	ActiveNoun.call(this, "rod", [c.MOVEABLE],
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
							   this.set_state("countdown", 5);
						   }
						   return true;
					   }
				   });
}

Dynamite.prototype = new ActiveNoun();

exports.Dynamite = Dynamite;
