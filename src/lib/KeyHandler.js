const A = require("arare");
const Team = require("./Team");
const util  = require("./util");
const { id, $, $$, makeEl, makeFrag, isInArray } = util;

// addTeam :: Event -> Table -> HTML -> bool -> void
// create input for adding new team
const addTeam = (event, table, app, multiple=false) => {
    let newTeamContainer = id("newTeam");
    if(newTeamContainer) { // if an input already exists, focus it
        newTeamContainer.querySelector("input").focus();
        return;
    }

    // remove "No Teams" message
    if(!table.teams.length) {
        $("#app p").outerHTML = "";
    }

    // make input and focus it
    newTeamContainer = app.appendChild(makeEl("div", { id: "newTeam" }))
    newTeamInput     = newTeamContainer
        .appendChild(makeEl("input", { placeholder: "Enter team-name" }));
    newTeamInput.focus();

    // listen for user to either submit (Enter) or exit (Escape) the input
    newTeamInput.addEventListener("keydown", (keydown) => {
        const key = keydown.key
        const tableEl = $("table");

        switch(key) {
            case "Enter":
                // abort if input is empty
                if(!newTeamInput.value || !newTeamInput.value.trim()) return;

                // display error and abort if entry is duplicate
                if(table.isDuplicateTeamName(newTeamInput.value.trim())) {
                    if(!newTeamContainer.querySelector("p.error")) {
                        const errorMessage = makeEl("p", { "class": "error" });
                        errorMessage.innerHTML = "That team already exists";
                        newTeamInput
                            .insertAdjacentHTML("afterend", errorMessage.outerHTML);
                    }
                    return;
                }

                // remove input
                app.removeChild(newTeamContainer);

                // display header
                if(!table.teams.length) {
                    app.appendChild(table.makeHeader());
                }

                const team = new Team(newTeamInput.value.trim());
                table.addTeam(team);

                if(tableEl) {
                    tableEl.appendChild(table.makeRow(team));
                } else {
                    app.appendChild(table.makeTable());
                }

                if(multiple) {
                    addTeam(event, table, app, multiple);
                }
                break;
            case "Escape":
                // remove input
                app.removeChild(newTeamContainer);
                if(!tableEl) {
                    if(table.teams.length) {
                        app.appendChild(table.makeTable());
                    } else {
                        app.innerHTML = table.emptyMessage().outerHTML;
                    }
                }
                break;
            default:
                return;
        }
    });
}

// addTeam :: Event -> Table -> HTML -> -> void
// add teams until <esc> is pressed
const addTeams = (event, table, app) => addTeam(event, table, app, true);

// sortTable :: Event -> Table -> HTML -> string -> bool -> void
// sort Table.teams by a given Table sort method and re-render table
const sortTable = (event, table, app, sortMethod, desc=true) => {
    if(!table.teams.length || table.teams.length <= 1) return;

    // sort table in-place
    table[sortMethod](desc);

    // re-render table
    const tableEl = app.querySelector("table")
    app.removeChild(tableEl);
    app.appendChild(table.makeTable());
}

const actions = {
    addTeam: {
        func: addTeam,
        desc: "add a new team to the bottom of the table"
    },
    addTeams: {
        func: addTeams,
        desc: "add teams until <esc> is pressed"
    },
    sortByTeamNameDesc: {
        func: A.partialRight(sortTable, ["sortByTeamName"]),
        desc: "sort table by names in descending order"
    },
    sortByTeamNameAsc: {
        func: A.partialRight(sortTable, ["sortByTeamName", false]),
        desc: "sort table by names in ascending order"
    },
    sortByScoreDesc: {
        func: A.partialRight(sortTable, ["sortByScore"]),
        desc: "sort table by total scores in descending order"
    },
    sortByScoreAsc: {
        func: A.partialRight(sortTable, ["sortByScore", false]),
        desc: "sort table by total scores in ascending order"
    },
}

const dvorak = {
    "a": "addTeam",
    "A": "addTeams",
    ",": "sortByTeamNameDesc",
    "<": "sortByScoreDesc",
    ".": "sortByTeamNameAsc",
    ">": "sortByScoreAsc",
}

const keyMaps = {
    default: dvorak,
    dvorak
}

const isIgnoreKey = isInArray([ "Shift", "Alt", "Control" ]);
const isTagInput  = (tagName) => /[input|textarea|select]/i.test(tagName);

class KeyHandler {
    constructor(keyMap) {
        this._dict = keyMap;
    }

    do(app, table, event) {
        const { key, target } = event;

        // abort if we don't like the key pressed or if we're typing in an input
        if(isIgnoreKey(key) || isTagInput(target.tagName)) return;

        // if we have an action mapped to this key, do the action, else do nothing
        const action = actions[this._dict[key]];
        if(action) {
            event.preventDefault();
            action.func(event, table, app);
        }
    }
}

module.exports = {
    keyMaps,
    KeyHandler
};
