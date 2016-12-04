const verb = require("./verb.js");
const c = require("./categories.js");
const util = require("./util.js");

const Verb = verb.Verb;
const Motion = verb.Motion;
const Verbs = verb.Verbs;
const INTRANSITIVE = null;

new Verb("break",		 [c.BREAKABLE]);
new Verb("drink", 		 [c.LIQUID]);
new Verb("drop",  		 [c.ANY]).
	execute = function (game, noun) {
		if (game.player.has_item(noun)) {
			game.player.room.add_item(game.player.remove_item(noun));
			game.speak("Dropped.");
		} else {
			game.speak("You are not holding it.");
		}
	};

new Verb("eat",   		 [c.EDIBLE]).
	execute = function (game, noun) {
		game.speak("Yummy");
		// TODO destroy the item
	};

new Verb("extinguish", 	 [c.LIGHTABLE]); // must be lit
new Verb("fix",   		 [c.BREAKABLE]); // must be broken
new Verb("invent",       INTRANSITIVE).
	execute = function (game) {
		game.speak(game.player.describe_inventory());
	};
new Verb("kick",         []);
new Verb("light", 		 [c.LIGHTABLE]).
	execute = function (game, noun) {
		if (noun.get_state("lit")) {
			game.speak("It's already on.");
		} else {
			noun.set_state("lit", true);
			game.speak(noun.definiteNP().capitalize() + " glows brightly.");
		}
	};
	

new Verb("look",       INTRANSITIVE).
	execute = function (game) {
		game.look(true);
	};

new Verb("open",         [c.DOOR, c.CONTAINER]);

new Verb("read",  		 [c.LEGIBLE]);
new Verb("ride",  		 []);
new Verb("repair",		 [c.BREAKABLE]);
new Verb("shoot", 		 [c.GUN]);		// Fixme SHOOT DWARF is different syntax!

new Verb("take",  		 [c.MOVEABLE]).
	execute = function (game, noun) {
	if (game.player.has_item(noun)) {
		game.speak("You already have it.");
	} else {
		game.player.add_item(game.player.room.remove_item(noun));
		game.speak(util.pick_random(["Taken",
										"You pick up " + noun.definiteNP()]));
	}
	};

new Verb("use",          [c.ANY]).
	execute = function (game, noun) {
		game.speak("Can you be more specific?");
	};

new Verb("throw",  		 [c.ANY]).
	execute = function (game, noun) {
		if (game.player.has_item(noun)) {
			game.player.room.add_item(game.player.remove_item(noun));
			game.speak("Thrown.");
		} else {
			game.speak("You are not holding it.");
		}
	};

new Verb("xyzzy",       INTRANSITIVE);

new Verb("wave",  		 [c.ANY]);

new Motion("climb");
new Motion("crawl");
new Motion("go");
new Motion("jump");
new Motion("run");
new Motion("skip");
new Motion("walk");


