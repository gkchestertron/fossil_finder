ff.Views.Admin = Backbone.View.extend({
    events: {
        'click [data-function]': 'dataFunction'
    },

    initialize: function (options) {
        this.collections = [
            this.users      = options.users,
            this.refs       = options.refs,
            this.tags       = options.tags,
            this.categories = options.categories
        ];
        
        for (var i in this.collections) {
            this.listenTo(this.collections[i], 'sync error', this.render);
        }
    },

    activateUser: function (event) {
        var user = this.getUser(event);

        user && user.save({ active: true });
    },

    dataFunction: function (event) {
        var $target = $(event.currentTarget),
            func = $target.data('function');

        if (this[func]) {
            this[func](event);
        }
    },

    deactivateUser: function (event) {
        var user = this.getUser(event);

        user && user.save({ active: false });
    },

    getUser: function (event) {
        var $target = $(event.currentTarget),
            $row = $($target.closest('tr')),
            modelId = $row.data('model-id'),
            model = this.users.get(modelId);

        return model;
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
