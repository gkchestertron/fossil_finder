ff.Views.Admin = Backbone.View.extend({
    events: {
        'click [data-function]': 'dataFunction',
        'change select[name="auth-level"]': 'changeAuthLevel',
        'click a[role="tab"]': 'updateTabNav'
    },

    initialize: function (options) {
        this.collections = [
            this.users      = options.users,
            this.refs       = options.refs,
            this.tags       = options.tags,
            this.categories = options.categories,
        ];
        
        this.activeTab = options.tab;

        for (var i in this.collections) {
            this.listenTo(this.collections[i], 'destroy sync error', this.render);
        }
    },

    activateUser: function (event) {
        var user = this.getModel(event);

        user && user.save({ active: true });
    },
    
    changeAuthLevel: function (event) {
        var model = this.getModel(event),
            authLevel = $(event.currentTarget).val();

        model.save({ auth_level: authLevel });

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

    createCategory: function (event) {
        var $button = $(event.currentTarget),
            $form = $button.closest('form'),
            $input = $form.find('input'),
            name = $input.val(),
            cat;

        event.preventDefault();
        cat = this.categories.create({ name: name });
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

    deleteModel: function (event) {
        var model = this.getModel(event);

        model.destroy();
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
            categories : this.categories,
            tab        : this.activeTab
        }));
    },

    updateTabNav: function (event) {
        var $a = $(event.currentTarget),
            tab = $a.prop('href').split('#')[1];

        this.activeTab = tab;
        ff.router.navigate('/admin/' + tab, { trigger: false, replace: true });
    }
});
