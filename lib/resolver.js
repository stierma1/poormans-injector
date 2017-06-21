var EE = require("events").EventEmitter;
var fs = require("fs");
var request = require("request");

class Resolver extends EE{
  constructor({logger}){
    super();
    this.data = {};
    this.logger = logger;
  }

  logError(msg){
    if(this.logger){
      this.logger.error(msg);
    }
  }

  getPropertiesList(){
    var props = [];
    for(var i in this.data){
      props.push({key:i, value:this.data[i]})
    }
    return props;
  }
}

class JsonPropertiesResolver extends Resolver{
  constructor({pollInterval, filePath, fileEncoding, logger}){
    super({logger});
    this.filePath = filePath;
    this.fileEncoding = fileEncoding;
    this.pollInterval = pollInterval;
    this.interval = null;
    if(this.pollInterval){
      this.interval = setInterval(() => {
        this.fetchData();
      }, this.pollInterval)
    }
    this.fetchData();
  }

  fetchData(){
    try{
      var file = fs.readFileSync(this.filePath, this.fileEncoding || "utf8");
      this.data = JSON.parse(file);
      this.emit("update", this.getPropertiesList());
    } catch(err){
      this.logError(err.message);
    }
  }
}

class JsonPropertiesAsyncResolver extends Resolver{
  constructor({pollInterval, filePath, fileEncoding, logger}){
    super({logger});
    this.filePath = filePath;
    this.fileEncoding = fileEncoding;
    this.pollInterval = pollInterval;
    this.interval = null;
    if(this.pollInterval){
      this.interval = setInterval(() => {
        this.fetchData();
      }, this.pollInterval)
    }
    this.fetchData();
  }

  fetchData(){
    try{
      fs.readFile(this.filePath, this.fileEncoding || "utf8", (err, file) => {
        if(err){
          this.logError(err.message);
          return;
        }
        this.data = JSON.parse(file);
        this.emit("update", this.getPropertiesList());
      });
    } catch(err){
      this.logError(err.message);
    }
  }

}

class HTTPResolver extends Resolver{
  constructor({pollInterval, url, logger}){
    super({logger});
    this.filePath = url;
    this.pollInterval = pollInterval;
    this.interval = null;
    if(this.pollInterval){
      this.interval = setInterval(() => {
        this.fetchData();
      }, this.pollInterval)
    }
    this.fetchData();
  }

  fetchData(){
    try{
      request.get(url, (err, resp, body) => {
        if(err){
          this.logError(err.message);
          return;
        }
        try{
          this.data = JSON.parse(body);
        } catch(err){
          this.logError(err.message);
          return;
        }
        this.emit("update", this.getPropertiesList());
      })
    } catch(err){
      this.logError(err.message);
    }
  }
}

module.exports = {
  Resolver:Resolver,
  JsonPropertiesResolver:JsonPropertiesResolver,
  JsonPropertiesAsyncResolver: JsonPropertiesAsyncResolver,
  HTTPResolver: HTTPResolver
}
