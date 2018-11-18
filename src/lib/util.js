const A = require("arare");
const id   = document.getElementById.bind(document);
const $    = document.querySelector.bind(document);
const $$   = document.querySelectorAll.bind(document);
const makeFrag = () => document.createDocumentFragment();

const makeEl   = (tag, attrs={}) => {
    const el = document.createElement(tag);
    Object.keys(attrs).forEach(key => el.setAttribute(key, attrs[key]));
    return el;
}


const isInArray = A.curry((arr, val) => arr.indexOf(val) > -1);

module.exports = {
    id,
    $,
    $$,
    makeEl,
    makeFrag,
    isInArray
};
