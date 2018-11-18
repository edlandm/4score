const A     = require("arare");
const Table = require("./lib/Table");
const Team  = require("./lib/Team");
const { KeyHandler, keyMaps } = require("./lib/KeyHandler")
const util  = require("./lib/util");
const { id, $, $$, makeEl, makeFrag, isInArray } = util;

const app = id("app");

const table = new Table()
app.appendChild(table.makeHeader());
app.appendChild(table.makeTable());

// event listeners
const keyHandler = new KeyHandler(keyMaps.default);
doAction = A.partial(keyHandler.do.bind(keyHandler), [app, table]);
document.addEventListener("keydown", doAction);
