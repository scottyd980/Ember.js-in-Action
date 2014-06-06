var Blog = Ember.Application.create();

Blog.Router = Ember.Router.extend({
	location: 'hash'
});

Blog.Router.map(function() {
	this.route('index', {path: '/'});
	this.route('blog', {path: '/blog'});
});

Blog.IndexRoute = Ember.Route.extend({
	redirect: function() {
		this.transitionTo('blog');
	}
});

Blog.BlogRoute = Ember.Route.extend({
	model: function() {
		return this.store.find('blogPost');
	}
});

Blog.Store = DS.Store.extend({
    adapter: DS.RESTAdapter
});

Blog.ApplicationAdapter = DS.RESTAdapter.extend({
	namespace: '~Scott/EmberJS/Ember.js%20in%20Action/ch3/blog'
})

Blog.BlogPost = DS.Model.extend({
	postTitle: DS.attr('string'),
	postDate: DS.attr('date'),
	postShortIntro: DS.attr('string'),
	postLongIntro: DS.attr('string'),
	postFilename: DS.attr('string'),
	markdown: null
});