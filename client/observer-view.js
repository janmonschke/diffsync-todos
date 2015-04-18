var ObserveJS = require('observe-js'),
    Backbone  = require('backbone'),
    _         = require('underscore'),
    View      = require('./view'),
    support   = require('./support');

module.exports = View.extend({
  initialize: function(){
    View.prototype.initialize.apply(this, arguments);
    if (_.isArray(this.model)) {
      this._observer = new ObserveJS.ArrayObserver(this.model);
      // Array.observe(this.model, function(){
      //   console.log(name, 'changed', arguments);
      // });
    } else {
      this._observer = new ObserveJS.ObjectObserver(this.model);
      // Object.observe(this.model, function(){
      //   console.log(name, 'changed', arguments);
      // })
    }

    this._changeDetected = this._changeDetected.bind(this);
    this._observer.open(this._changeDetected);
  },

  _changeDetected: function(){
    Backbone.trigger('state:change');
    this.changeDetected.apply(this, arguments);
  },

  changeDetected: function(){
    this.render();
  },

  removeFromCollection: function(){
    if(this.collection){
      var index = this.collection.indexOf(this.model);
      if(index > -1){
        this.collection.splice(index, 1);
      }
    }
  },

  remove: function(){
    this._observer.close();
    this._observer = null;
    View.prototype.remove.apply(this);
  }
});

////////////////////
// Needs polling? //
////////////////////

// If there is no support, activate polling
// see: https://github.com/polymer/observe-js#about-delivery-of-changes
if(!support.OBSERVE){
  var pollForChanges = function(){
    /* global Platform */
    Platform.performMicrotaskCheckpoint();
  };

  // var POLL_INTERVAL_TIMEOUT = 100;
  // setInterval(pollForChanges, POLL_INTERVAL_TIMEOUT);

  window.addEventListener('click', pollForChanges);
  window.addEventListener('touchend', pollForChanges);
  window.addEventListener('submit', pollForChanges);
  Backbone.on('state:sync', pollForChanges);
}
