var union = require('lodash.union');

var SimpleValidationStrategy = {
  validate: function (joiSchema, data, key) {
    joiSchema = joiSchema || {};
    data = data || {};

    console.log('SimpleValidationStrategy', key, data[key]);

    if (key === undefined) {
      var self = this;
      var errors = {};
      Object.keys(joiSchema).forEach(function (k) {
        var item = joiSchema[k];
        errors[k] = self._validate(item, data, k);
      });

      union(Object.keys(joiSchema), Object.keys(data)).forEach(function (k) {
        errors[k] = errors[k] || [];
      });
      return errors;
    } else {
      var result = {};
      var item = joiSchema[key];

      result[key] = this._validate(item, data, key);
      return result;
    }
  },

  _validate: function (item, data, key) {
    if (!item) return null;

    var value = data[key] || '';

    var x = item[0];
    var error = item[1];

    var pass = true;
    if (x instanceof RegExp) {
      pass = x.test.call(x, value);
    } else if (typeof x === "function") {
      pass = x(value);
    } else if (typeof x === 'string' || x instanceof String) {
      pass = (data[key] === data[x]);
    }

    if (!pass) {
      return [error];
    }
  }
};

module.exports = SimpleValidationStrategy;
