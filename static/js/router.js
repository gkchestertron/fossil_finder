ff.Router = Backbone.Router.extend({
    initialize: function () {
        this.$rootEl = $('#app');
    },

    routes: {
        ''           : 'home',
        '/'          : 'home',
        'finder/:id' : 'finder',
        'finder'     : 'finder',
        'admin'      : 'admin',
        'admin/:tab' : 'admin'
    },

    _swapView: function (view) {
        this.currentView && this.currentView.remove();
        this.currentView = view;
        this.$rootEl.html(view.$el);
        view.render();
    }, 

    admin: function (tab) {
        var self      = this,
            loadCount = 0,
            users = new ff.Collections.Users(),
            refs = new ff.Collections.Refs(),
            tags = new ff.Collections.Tags(),
            categories = new ff.Collections.Categories(),
            view      = new ff.Views.Admin({
                users: users,
                refs: refs,
                categories: categories,
                tags: tags,
                tab: tab || 'users'
            });

        // set refs url to fetch all
        refs.fetchAll = true;

        users.fetch({ success: callback });
        refs.fetch({ success: callback });
        tags.fetch({ success: callback });
        categories.fetch({ success: callback });

        function callback() {
            loadCount++;
            if (loadCount == 4) {
                self._swapView(view);
            }
        }
    },

    finder: function (id) {
        var self = this,
            model;
        
        ff.refs.fetchAll = false;

        if (id) {
            model = new ff.Models.Ref({ id: id });
            model.fetch({
                success: function () {
                    var view = new ff.Views.Finder({
                            model: model
                        });

                    self._swapView(view);
                    ff.router.navigate('/finder/' + model.id, { trigger: true });
                },
                error: function () {
                    ff.router.navigate('/finder', { trigger: true });
                }
            });
        }
        else {
            ff.refs.fetch({
                success: function () {
                    model = ff.refs.first();
                    var view = new ff.Views.Finder({
                            model: model
                        });

                    self._swapView(view);
                    ff.router.navigate('/finder/' + model.id, { replace: true });
                },
                error: function () {
                    self.$rootEl.html('<img style="width:100%" draggable=false id="current-image" src="/static/images/failed_to_load.jpeg" />');
                }
            });
        } 
    },

    home: function () {
      this._swapView(new ff.Views.Home);
    }
});
