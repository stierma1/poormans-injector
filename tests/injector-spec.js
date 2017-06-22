
var chai = require("chai");
var expect = chai.expect;
var Injector = require("../lib/injector");
var Optional = require("../lib/optional");

describe("Injector tests", () => {
  class MockClass{
    constructor({val1, val_2$}){
      this.val1 = val1;
      this.val_2$ = val_2$;
    }
  }

  function mockFunction({val1, val_2$}){
    return {val1, val_2$};
  }

  async function mockAsyncFunction({val1, val_2$}){
    return {val1, val_2$};
  }

  it("should construct", () => {
    var injector = new Injector({});
    expect(injector).instanceof(Injector);
  })

  it("should add property", () => {
    var injector = new Injector({});
    expect(injector).instanceof(Injector);
    injector.add("newKey", "newValue");
    expect(injector.localDependencies["newKey"]).instanceof(Optional);
    expect(injector.localDependencies["newKey"].get()).to.equal("newValue");
  })

  it("should addOrUpdate property", () => {
    var injector = new Injector({});
    expect(injector).instanceof(Injector);
    injector.addOrUpdate("newKey", "newValue");
    expect(injector.localDependencies["newKey"]).instanceof(Optional);
    expect(injector.localDependencies["newKey"].get()).to.equal("newValue");
    injector.addOrUpdate("newKey", "updateValue");
    expect(injector.localDependencies["newKey"].get()).to.equal("updateValue");
  })

  it("should addGlobal property", () => {
    var injector = new Injector({});
    expect(injector).instanceof(Injector);
    injector.addGlobal("newKey", "newValue");
    expect(injector.injectorDependencies["newKey"]).instanceof(Optional);
    expect(injector.injectorDependencies["newKey"].get()).to.equal("newValue");
  })

  it("should addOrUpdateGlobal property", () => {
    var injector = new Injector({});
    expect(injector).instanceof(Injector);
    injector.addOrUpdateGlobal("newKey", "newValue");
    expect(injector.injectorDependencies["newKey"]).instanceof(Optional);
    expect(injector.injectorDependencies["newKey"].get()).to.equal("newValue");
    injector.addOrUpdateGlobal("newKey", "updateValue");
    expect(injector.injectorDependencies["newKey"].get()).to.equal("updateValue");
  })

  it("should parse class Strings", () => {
    var {isClass, name, params} = Injector.parseParams(MockClass.toString());

  })

  it("should parse function Strings", () => {
    var {isClass, name, params} = Injector.parseParams(mockFunction.toString());

  })

  it("should parse async function Strings", () => {
    var {isClass, name, params} = Injector.parseParams(mockAsyncFunction.toString());
  })

  it("should inject params in class", () => {
    var injector = new Injector({});
    injector.add("val1", "val1").add("val_2$", "val_2$");
    var newClass = injector.inject(MockClass, {});
    expect(newClass).instanceof(MockClass);
    expect(newClass.val1.get()).to.equal("val1");
    expect(newClass.val_2$.get()  ).to.equal("val_2$");
  })

  it("should inject undefined params in class", () => {
    var injector = new Injector({});
    var newClass = injector.inject(MockClass, {});
    expect(newClass).instanceof(MockClass);
    expect(newClass.val1.get()).to.equal(undefined);
    expect(newClass.val_2$.get()  ).to.equal(undefined);
  })

  it("should inject undefined params in class and update later", () => {
    var injector = new Injector({});
    var newClass = injector.inject(MockClass, {});
    expect(newClass).instanceof(MockClass);
    injector.addOrUpdate("val1", "val1").addOrUpdate("val_2$", "val_2$");
    expect(newClass.val1.get()).to.equal("val1");
    expect(newClass.val_2$.get()  ).to.equal("val_2$");
  })


})
