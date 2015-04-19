var _             = require('underscore'),
    ObserverView  = require('./observer-view'),
    ItemView;

ItemView = ObserverView.extend({
  tagName: 'li',
  className: 'item',
  events: {
    'click button': 'removeTodo'
  },
  template: function(model) {
    return '<span class="itemText">' + model.text + '</span> <button class="button-primary">done</button>';
  },
  removeTodo: function(){
    var index = this.collection.indexOf(this.model);

    if(index > -1){
      this.collection.splice(index, 1);
    }
  }
});

module.exports = ItemView;
