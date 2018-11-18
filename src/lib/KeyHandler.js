const A = require("arare");
const Team = require("./Team");
const util  = require("./util");
const { id, $, $$, makeEl, makeFrag, isInArray } = util;

const addTeam = (event, table, app) => { // create input for adding new team
        event.preventDefault();
        let newTeamInput = id("newTeam");
        if(newTeamInput) { // if an input already exists, focus it
            newTeamInput.focus();
            return;
        }

        // remove "No Teams" message
        if(!table.teams.length) $("header~p").outerHTML = "";

        // make input
        const inp = makeEl("input");
        inp.setAttribute("placeholder", "Enter team-name");
        inp.setAttribute("id", "newTeam")
        app.appendChild(inp);

        // focus input
        newTeamInput = id("newTeam");
        newTeamInput.focus();

        // listen for user to either submit (Enter) or exit (Escape) the input
        newTeamInput.addEventListener("keydown", (keydown) => {
            const key = keydown.key
            const tableEl = $("table");

            const isKeyWeCareAbout = isInArray([ "Enter", "Escape" ]);
            if(!isKeyWeCareAbout(key)) return // abort

            // continue
            // remove input
            newTeamInput.parentNode.removeChild(newTeamInput);

            if(key === "Enter") {
                const team = new Team(newTeamInput.value);

                table.addTeam(team);
                if(tableEl) {
                    tableEl.appendChild(table.makeRow(team));
                    return;
                }
                app.append(table.makeTable());
            } else if(key === "Escape") {
                if(!tableEl) app.appendChild(table.makeTable());
            }
        });
}

const actions = {
    addTeam: {
        func: addTeam,
        desc: "add a new team to the bottom of the table"
    }
}

const keyMap = {
    A: "addTeam"
}

const keyMaps = {
    default: keyMap
}

const isIgnoreKey = isInArray([ "Shift", "Alt", "Control" ]);
const isTagInput = (tagName) => /[input|textarea|select]/i.test(tagName);

class KeyHandler {
    constructor(keyMap) {
        this._dict = keyMap;
    }

    do(app, table, event) {
        const { key, target } = event;

        // abort if we don't like the key pressed or if we're typing in an input
        if(isIgnoreKey(key) || isTagInput(target.tagName)) return;

        // if we have an action mapped to this key, do the action, else do nothing
        const action = actions[this._dict[key]]
            ? actions[this._dict[key]].func
            : A.id;
        action(event, table, app);
    }
}

module.exports = {
    keyMaps,
    KeyHandler
};
