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
			console.log("Dropped.");
		} else {
			console.log("You are not holding it.");
		}
	};

new Verb("eat",   		 [c.EDIBLE]).
	execute = function (context, noun) {
		console.log("Yummy");
		// TODO destroy the item
	};

new Verb("extinguish", 	 [c.LIGHTABLE]); // must be lit
new Verb("invent",       INTRANSITIVE).
	execute = function (context) {
		console.log(context.player.describe_inventory());
	};

new Verb("fix",   		 [c.BREAKABLE]); // must be broken
new Verb("light", 		 [c.LIGHTABLE]); // must not be lit

new Verb("look",       INTRANSITIVE).
	execute = function (context) {
		console.log(context.player.room.describe());
	};

new Verb("read",  		 [c.LEGIBLE]);
new Verb("ride",  		 []);
new Verb("repair",		 [c.BREAKABLE]);
new Verb("shoot", 		 [c.GUN]);		// Fixme SHOOT DWARF is different syntax!

(new Verb("take",  		 [c.ANY])).
	execute = function (context, noun) {
	if (context.player.has_item(noun)) {
		console.log("You already have it.");
	} else {
		context.player.add_item(context.player.room.remove_item(noun));
		console.log(util.pick_random(["Taken",
									  "You pick up " + noun.definiteNP()]));
	}
};

new Verb("wave",  		 [c.ANY]);

new Motion("climb");
new Motion("go");
new Motion("jump");
new Motion("walk");
