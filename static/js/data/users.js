// user model
ff.Models.User = ff.Models.Base.extend({
    urlRoot: '/api/users'
});

// user collection
ff.Collections.Users = ff.Collections.Base.extend({
    model: ff.Models.User,

    url: '/api/users'
});
