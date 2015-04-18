var Hapi            = require('hapi'),
    io              = require('socket.io'),
    diffsync        = require('diffsync'),
    DataAdapter     = diffsync.InMemoryDataAdapter,
    DiffSyncServer  = diffsync.Server,
    hapiServer      = new Hapi.Server(),
    isProduction    = process.env.NODE_ENV === 'production',
    realtimeServer, dataAdapter;

hapiServer.connection({ port: process.env.PORT || 4000 });
io = io(hapiServer.listener);

dataAdapter = new DataAdapter();
realtimeServer = new DiffSyncServer(io, dataAdapter);

hapiServer.views({
  engines: {
    hbs: require('handlebars')
  },
  path: './templates',
  relativeTo: __dirname
});

hapiServer.route({
  method: 'GET',
  path: '/',
  handler: function(request, reply){
    reply.view('index', {
      activeConnections: io.engine.clientsCount,
      todoLists: Object.keys(dataAdapter.cache).length
    });
  }
});

hapiServer.route({
  method: 'GET',
  path: '/todos/{name}',
  handler: function(request, reply){
    var name = encodeURIComponent(request.params.name);
    // create a new todo list on the fly
    if (dataAdapter.cache[name] === undefined) {
      dataAdapter.cache[name] = {
        id: name,
        todos: []
      };
    }
    reply.view('todos', {
      name: name
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
