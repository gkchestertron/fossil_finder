// base view class
ff.Views.Base = Backbone.View.extend({
    getOffsetDiff: function (offset1, offset2) {
        var result = {
            top    : ff.min([offset1.top,    offset2.top]),
            left   : ff.min([offset1.left,   offset2.left]),
            height : Math.abs(offset1.top  - offset2.top),
            width  : Math.abs(offset1.left - offset2.left)
        }

        return result;
    },

    getRelativeOffset: function (event, $element) {
        var offset = $element && $element.offset(),
            top    = event.pageY,
            left   = event.pageX;

        if (offset) {
            top  = top - offset.top;
            left = left - offset.left;
        }
        else {
            console.log('something went wrong')
        }

        return { top: top, left: left };
    }
});
