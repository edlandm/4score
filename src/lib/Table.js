const A    = require("arare");
const util = require("./util");
const { id, $, $$, makeEl, makeFrag } = util;

const { NUMBER_OF_ROUNDS, NUMBER_OF_QUESTIONS_IN_ROUND } = require("../static/variables");
const numberOfColumns = 1 + NUMBER_OF_ROUNDS * NUMBER_OF_QUESTIONS_IN_ROUND;
class Table {
    constructor(teams=[]) {
        this.teams = teams;
    }

    get teamNames() {
        return this.teams.map(x => x.name);
    }

    makeCell(text="", tag="td") {
        const td = makeEl(tag);
        td.innerHTML = text;
        return td;
    }

    makeRow(team) {
        const tr = makeEl("tr");

        // (first column is the team's name)
        const cells = A.flatten(team.rounds)
            .reduce((result, points) =>
                result.concat(this.makeCell(points)),
                [this.makeCell(team.name)]);

        // append cells to row and return row
        return cells.reduce((row, cell) => {
            row.appendChild(cell);
            return row;
        }, tr);
    }

    makeTable() {
        if(!this.teams.length) return;

        return this.teams.reduce((table, team) => {
            table.appendChild(this.makeRow(team));
            return table;
        }, makeEl("table"));
    }

    makeHeader() {
        return A.zeros(NUMBER_OF_ROUNDS + 1) // plus 1 to line up with team-names
            .reduce((row, _, i) => {
                let text;
                // first column is empty
                if(i !== 0) { text = "Round " + i; }
                row.appendChild(this.makeCell(text, "th"));
                return row;
            }, makeEl("header"));
    }

    emptyMessage() {
        const message = makeEl("p");
        message.innerHTML = "No Teams! Press shift+A to add a new one";
        return message;
    }

    addTeam(team) {
        this.teams.push(team);
        return this;
    }

    isDuplicateTeamName(name) {
        return this.teams.map(x => x.name.toLowerCase()).includes(name.toLowerCase());
    }

    sortByTeamName(desc=true) {
        // sort teams in-place alphabetically by team name
        this.teams.sort((a, b) => {
            const comp = a.name.toLowerCase() > b.name.toLowerCase() ? -1 :  1;
            return desc ? comp : -comp;
        });
    }

    sortByScore(desc=true) {
        // sort teams in-place by total score
        this.teams.sort((a, b) => {
            const diff = a - b;
            return desc ? diff : -diff;
        });
    }
}

module.exports = Table;
