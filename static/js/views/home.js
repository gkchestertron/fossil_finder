ff.Views.Admin = Backbone.View.extend({
    render: function () {
        this.$el.html(_.template(ff.templates.get('home'))({}));
    }
});
