var Hapi            = require('hapi'),
    io              = require('socket.io'),
    databaseName    = process.env.db_name,
    database        = require('./database')(databaseName),
    diffsync        = require('diffsync'),
    dataAdapter     = require('./data-adapter')(databaseName),
    DiffSyncServer  = diffsync.Server,
    hapiServer      = new Hapi.Server(),
    isProduction    = process.env.NODE_ENV === 'production',
    realtimeServer;

hapiServer.connection({ port: process.env.PORT || 4000 });
io = io(hapiServer.listener);

realtimeServer = new DiffSyncServer(dataAdapter, io);

hapiServer.views({
  engines: {
    hbs: require('handlebars')
  },
  path: './templates',
  relativeTo: __dirname,
  isCached: isProduction
});

hapiServer.route({
  method: 'GET',
  path: '/',
  handler: function(request, reply){
    reply.view('index', {
      activeConnections: io.engine.clientsCount
    });
  }
});

hapiServer.route({
  method: 'GET',
  path: '/todos/{name}',
  handler: function(request, reply){
    var name = encodeURIComponent(request.params.name),
        renderTodos = function(){
          reply.view('todos', {
            name: name
          });
        };

    // fetch the todolist
    database.get(name, function(err, doc){
      // if list does not exist, create it
      if(err || !doc){
        database.save(name, { todos: [] }, function(){
          renderTodos();
        });
      }else{
        renderTodos();
      }
    });
  }
});

hapiServer.route({
  method: 'GET',
  path: '/client/{path*}',
  handler: {
    directory: {
      path: './client'
    }
  }
});

hapiServer.start(function(){
  console.log('Server is up and running!');
});
