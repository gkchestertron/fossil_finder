// image model class
ff.Models.Image = ff.Models.Base.extend({

});


// image collection class
ff.Collections.Images = ff.Collections.Base.extend({
    model: ff.Models.Image,
    parse: function (response) {
        return response['objects'];
    },
    url: '/api/images'
});
