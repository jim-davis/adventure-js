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
	execute = function (context, noun) {
		if (context.player.has_item(noun)) {
			context.player.room.add_item(context.player.remove_item(noun));
			context.speak("Dropped.");
		} else {
			context.speak("You are not holding it.");
		}
	};

new Verb("eat",   		 [c.EDIBLE]).
	execute = function (context, noun) {
		context.speak("Yummy");
		// TODO destroy the item
	};

new Verb("extinguish", 	 [c.LIGHTABLE]); // must be lit
new Verb("fix",   		 [c.BREAKABLE]); // must be broken
new Verb("invent",       INTRANSITIVE).
	execute = function (context) {
		context.speak(context.player.describe_inventory());
	};
new Verb("kick",         []);
new Verb("light", 		 [c.LIGHTABLE]).
	execute = function (context, noun) {
		if (noun.get_state("lit")) {
			context.speak("It's already on.");
		} else {
			noun.set_state("lit", true);
			context.speak(noun.definiteNP().capitalize() + " glows brightly.");
		}
	};
	

new Verb("look",       INTRANSITIVE).
	execute = function (context) {
		context.look();
	};

new Verb("open",         [c.DOOR, c.CONTAINER]);

new Verb("read",  		 [c.LEGIBLE]);
new Verb("ride",  		 []);
new Verb("repair",		 [c.BREAKABLE]);
new Verb("shoot", 		 [c.GUN]);		// Fixme SHOOT DWARF is different syntax!

new Verb("take",  		 [c.MOVEABLE]).
	execute = function (context, noun) {
	if (context.player.has_item(noun)) {
		context.speak("You already have it.");
	} else {
		context.player.add_item(context.player.room.remove_item(noun));
		context.speak(util.pick_random(["Taken",
										"You pick up " + noun.definiteNP()]));
	}
	};

new Verb("use",          [c.ANY]).
	execute = function (context, noun) {
		context.speak("Can you be more specific?");
	};

new Verb("throw",  		 [c.ANY]).
	execute = function (context, noun) {
		if (context.player.has_item(noun)) {
			context.player.room.add_item(context.player.remove_item(noun));
			context.speak("Thrown.");
		} else {
			context.speak("You are not holding it.");
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


