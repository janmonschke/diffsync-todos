var _               = require('underscore'),
    ObserverView    = require('./observer-view'),
    CollectionView;

CollectionView = ObserverView.extend({
  ViewClass: null,
  items: [],

  initialize: function(){
    ObserverView.prototype.initialize.apply(this, arguments);

    if(this.ViewClass === null){
      throw new Error('A `ViewClass` needs to be specified!');
    }

    this.model.forEach(this.appendItem.bind(this));
  },

  appendItem: function(item){
    var itemView = new this.ViewClass(item);
    this.items.push(itemView);
    itemView.collection = this.model;
    this.$el.append(itemView.render().el);
  },

  removeItem: function(removedItem){
    var viewFromItem = _.find(this.items, function(item){
      return item.model === removedItem;
    });

    if(viewFromItem){
      this.items.splice(this.items.indexOf(viewFromItem), 1);
      viewFromItem.remove();
    }
  },

  changeDetected: function(splices){
    splices.forEach(this.interpretSlice.bind(this));
  },

  interpretSlice: function(slice){
    if(slice.addedCount){
      for(var i = 0; i < slice.addedCount; i++){
        var newItem = this.model[slice.index + i];
        this.appendItem(newItem);
      }
    }

    if(slice.removed.length > 0) {
      slice.removed.forEach(this.removeItem.bind(this));
    }
  },

  render: function(){
    return this;
  }
});

module.exports = CollectionView;
