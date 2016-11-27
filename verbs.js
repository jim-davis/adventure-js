const verb = require("./verb.js");
const c = require("./categories.js");

const Verb = verb.Verb;
const Verbs = verb.Verbs;

new Verb("break", [c.BREAKABLE]);
new Verb("drink", [c.LIQUID]);
new Verb("eat",   [c.EDIBLE]);
new Verb("fix",   [c.BREAKABLE]);
new Verb("light", [c.LIGHTABLE]);
new Verb("read",  [c.LEGIBLE]);
new Verb("repair",[c.BREAKABLE]);
new Verb("shoot", [c.GUN]);		// Fixme SHOOT DWARF is different syntax!
new Verb("take",  [c.ANY]);
new Verb("wave",  [c.ANY]);

console.log(Verbs.find("fix").conjugate(true));
