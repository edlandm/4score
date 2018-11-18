const A = require("arare");
const id   = document.getElementById.bind(document);
const $    = document.querySelector.bind(document);
const $$   = document.querySelectorAll.bind(document);
const makeEl   = (tag) => document.createElement(tag);
const makeFrag = () => document.createDocumentFragment();

const isInArray = A.curry((arr, val) => arr.indexOf(val) > -1);

module.exports = {
    id,
    $,
    $$,
    makeEl,
    makeFrag,
    isInArray
};
