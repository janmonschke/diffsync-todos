/*
  Based on https://github.com/tiagorg/marionette-vdom/blob/master/vdom-mixin.js which is licensed under MIT license with Copyright (c) 2015, Tiago Garcia
*/

var Backbone    = require('backbone'),
    _           = require('underscore'),
    $           = require('jquery'),
    diff        = require('virtual-dom/diff'),
    patch       = require('virtual-dom/patch'),
    convertHTML = require('html-to-vdom')({
      VNode: require('virtual-dom/vnode/vnode'),
      VText: require('virtual-dom/vnode/vtext')
    }),
    support     = require('./support');

Backbone.$ = $;

module.exports = Backbone.View.extend({
  initialize: function(model){
    this.model = model;
  },

  delegateEvents: function(events) {
    var key, newKey, oldValue;
    this.events = this.events || events;
    for (key in this.events) {
      if (key.indexOf('click') === 0) {
        if (support.IS_MOBILE) {
          newKey = key.replace('click', 'touchend');
          oldValue = this.events[key];
          this.events[newKey] = oldValue;
          delete this.events[key];
        }
      }
    }
    return Backbone.View.prototype.delegateEvents.call(this, this.events);
  },

  setElement: function() {
    Backbone.View.prototype.setElement.apply(this, arguments);

    if (this.el) {
      this.rootTemplate = _.template(
        this.el.outerHTML.replace(/>(.|\n)*<\//, '><%= content %></')
      );
    }

    return this;
  },

  getHTML: function() {
    return this.template(this.model).trim();
  },

  render: function(){
    var html = this.getHTML();
    var newVirtualEl = convertHTML(this.rootTemplate({
      content: html
    }));
    if (this.virtualEl) {
      var patches = diff(this.virtualEl, newVirtualEl);
      patch(this.el, patches);
    } else {
      this.$el.html(html);
    }
    this.virtualEl = newVirtualEl;
    return this;
  },

  remove: function(){
    this.virtualEl = this.rootTemplate = null;
    return Backbone.View.prototype.remove.apply(this, arguments);
  }
});
