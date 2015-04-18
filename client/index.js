var DiffSyncClient = require('diffsync').Client,
    socketIOClient = require('socket.io-client'),
    Backbone       = require('backbone'),

    ObserverCollectionView = require('./observer-collection-view'),
    ItemView               = require('./item-view');

var todoList = location.href.split('/').pop();

var client = new DiffSyncClient(socketIOClient(), todoList);

client.onConnected = function(){
  var TodoListView = ObserverCollectionView.extend({
    ViewClass: ItemView,
    tagName: 'ul'
  });

  var theListView = new TodoListView(client.getData().todos);
  document.body.appendChild(theListView.render().el);

  document.getElementById('addTodo').addEventListener('click', function(){
    client.getData().todos.push({title: Math.random() + '', id: Math.random() + ''});
  });
};

client.onSynced = function(){
  Backbone.trigger('state:sync');
};

client.onError = function(error){
  console.error(error);
};

Backbone.on('state:change', function(){
  client.schedule();
});

client.initialize();
