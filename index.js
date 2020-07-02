const functions = require("./functions.js");
const langs = ["tr", "en"];
const fs = require("fs");

class CroxyDB {
  constructor(options) {

    this.dbName = options["dbName"];
    this.dbFolder = options["dbFolder"];
    this.noBlankData = options["noBlankData"] ? (typeof options["noBlankData"] == "boolean" ? options["noBlankData"] : false) : false;
    this.readable = options["readable"] ? (typeof options["readable"] == "boolean" ? true : false) : false;
    this.lang = options["language"] ? (langs.includes(options["language"].toLowerCase()) ? options["language"].toLowerCase() : "en") : "en";
    this.message = require(`./language/${this.lang.toLowerCase()}.json`);

    functions.fetchFiles(this.dbFolder, this.dbName)
  }
  
  set(db, data) {
    functions.fetchFiles(this.dbFolder, this.dbName)

    if(!db) throw new TypeError(this.message["errors"]["blankName"])
    if(!data) throw new TypeError(this.message["errors"]["blankData"])

    const content = JSON.parse(fs.readFileSync(`${this.dbFolder}/${this.dbName}.json`, 'utf8'));
    functions.set(db, data, content)

    if(this.readable) {
      fs.writeFileSync(`${this.dbFolder}/${this.dbName}.json`, JSON.stringify(content, null, 2));
    } else {
      fs.writeFileSync(`${this.dbFolder}/${this.dbName}.json`, JSON.stringify(content));
    }
    return this.get(db);
    
  }

  get(db) {

    if(!db) throw new TypeError(this.message["errors"]["blankName"])

    const content = JSON.parse(fs.readFileSync(`${this.dbFolder}/${this.dbName}.json`, 'utf8'));

    return content.find(...db.split("."));

  }

  has(db) {

    if(!db) throw new TypeError(this.message["errors"]["blankName"])

    const content = JSON.parse(fs.readFileSync(`${this.dbFolder}/${this.dbName}.json`, 'utf8'));

    return content.find(...db.split(".")) ? true : false;

  }

  delete(db) {
    functions.fetchFiles(this.dbFolder, this.dbName)

    if(!db) throw new TypeError(this.message["errors"]["blankName"])

    const content = JSON.parse(fs.readFileSync(`${this.dbFolder}/${this.dbName}.json`, 'utf8'));

    if(!this.get(db)) return false;

    functions.delete(content, db)

    if(this.noBlankData == true) {
      functions.removeEmptyData(content)
    }
    
    if(this.readable) {
      fs.writeFileSync(`${this.dbFolder}/${this.dbName}.json`, JSON.stringify(content, null, 2));
    } else {
      fs.writeFileSync(`${this.dbFolder}/${this.dbName}.json`, JSON.stringify(content));
    }

    return true;
  }

  add(db, number) {
    
    if(!db) throw new TypeError(this.message["errors"]["blankName"])
    if(!db) throw new TypeError(this.message["errors"]["blankData"])
    if(isNaN(number)) throw new TypeError(this.message["errors"]["blankNumber"])

    this.set(db, Number(this.get(db) ? (isNaN(this.get(db)) ? number : this.get(db)+number) : number))
    
    return this.get(db)

  }

  subtract(db, number) {
    
    if(!db) throw new TypeError(this.message["errors"]["blankName"])
    if(!number) throw new TypeError(this.message["errors"]["blankData"])
    if(isNaN(number)) throw new TypeError(this.message["errors"]["blankNumber"])

    if(this.get(db)-number <= 1) return this.delete(db);

    if(!this.get(db)) return this.delete(db)

    this.set(db, this.get(db) ? (this.get(db)-number <= 1 ? 1 : (isNaN(this.get(db)) ? 1 : this.get(db)-number) || 1) : 1)
    
    return this.get(db)

  }

  push(db, data) {

    if(!db) throw new TypeError(this.message["errors"]["blankName"])
    if(!data) throw new TypeError(this.message["errors"]["blankData"])

    var arr = [];
    if(this.get(db)) arr = this.get(db);
    arr.push(data)

    this.set(db, arr)

    return this.get(db);

  }

  unpush(db, data) {

    if(!db) throw new TypeError(this.message["errors"]["blankName"])
    if(!data) throw new TypeError(this.message["errors"]["blankData"])

    var arr = [];
    if(this.get(db)) arr = this.get(db);
    arr = arr.filter(x=>x!==data)

    this.set(db, arr)

    return this.get(db);

  }

  delByPriority(data, number) {

    if(!data) throw new TypeError(this.message["errors"]["blankName"])
    if(!number) throw new TypeError(this.message["errors"]["blankNumber"])
    if(isNaN(number)) throw new TypeError(this.message["errors"]["blankNumber"])

    if(!this.get(data) || this.get(data).length < 1) return false;

    let content = this.get(data);
    let neww = [];

    if (typeof content !== "object") return false;

    for (let a = 0; a < content.length; a++)
      if (a != (number - 1)) neww.push(content[a]);

    this.set(data, neww);
    return this.get(data);

  }

  setByPriority(data, value, number) {

    if(!data) throw new TypeError(this.message["errors"]["blankName"])
    if(!value) throw new TypeError(this.message["errors"]["blankData"])
    if(!number) throw new TypeError(this.message["errors"]["blankNumber"])
    if(isNaN(number)) throw new TypeError(this.message["errors"]["blankNumber"])

    if(!this.get(data) || this.get(data).length < 1) return false;

    let content = this.get(data);
    let neww = [];

    if (typeof content !== "object") return false;

    for (let a = 0; a < content.length; a++) {
      let val = content[a]

      if(a == (number - 1)) {
        neww.push(value)
      } else {
        neww.push(val)
      }
    }

    this.set(data, neww);
    return this.get(data);

  }

  all() {
    const content = JSON.parse(fs.readFileSync(`${this.dbFolder}/${this.dbName}.json`, 'utf8'));

    return content;
  }

  deleteAll() {

    fs.writeFileSync(`${this.dbFolder}/${this.dbName}.json`, JSON.stringify({}, null, 2));

    return true;

  }

}

module.exports = CroxyDB;
