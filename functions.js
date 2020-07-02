const fs = require("fs");
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

module.exports.set = function (path, value, obj) {
    var schema = obj;
    var pList = path.split('.');
    var len = pList.length;
    for(var i = 0; i < len-1; i++) {
        var elem = pList[i];
        if( typeof schema[elem] !== "object" ) schema[elem] = {}
        schema = schema[elem];
    }
    schema[pList[len-1]] = value;
}

Object.prototype.find = function() {
    try {
      return Array.prototype.slice.call(arguments).reduce(function(acc, key) {
        return acc[key]
      }, this)
    }
    catch(e) {
      return 
    }
}

module.exports.delete = function(obj, path) {

    if (!obj || !path) {
      return;
    }
  
    if (typeof path === 'string') {
      path = path.split('.');
    }
  
    for (var i = 0; i < path.length - 1; i++) {
  
      obj = obj[path[i]];
  
      if (typeof obj === undefined) {
        return;
      }
    }
  
    delete obj[path.pop()];
  };

module.exports.fetchFiles = function(dbFolder, dbName) {

    if (!fs.existsSync(dbFolder)){
        fs.mkdirSync(dbFolder);
        if(!fs.existsSync(`${dbFolder}/${dbName}.json`)) {
            fs.writeFile(`${dbFolder}/${dbName}.json`, `{}`, function (err) {
                if (err) throw err;
            })
            return;
        }

    } else {
        if(!fs.existsSync(`${dbFolder}/${dbName}.json`)) {
            fs.writeFile(`${dbFolder}/${dbName}.json`, `{}`, function (err) {
                if (err) throw err;
            })
        }

    }

}

module.exports.removeEmptyData = function (obj) {

  var remove = function(obj) {
    Object.keys(obj).forEach(function(key) {
      if (obj[key] && typeof obj[key] === 'object') remove(obj[key]);
    else if (obj[key] == null || obj[key]== "") delete obj[key];
      if (typeof obj[key] === 'object' && Object.keys(obj[key]).length == 0) delete obj[key];
    });
  }

  Object.keys(obj).forEach(function(key) {
    if (obj[key] && typeof obj[key] === 'object') remove(obj[key]);
  else if (obj[key] == null || obj[key]== "") delete obj[key];
    if (typeof obj[key] === 'object' && Object.keys(obj[key]).length == 0) delete obj[key];
  });

};