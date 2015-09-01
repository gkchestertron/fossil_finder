ff.Router = Backbone.Router.extend({
    initialize: function () {
        this.$rootEl = $('#app');
    },

    routes: {
        '': 'finder',
        'admin': 'admin'
    },

    _swapView: function (view) {
        this.currentView && this.currentView.remove();
        this.currentView = view;
        this.$rootEl.html(view.$el);
        view.render();
    }, 

    admin: function () {
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
            });

        // set refs url to fetch all
        refs.url = '/api/refs?all=true'

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

    finder: function () {
        var self = this;
        
        ff.refs.fetch({
            success: function () {
                var view = new ff.Views.Finder({
                        model: ff.refs.first()
                    });

                self._swapView(view);
            }
        });
    }
});
