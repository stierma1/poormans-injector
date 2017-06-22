var funcRegex = /^function\s*([a-zA-Z0-9_\$]*)\s*\(\{([a-zA-Z0-9_\$\,\s]*)\}.*/
var classRegex = /^class\s*([a-zA-Z0-9_\$]+)\s*\{\s*constructor\s*\(\{([a-zA-Z0-9_\$\,\s]*)\}.*/
var Optional = require("./optional");

class Injector{
  constructor({injectorDependencies}, defaultToGlobal){
    this.injectorDependencies = injectorDependencies || {};
    this.defaultToGlobal = defaultToGlobal;
    this.localDependencies = {};
  }

  add(key, data){
    this.localDependencies[key] = new Optional(data);
    return this;
  }

  addOrUpdate(key, data){
    if(this.localDependencies[key] instanceof Optional){
      this.localDependencies[key].update(data);
    } else {
      this.add(key, data);
    }
    return this;
  }

  addGlobal(key, data){
    this.injectorDependencies[key] = new Optional(data);
    return this;
  }

  addOrUpdateGlobal(key, data){
    if(this.injectorDependencies[key] instanceof Optional){
      this.injectorDependencies[key].update(data);
    } else {
      this.addGlobal(key, data);
    }
    return this;
  }

  addFromPropsList(propsList){
    for(var prop of propsList){
      this.add(prop.key, prop.value);
    }
  }

  addGlobalFromPropsList(propsList){
    for(var prop of propsList){
      this.addGlobal(prop.key, prop.value);
    }
  }

  inject(func, runtimeParams){
    var rtParams = {};
    var {isClass, name, params} = Injector.parseParams(func.toString());
    for(var param of params){
      rtParams[param] = this.injectorDependencies[param];
      if(this.localDependencies[param]){
        rtParams[param] = this.localDependencies[param];
      }
      if(!rtParams[param]){
        if(this.defaultToGlobal){
          this.addGlobal(param, undefined);
          rtParams[param] = this.injectorDependencies[param];
        } else{
          this.add(param, undefined);
          rtParams[param] = this.localDependencies[param];
        }
      }
      if(runtimeParams[param] !== undefined){
        rtParams[param] = new Optional(runtimeParams[param])
      }
    }
    if(isClass){
      return new func(rtParams);
    }
    return func(rtParams);
  }

  injectData(func, runtimeParams){
    var rtParams = {};
    var {isClass, name, params} = Injector.parseParams(func.toString());
    for(var param of params){
      rtParams[param] = this.injectorDependencies[param];
      if(this.localDependencies[param]){
        rtParams[param] = this.localDependencies[param];
      }
      if(!rtParams[param]){
        if(this.defaultToGlobal){
          this.addGlobal(param, undefined);
          rtParams[param] = this.injectorDependencies[param];
        } else{
          this.add(param, undefined);
          rtParams[param] = this.localDependencies[param];
        }
      }
      if(runtimeParams[param] !== undefined){
        rtParams[param] = new Optional(runtimeParams[param])
      }
      rtParams[param] = rtParams[param].get();
    }
    if(isClass){
      return new func(rtParams);
    }
    return func(rtParams);
  }

  static parseParams(funcString){
    var match = funcRegex.exec(funcString);
    if(match){
      return {isClass:false, name:match[1], params: match[2].split(",").map((param) => {
        return param.trim();
      }).filter((param) => {
        return param !== '';
      })};
    }
    match = classRegex.exec(funcString);

    if(match){
      return {isClass:true, name:match[1], params: match[2].split(",").map((param) => {
        return param.trim();
      }).filter((param) => {
        return param !== '';
      })};
    }
  }
}

module.exports = Injector;
