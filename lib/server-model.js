var _ = require('underscore')._
    Backbone = require('backbone'),
    model = require('../static/js/model.js'),
    crypto = require('crypto'),
    logger = require('winston'),

// rename exports just for clarity.
server_model = exports;

logger.cli();
logger.default.transports.console.timestamp = true;

var nextPostId=0;
server_model.ServerPost = model.Post.extend({
    
    initialize: function(args) {
        model.Post.prototype.initialize.call(this, args);
        
        // Set and increment the post id.
        if(!("id" in args)) {
            this.set({id:nextPostId++});
        }
        
        
        // setup listeners for particular change events that we're going to 
        // want to send to clients. 
        // this.bind("change", this.save, this);
    },
    
    save: function() {
        // This is (perhaps) where we want to implement some kind of
        // persistence. Alternatively, if we have an event-driven model, we
        // might instead want any writes happening on the change event. 
    },
});

var nextUserId=0;
server_model.ServerUser = model.User.extend({
    
    initialize: function(args) {
        model.User.prototype.initialize.call(this, args);
        
        // Set and increment the post id.
        if(!("id" in args)) {
            this.set({id:nextUserId++});
        }
    },
    
    defaults: function() {
        var defaults = model.User.prototype.defaults.call(this);
        
        defaults["connected"] = false;
        return defaults;
    }
});

server_model.ServerPostList = Backbone.Collection.extend({
    // placeholder for now - the default collection is fine.
});

server_model.ServerUserList = Backbone.Collection.extend({
    
    getConnectedUsers: function() {
        var connectedUsersList = [];
        
        this.each(function(user) {
            if(user.get("connected")) connectedUsersList.push(user);
        });
        
        return connectedUsersList;
    },
    
    numConnectedUsers: function() {
        return this.getConnectedUsers().length;
    },
    
    getUser: function(name, affiliation) {
        return this.find(function(user) {
            return user.get("name") == name &&
                   user.get("affiliation")==affiliation;
        });
    }
});

// We need this mostly for testing, so each test starts at id=0; 
server_model.resetIds = function() {
    nextUserId = 0;
    nextPostId = 0;
};