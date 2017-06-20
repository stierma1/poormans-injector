var EE = require("events").EventEmitter;

class Optional extends EE{
  constructor(data){
    super();
    this.data = data;
    if(data instanceof Optional){
      this.data = data.data;
    }
  }

  get(){
    return this.data;
  }

  exists(){
    return this.data !== undefined
  }

  update(data){
    this.data = data;
    this.emit("update");
  }
}

module.exports = Optional;
