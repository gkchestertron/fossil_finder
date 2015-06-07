// categorie model class
ff.Models.Category = ff.Models.Base.extend({
    urlRoot: '/api/categories'
});


// categorie collection class
ff.Collections.Categories = ff.Collections.Base.extend({
    model: ff.Models.Category,
    url: '/api/categories'
});
