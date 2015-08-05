// ref model class
ff.Models.Ref = ff.Models.Base.extend({
    parse: function (response) {
        var tags  = new ff.Collections.Tags(response.tags);

        response.tags = tags;

        return response;
    },

    urlRoot: '/api/refs'
});


// ref collection class
ff.Collections.Refs = ff.Collections.Base.extend({
    model: ff.Models.Ref,

    url: '/api/refs'
});
