
var chai = require("chai");
var expect = chai.expect;
var Optional = require("../lib/optional");

describe("Optional tests", () => {

  it("should construct", () => {
    var option = new Optional();
    expect(option).instanceof(Optional);
  })

  it("should construct with value", () => {
    var option = new Optional(true);
    expect(option).instanceof(Optional);
    expect(option.get()).to.equal(true)
  })

  it("should update", () => {
    var option = new Optional(true);
    expect(option).instanceof(Optional);
    expect(option.get()).to.equal(true)
    option.update(false)
    expect(option.get()).to.equal(false)
  })
})
