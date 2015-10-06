ff.Views.Admin = Backbone.View.extend({
    events: {
        'click [data-function]': 'dataFunction',
        'change select[name="auth-level"]': 'changeAuthLevel',
        'change input[name="page-number"]': 'refsGotoPageNumber',
        'click a[role="tab"]': 'updateTabNav',
        'click [data-comparator]': 'sortCollection'
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
        var $button  = $(event.currentTarget),
            $form    = $button.closest('form'),
            $input   = $form.find('input[name   = "name"]'),
            name     = $input.val(),
            $file    = $form.find('input[type   = "file"]'),
            file     = $file[0].files[0],
            filename = file.name,
            data     = new FormData();

        event.preventDefault();

        data.append('file', file);

        this.categories.create({ name: name, filename: filename });

        $.ajax({
            url: '/upload',  //server script to process data
            type: 'POST',
            data: data,
            processData: false,
            cache: false,
            contentType: false
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

    refsGotoPageNumber: function (event) {
        var $input = $(event.currentTarget),
            page_number = $input.val();

        if (page_number > 0 && page_number <= this.refs.paging.total_pages) {
            this.refs.paging.page_number = page_number;
            this.refs.fetch();
        }
    },

    refsNextPage: function (event) {
        if (this.refs.paging.page_number <= this.refs.paging.total_pages) {
            this.refs.paging.page_number++;
            this.refs.fetch();
        }
    },

    refsPreviousPage: function (event) {
        if (this.refs.paging.page_number > 1) {
            this.refs.paging.page_number--;
            this.refs.fetch();
        }
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

    sortCollection: function (event) {
        var $th = $(event.currentTarget),
            $thead = $th.closest('thead'),
            collection = $thead.data('collection-name'),
            comparator = $th.data('comparator'),
            comparatorSplit = comparator.split('-');

        if (this[collection].sortedBy === comparator) {
            this[collection].models.reverse();
        }
        else {
            this[collection].sortedBy = comparator;
            if (comparatorSplit.length > 1) {
                comparator = function (model) {
                    return model.get(comparatorSplit[0])[comparatorSplit[1]];
                }
            }
            this[collection].comparator = comparator;
            this[collection].sort();
        }

        this.render();
    },

    updateTabNav: function (event) {
        var $a = $(event.currentTarget),
            tab = $a.prop('href').split('#')[1];

        this.activeTab = tab;
        ff.router.navigate('/admin/' + tab, { trigger: false, replace: true });
    }
});
