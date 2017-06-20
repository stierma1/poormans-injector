var Injector = require("./lib/injector");
var globalInjector = new Injector({});
module.exports = {
  globalInjector: globalInjector,
  Injector:require("./lib/injector"),
  Optional: require("./lib/optional")
}
