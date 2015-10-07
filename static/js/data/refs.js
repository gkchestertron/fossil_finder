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
    initialize: function () {
        this.paging = {
            page_number: null,
            total_pages: null,
            total_records: null
        };
    },

    model: ff.Models.Ref,

    parse: function (response) {
        this.paging = {
            page_number: response.page,
            total_pages: response.total_pages,
            total_records: response.num_results
        };

        return response.objects;
    },


    url: function () {
        var url = '/api/refs';

        if (this.fetchAll) {
            url += '?all=true';

            if (this.paging.page_number) {
                url += /\?/.test('?') ? '&' : '?';
                url += ('page=' + this.paging.page_number);
            }
        }

        return url;
    }
});
