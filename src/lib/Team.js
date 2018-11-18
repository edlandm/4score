const A = require("arare");
const { comp, sum, flatten, map } = A;

const { NUMBER_OF_ROUNDS, NUMBER_OF_QUESTIONS_IN_ROUND } = require("../static/variables");

const Round = () => {
    return A.zeros(NUMBER_OF_QUESTIONS_IN_ROUND);
}

const intOrZero = x => parseInt(x) || 0;
const sumOfRound = comp(sum, map(intOrZero));
const getRoundTotals = comp(flatten, map(sumOfRound));

class Team {
    constructor(name) {
        this.name = name;
        this.rounds = Array.apply(null, Array(NUMBER_OF_ROUNDS))
            .map(_ => Round())
    }

    get total() {
        return sum(getRoundTotals(this.rounds));
    }

    get halfTimeTotal() {
        const firstHalf = Math.floor(this.rounds.length / 2);
        return sum(getRoundTotals(this.rounds.slice(0, firstHalf)));
    }
}

module.exports = Team;
