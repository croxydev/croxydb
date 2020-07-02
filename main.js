const test = require("./index.js");
const db = new test({
    "dbName": "test",
    "dbFolder": "database",
    "noBlankData": true,
    "readable": true,
    "language": "tr"
})

console.log(db.set("x.y.z", "abc"))