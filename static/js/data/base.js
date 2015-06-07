// base model class
ff.Models.Base = Backbone.Model.extend({

});

// base collection class
ff.Collections.Base = Backbone.Collection.extend({
    parse: function (response) {
        return response.objects;
    }
});
