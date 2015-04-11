'use strict';

var $ = require('jquery');
$.mockjax({
    url: '/interacts',
    proxy: 'mocks/central_interacts.json'
});

$.mockjax({
    url: '/second_interacts',
    proxy: 'mocks/second_interacts.json'
});

$.mockjax({
    url: '/users',
    proxy: 'mocks/usrs_map.json'
});