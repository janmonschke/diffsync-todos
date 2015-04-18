var ObserverView = require('./observer-view'),
    ItemView;

ItemView = ObserverView.extend({
  tagName: 'li',
  events: {
    'click': 'changeModel'
  },
  template: function(model) { return JSON.stringify(model); },
  changeModel: function(){
    this.model.title = Math.random() + '';
  }
});

module.exports = ItemView;
