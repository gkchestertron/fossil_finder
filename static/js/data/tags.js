// tag model class
ff.Models.Tag = ff.Models.Base.extend({
    urlRoot: '/api/tags'
});


// tag collection class
ff.Collections.Tags = ff.Collections.Base.extend({
    model: ff.Models.Tag,
    url: '/api/tags'
});
