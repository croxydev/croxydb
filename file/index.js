const langs = ["tr", "en"];

module.exports = {
  setOptions() {
    var adapter = this.adapter || require("../adapters/jsondb");
    this.options = {
    	dbName: this.file || "croxydb",
    	dbFolder: this.folder || "croxydb",
    	noBlankData: this.noBlankData || false,
    	readable: this.readable || false,
    	language: this.lang ? this.lang : "en",
      isMongo: this.mongo,
      mongoOptions: this.mongoOptions || {}
    }
    this.message = this.lang ? require(`../language/${this.lang.toLowerCase()}.json`) : require(`../language/en.json`);
    this.adapter = adapter.set ? adapter : (this.mongo ? new adapter(this.options.mongoOptions) : new adapter(this.options));
    fetch("https://registry.npmjs.org/croxydb/latest").then(async(res) => {
        res.json().then((data) => {
          if(require("../package.json").version !== data.version) {
            console.warn(this.message["errors"]["oldVersion"])
          }
        })
    })
  },

  setLanguage(lang) {
    this.lang = lang ? (langs.includes(lang.toLowerCase()) ? lang.toLowerCase() : "en") : "en";
    this.message = require(`../language/${this.lang.toLowerCase()}.json`);
    this.setOptions();
    return lang;
  },

  setMongo(options) {
    try {
      require("mongoose");
    } catch (error) {
      throw new TypeError("You must install \"mongoose\" to use this adapter.");
    }
    var adapter = require("../adapters/mongo/index");
    this.adapter = adapter;
    this.mongo = true;
    this.mongoOptions = options;
  },

  deleteMongo() {
    var adapter = require("../adapters/jsondb");
    this.adapter = adapter;
    this.mongo = false;
    this.setOptions();
  },

  setAdapter(adapter, options = {}) {
    if(adapter !== "mongo") {
      var adapter = require("../adapters/"+adapter) || require("../adapters/jsondb");
      this.adapter = adapter;
      this.mongo = false;
      this.setOptions();
      return true;
    } else {
      try {
        require("mongoose");
        require("deasync");
      } catch (error) {
        throw new TypeError("You must install \"mongoose\" and \"deasync\" modules to use this adapter.");
      }
      var adapter = require("../adapters/mongo/index");
      this.mongo = true;
      this.adapter = adapter;
      this.mongoOptions = options;
      this.setOptions();
      return adapter;
    }
  },

  setFolder(folder) {
    this.folder = folder;
    this.setOptions();
    return true;
  },

  setFile(file) {
    this.file = file;
    this.setOptions();
    return true;
  },

  setReadable(boolean) {
    this.readable = boolean ? (typeof boolean === "boolean" ? true : false) : false;
    this.setOptions();
    return this.readable;
  },

  setNoBlankData(boolean) {
    this.noBlankData = boolean ? (typeof boolean === "boolean" ? boolean : false) : false;
    this.setOptions();
    return this.noBlankData;
  },
  
  set(db, data) {
    this.setOptions();
  	if(!db) {
      throw new TypeError(this.message["errors"]["blankName"]);
    }

    if(!data) {
      throw new TypeError(this.message["errors"]["blankData"]);
    }

  	return this.adapter.set(db, data);
  },

  get(db) {
    this.setOptions();
    if(!db) {
      throw new TypeError(this.message["errors"]["blankName"]);
    }

    try {
      return this.adapter.get(db);
    } catch(err) {
      return undefined;
    }

  },

  fetch(db) {
    this.setOptions();
    if(!db) {
      throw new TypeError(this.message["errors"]["blankName"]);
    }

    try {
      return this.adapter.get(db);
    } catch(err) {
      return undefined;
    }

  },

  has(db) {
    this.setOptions();
    if(!db) {
      throw new TypeError(this.message["errors"]["blankName"]);
    }

    try {
      return this.adapter.get(db) ? true : false;
    } catch(err) {
      return false;
    }

  },

  delete(db) {
    this.setOptions();
    if(!db) {
      throw new TypeError(this.message["errors"]["blankName"]);
    }

    try {
      return this.adapter.delete(db);
    } catch (err) {
      return false;
    }

  },

  add(db, number) {
    this.setOptions();
    if(!db) {
      throw new TypeError(this.message["errors"]["blankName"]);
    }

    if(!number) {
      throw new TypeError(this.message["errors"]["blankData"]);
    }

    if(isNaN(number)) {
      throw new TypeError(this.message["errors"]["blankNumber"]);
    }

    return this.adapter.add(db, number);

  },

  subtract(db, number) {
    this.setOptions();
    if(!db) {
      throw new TypeError(this.message["errors"]["blankName"]);
    }

    if(!number) {
      throw new TypeError(this.message["errors"]["blankData"]);
    }

    if(isNaN(number)) {
      throw new TypeError(this.message["errors"]["blankNumber"]);
    }

    return this.adapter.subtract(db, number);

  },

  push(db, data) {
    this.setOptions();
  	if(!db) {
      throw new TypeError(this.message["errors"]["blankName"]);
    }

    if(!data) {
      throw new TypeError(this.message["errors"]["blankData"]);
    }

  	return this.adapter.push(db, data);
  },

  unpush(db, data) {
    this.setOptions();
  	if(!db) {
      throw new TypeError(this.message["errors"]["blankName"]);
    }

    if(!data) {
      throw new TypeError(this.message["errors"]["blankData"]);
    }

  	return this.adapter.unpush(db, data);
  },

  delByPriority(db, number) {
    this.setOptions();
    if(!db) {
      throw new TypeError(this.message["errors"]["blankName"]);
    }

    if(!number) {
      throw new TypeError(this.message["errors"]["blankData"]);
    }

    if(isNaN(number)) {
      throw new TypeError(this.message["errors"]["blankNumber"]);
    }

    return this.adapter.delByPriority(db, number);

  },

  setByPriority(db, data, number) {
    this.setOptions();
    if(!db) {
      throw new TypeError(this.message["errors"]["blankName"]);
    }

    if(!data) {
      throw new TypeError(this.message["errors"]["blankData"]);
    }

    if(!number) {
      throw new TypeError(this.message["errors"]["blankData"]);
    }

    if(isNaN(number)) {
      throw new TypeError(this.message["errors"]["blankNumber"]);
    }

    return this.adapter.delByPriority(db, number);

  },

  all() {
    this.setOptions();
  	return this.adapter.all();

  },

  deleteAll() {
    this.setOptions();
  	return this.adapter.deleteAll();

  },

  move(quickDB) {
    console.log("QuickDB to CroxyDB: Started copying database.")
    quickDB.fetchAll().map((data) => {
      this.adapter.set(data.ID, data.data)
      console.log(`QuickDB to CroxyDB: Copied ${data.ID}`)
    })
    return true;
  }

}