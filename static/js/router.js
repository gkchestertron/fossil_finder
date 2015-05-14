ff.Router = Backbone.Router.extend({
    finder: function () {
        // TODO connect to images
        var view = new ff.Views.Finder({
            model: new ff.Models.Image({ href: 'http://calphotos.berkeley.edu/imgs/zoomucmp/0000_0000/0314/0199.jpeg' })
        });

        this._swapView(view);
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
