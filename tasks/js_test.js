a = null || []



function validNum(age){
    if (!age || typeof age != 'number' || !Number.isInteger(age)) return false;
    return true;
}
// parseINT(price)
// console.log(validNum("14"))



const person = require("./person.js")
console.log(person)