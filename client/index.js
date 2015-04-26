var DiffSyncClient = require('diffsync').Client,
    socketIOClient = require('socket.io-client'),
    Backbone       = require('backbone'),

    ObserverCollectionView = require('./observer-collection-view'),
    ItemView               = require('./item-view');

var todoList = location.href.split('/').pop();

var client = new DiffSyncClient(socketIOClient(), todoList);

client.on('connected', function(){
  var TodoListView = ObserverCollectionView.extend({
    ViewClass: ItemView,
    tagName: 'ol',
    attributes: {
      id: 'todos'
    }
  });

  var theListView = new TodoListView(client.getData().todos);
  document.getElementById('todosContainer').appendChild(theListView.render().el);

  var todoText = document.getElementById('todoText');
  var todoForm = document.getElementById('todoForm');
  var todoButton = document.getElementById('todoButton');

  var addTodoAction = function(event){
    event.preventDefault();

    var text = todoText.value;

    if(text){
      client.getData().todos.push({
        text: todoText.value,
        id: Math.random() + ''
      });

      todoText.value = '';
      todoText.focus();
    }
  };

  todoButton.addEventListener('click', addTodoAction);
  todoForm.addEventListener('click', addTodoAction);
});

client.on('synced', function(){
  Backbone.trigger('state:sync');
});

client.on('error', function(error){
  console.error(error);
});

Backbone.on('state:change', function(){
  client.schedule();
});

client.initialize();
