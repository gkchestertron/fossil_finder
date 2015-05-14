ff.Router = Backbone.Router.extend({
    finder: function () {
        var self = this;
        
        ff.images.fetch({
            success: function () {
                var view = new ff.Views.Finder({
                        model: ff.images.first()
                    });

                self._swapView(view);
            }
        });

    },
    initialize: function () {
        this.$rootEl = $('#app');
    },
    routes: {
        '': 'finder'
    },
    _swapView: function (view) {
        this.currentView && this.currentView.remove();
        this.currentView = view;
        this.$rootEl.html(view.$el);
        view.render();
    }
});
