
var Items = Backbone.Collection.extend({
	url: '/itemlist'
});

var Item = Backbone.Model.extend({
	defaults: {
		'name' : '',
		'qty' : 0,
		'price' : 0
	}, 
	urlRoot: 'item'
});

var Router = Backbone.Router.extend({
	routes: {
		''		     : 'home',
		'new'        : 'edititem',
		'edit/:id'   : 'edititem'
	}
});
var router = new Router();
router.on('route:home', function(){ 
	itemlist.render();
});

router.on('route:edititem', function(id){ 
	edititem.render({'id': id});
});

var item = new Item();
var items = new Items();

var ItemView = Backbone.View.extend({
	tagName: 'tr',
	model: item,
	initialize: function() {
		this.template = _.template($('.item-view').html());
	},
	render: function() {
		this.$el.html(this.template(this.model));
		return this;
	},
/*	events: {
		"click .edit-item" : "editItem"
	}, 
	editItem: function(id)
	{
		console.log(" On the edit page " + this.model.name);
	}*/
});

var ItemList = Backbone.View.extend({
	el: $('.item-list-view'),
	model: itemlist,
	render: function() {
		
		var self = this;
		items.fetch({
			success: function(itemlist) {
				self.$el.html('');
				 console.log(itemlist.models);
				_.each(itemlist.models, function(item) {
					self.$el.append(new ItemView({model: item.attributes}).render().$el);
				});				
				return this;
			},
			error: function(response) {
				alert('error');
			}
		});
	}
});

$.fn.serializeObject = function() {
  var o = {};
  var a = this.serializeArray();
  $.each(a, function() {
      if (o[this.name] !== undefined) {
          if (!o[this.name].push) {
              o[this.name] = [o[this.name]];
          }
          o[this.name].push(this.value || '');
      } else {
          o[this.name] = this.value || '';
      }
  });
  return o;
};


var EditItem = Backbone.View.extend({
	el: $('.page'),
	model: itemlist,
	initialize: function() {
		this.template = _.template($('.edit-item-template').html());
	},
	render: function(options) {
		var self = this;
		if ( options.id ) {
			console.log("Option Id " + options.id);
			var item = new Item( { id: options.id } );
			self.item = item;
			item.fetch( {
				success: function(item1) {
					console.log(item1.attributes[0]);
					self.$el.html(self.template(item1.attributes[0]));					
				}
			});
		} else {
			this.$el.html(this.template( { id: '', name:'', qty:'', price:'' }));
		}
	},
	events: {
		"submit .add-item-form" : "addItem",
		"click  .delete-item"   : "deleteItem"
	},
	addItem: function(ev) 
	{
		var self = this;
		var obj = $(ev.currentTarget).serializeObject();
		var item = new Item();

		item.save(obj, {
			success: function(user) 
			{
				console.log('user is saved');
				$(".edit-name").val("");
				$(".edit-qty").val("");
				$(".edit-price").val("");
				self.$el.html('');
				router.navigate('', {trigger: true});
			},
			error: function(err) {
				alert("Error occurred while inserting records");

			}
		});
		return false;
	},
	deleteItem: function(ev) 
	{
		this.item.destroy();
		router.navigate('', {trigger: true});
		this.$el.html('');
		return false;
	}
});

var itemlist = new ItemList();
var edititem = new EditItem();

Backbone.history.start();