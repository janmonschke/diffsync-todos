var ObserverView = require('./observer-view'),
    ItemView;

ItemView = ObserverView.extend({
  tagName: 'li',
  template: function(model) { return JSON.stringify(model); }
});

module.exports = ItemView;
