var Injector = require("./lib/injector");
var globalInjector = new Injector({}, true);
module.exports = {
  globalInjector: globalInjector,
  Injector:require("./lib/injector"),
  Optional: require("./lib/optional"),
  Resolvers: require("./lib/resolver")
}
