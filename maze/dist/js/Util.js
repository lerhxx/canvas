'use strict';

var MathUtil = {
    randomInt: function randomInt(a, b) {
        if (typeof b === 'undefined') {
            a = a || 1;
            return Math.floor(Math.random() * a);
        } else {
            return Math.floor(Math.random() * (b - a) + a);
        }
    }
};