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
        var user = this.getModel(event);

        user && user.save({ active: true });
    },

    changeGroupName: function (event) {
        var user = this.getModel(event),
            $modal = $('#myModal')
            
        $modal.modal();
        $modal.one('click', 'button', function () {
            // second listener ensures the shade is pulled up
            $modal.one('hidden.bs.modal', function () {
                user.save({ group_name: $modal.find('input').val() });
            });
        });
    },

    dataFunction: function (event) {
        var $target = $(event.currentTarget),
            func = $target.data('function');

        if (this[func]) {
            this[func](event);
        }
    },

    deactivateUser: function (event) {
        var user = this.getModel(event);

        user && user.save({ active: false });
    },

    generateGroupCode: function (event) {
        var text = "",
            possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
            user = this.getModel(event);

        for (var i = 0; i < 5; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        user.save({ group_code: text });
    },

    getModel: function (event) {
        var $target = $(event.currentTarget),
            $row = $($target.closest('tr')),
            modelId = $row.data('model-id'),
            collectionName = $row.data('collection-name'),
            model = this[collectionName].get(modelId);

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
