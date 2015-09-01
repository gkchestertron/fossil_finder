ff.Views.Admin = Backbone.View.extend({
    initialize: function (options) {
        this.users      = options.users;
        this.refs       = options.refs;
        this.tags       = options.tags;
        this.categories = options.categories;
    },

    render: function () {
        this.$el.html(_.template(ff.templates.get('admin'))({
            users      : this.users,
            refs       : this.refs,
            tags       : this.tags,
            categories : this.categories
        }));
    }
});
