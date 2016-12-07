const verb = require("./verb.js");
const c = require("./categories.js");
const util = require("./util.js");

const Verb = verb.Verb;
const Motion = verb.Motion;
const Verbs = verb.Verbs;

function nothing_special (game) {
	game.speak("Nothing special happens.");
}

new Verb("break", [c.BREAKABLE], nothing_special);

new Verb("drink", [c.LIQUID], 
		 function (game, noun) {
			 if (game.player.has_item(noun)) {
				 game.player.remove_item(noun);
			 }
			 if (game.player.room.has_item(noun)) {
				 game.player.room.remove_item(noun);
			 }
			 game.speak("Gulp!");
		 });

new Verb("die", [c.INTRANSITIVE],
		 function (game) {
			 game.clear();
			 game.load();
		 });

new Verb("drop", [c.ANY], 
		 function (game, noun) {
			 if (game.player.has_item(noun)) {
				 game.player.room.add_item(game.player.remove_item(noun));
				 game.speak("Dropped.");
			 } else {
				 game.speak("You are not holding it.");
			 }
		 });

new Verb("eat", [c.EDIBLE],
		 function (game, noun) {
			 if (game.player.has_item(noun)) {
				 game.player.remove_item(noun);
			 }
			 if (game.player.room.has_item(noun)) {
				 game.player.room.remove_item(noun);
			 }
			 game.speak("Yummy");
		 });

new Verb("extinguish", [c.LIGHTABLE],
		 nothing_special);

new Verb("fix", [c.BREAKABLE], nothing_special);

new Verb("invent", [c.INTRANSITIVE],
		 function (game) {
			 game.speak(game.player.describe_inventory());
		 });

new Verb("kick", [], nothing_special);

new Verb("light", [c.LIGHTABLE],
		  function (game, noun) {
			  if (noun.get_state("lit")) {
				  game.speak("It's already on.");
			  } else {
				  noun.set_state("lit", true);
				  game.speak(noun.definiteNP().capitalize() + " glows brightly.");
			  }
		  });


 new Verb("look", [c.ANY, c.INTRANSITIVE],
		  function (game, noun) {
			  if (noun == null) {
				  game.look(true);
			  } else {
				  game.speak(noun.get_detail());
			  }
		  });

 new Verb("open", [c.DOOR, c.CONTAINER], 
		  nothing_special);

 new Verb("read", [c.LEGIBLE], nothing_special);

 new Verb("ride", [], nothing_special);

 new Verb("repair", [c.BREAKABLE], nothing_special);

 new Verb("shoot", [c.GUN], nothing_special);

 new Verb("take", [c.MOVEABLE],
		  function (game, noun) {
			  if (game.player.has_item(noun)) {
				  game.speak("You already have it.");
			  } else {
				  game.player.add_item(game.player.room.remove_item(noun));
				  game.speak(util.pick_random(["Taken", 
											   "You pick up " + noun.definiteNP()]));
			  }
		  });

new Verb("use", [c.ANY], 
		 function (game, noun) {
			 game.speak("Can you be more specific?");
			 
		 });
		 
new Verb("throw", [c.ANY], 
		 function (game, noun) {
			 if (game.player.has_item(noun)) {
				 game.player.room.add_item(game.player.remove_item(noun));
				 game.speak("Thrown.");
			 } else {
				 game.speak("You are not holding it.");
			 }
		 });

new Verb("xyzzy", [c.INTRANSITIVE], nothing_special);

new Verb("wave", [c.ANY], nothing_special);
		 

new Motion("climb");
new Motion("crawl");
new Motion("go");
new Motion("jump");
new Motion("run");
new Motion("skip");
new Motion("walk");
