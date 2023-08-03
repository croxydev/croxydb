"use strict";
const Base = require("./Base");
const Schema = require("./Schema");
const deasync = require("deasync");

class MongoDB extends Base {
	constructor(options) {
        super(options["url"])

        this.schema = Schema(options["schema"])
	}

	set(db, data) {
    if(!db) {
        throw new TypeError(this.message["errors"]["blankName"]);
    }

    if(!data) {
        throw new TypeError(this.message["errors"]["blankData"]);
    }
    
    return deasync(async (cb) => {
      let content = await this.schema.findOne({ key: db });


      if (!content) {
          let _data = new this.schema({
              key: db,
              value: data
          });

          await _data.save().catch(e => {
              return this.emit("error", e);
          });

          cb(null, this.get(db));

      } else {
          await content.updateOne({ value: data })
          cb(null, this.get(db));
      }
    })();
}

set(db, data) {

        if(!db) {
            throw new TypeError(this.message["errors"]["blankName"]);
        }

        if(!data) {
            throw new TypeError(this.message["errors"]["blankData"]);
        }
        
        return deasync(async (cb) => {
          let content = await this.schema.findOne({
              key: db
          });

          if (!content) {
              let _data = new this.schema({
                  key: db,
                  value: data
              });

              await _data.save().catch(e => {
                  return this.emit("error", e);
              });
              cb(null, data);

          } else {
                await this.schema.findOneAndUpdate({
                  key: db
              },
              {
                value: data
              });
              
              cb(null, data);
          }
        })();
  }

  get(db) {

    if(!db) {
        throw new TypeError(this.message["errors"]["blankName"]);
    }
    
    return deasync(async (cb) => {
      let content = await this.schema.findOne({
          key: db
      });
      if(!content) return cb(null, undefined)
      cb(null, content.value);

    })();
}

  fetch(db) {

    return this.get(db);

  }

  has(db) {

    if(!db) {
      throw new TypeError(this.message["errors"]["blankName"]);
    }

    var data = this.get(db);
    if(data !== undefined) {
      return true;
    } else {
      return false;
    }

  }

  delete(db) {
    if(!db) {
      throw new TypeError(this.message["errors"]["blankName"]);
    }
  
    return deasync(async (cb) => {

      let content = await this.schema.findOneAndDelete({
          key: db
      });

      cb(null, true);

    })();
  }

  add(db, number) {
    
    if(!db) {
      throw new TypeError(this.message["errors"]["blankName"]);
    }

    if(!number) {
        throw new TypeError(this.message["errors"]["blankNumber"]);
    }

    if(isNaN(number)) {
      throw new TypeError(this.message["errors"]["blankNumber"]);
    }
    
    return deasync(async (cb) => {
      let content = await this.schema.findOne({
          key: db
      });

      if (!content) {
          let _data = new this.schema({
              key: db,
              value: number
          });

          await _data.save().catch(e => {
              return this.emit("error", e);
          });
          cb(null, number);

      } else {
            await this.schema.findOneAndUpdate({
              key: db
          },
          { $inc : {value : number} });
          
          cb(null, content.value + number);
      }
    })();

  }

  subtract(db, number) {
    
    if(!db) {
      throw new TypeError(this.message["errors"]["blankName"]);
    }

    if(!number) {
      throw new TypeError(this.message["errors"]["blankData"]);
    }

    if(isNaN(number)) {
      throw new TypeError(this.message["errors"]["blankNumber"]);
    }

    return this.add(db, parseInt(`-${number}`))

  }

  push(db, data) {

    if(!db) {
      throw new TypeError(this.message["errors"]["blankName"]);
    }

    if(!data) {
      throw new TypeError(this.message["errors"]["blankData"]);
    }

    var arr = [];

    if(this.get(db)) {
      if(typeof this.get(db) !== "object") {
        arr = [];
      } else {
        arr = this.get(db);
      }
    }

    arr.push(data);

    this.set(db, arr);

    return this.get(db);

  }

  unpush(db, data) {

    if(!db) {
      throw new TypeError(this.message["errors"]["blankName"]);
    }

    if(!data) {
      throw new TypeError(this.message["errors"]["blankData"]);
    }

    var arr = [];

    if(this.get(db)) {
      arr = this.get(db);
    }

    arr = arr.filter((x) => x !== data);

    this.set(db, arr);

    return this.get(db);

  }

  delByPriority(db, number) {

    if(!db) {
      throw new TypeError(this.message["errors"]["blankData"]);
    }

    if(!number) {
      throw new TypeError(this.message["errors"]["blankNumber"]);
    }

    if(isNaN(number)) {
      throw new TypeError(this.message["errors"]["blankNumber"]);
    }

    if(!this.get(db) || this.get(db).length < 1) {
      return false;
    }

    let content = this.get(db);
    let neww = [];

    if (typeof content !== "object") {
      return false;
    }

    for (let a = 0; a < content.length; a++) {
      if (a !== (number-1)) {
        neww.push(content[`${a}`]);
      }
    }

    this.set(db, neww);
    return this.get(db);

  }

  setByPriority(db, data, number) {

    if(!db) {
      throw new TypeError(this.message["errors"]["blankData"]);
    }

    if(!data) {
      throw new TypeError(this.message["errors"]["blankData"]);
    }

    if(!number) {
      throw new TypeError(this.message["errors"]["blankNumber"]);
    }

    if(isNaN(number)) {
      throw new TypeError(this.message["errors"]["blankNumber"]);
    }

    if(!this.get(db) || this.get(db).length < 1) {
      return false;
    }

    let content = this.get(db);
    let neww = [];

    if (typeof content !== "object") {
      return false;
    }

    for (let a = 0; a < content.length; a++) {
      let val = content[`${a}`];

      if(a === (number-1)) {
        neww.push(data);
      } else {
        neww.push(val);
      }
    }

    this.set(db, neww);
    return this.get(db);

  }

  all() {
    return deasync(async (cb) => {
      let content = await this.schema.find({});

      cb(null, content);

    })();
  }

  deleteAll() {

    return deasync(async (cb) => {
      await this.schema.deleteMany();

      cb(null, {});

    })();

  }

}

module.exports = MongoDB;