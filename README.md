# CroxyDB

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/12341481f7db44c291844ab1d97cf602)](https://app.codacy.com/manual/CroxyTheDev/croxydb?utm_source=github.com&utm_medium=referral&utm_content=CroxyTheDev/croxydb&utm_campaign=Badge_Grade_Dashboard)

> a JSON database module

Examples

```js
const croxy = require("croxydb")
const db = new croxy({
    "dbName": "test", // Our DB file name.
    "dbFolder": "database", // Our DB folder name.
    "noBlankData": true,
    "readable": true,
    "language": "en" // You can write "tr" or "en".
})

db.set("x.y.z", "abc") // abc

db.get("x") // {y: {z: "abc"}}
db.all() // {x: {y: {z: "abc"}}}

db.push("a", "hello") //  ["hello"]
db.push("a", "world") //  ["hello", "world"]
db.unpush("a", "hello") // ["world"]

db.push("b", {test: "croxydb"}) // [{test: "croxydb"}]
db.push("b", {test2: "croxydb2"}) // [{test: "croxydb"}, {test2: "croxydb2"}]
db.delByPriority("b", 1) // [{test2: "croxydb"}]
db.setByPriority("b", {newtest:"hey this is edited"} 1) // [{newtest:"hey this is edited"}]

db.delete("x") // true
db.deleteAll() // true
```

