'use strict';
// require('./core/net.js');
// require('modules/interact.js');
var net = require('core/net.js');
var util = require('core/util.js');
var relationMap = require('common/relationMap.js');

net.getRelationNetByUid('1702079711').then(function (res) {
    var mapdata = util.formatData(res.users, res.links);
    relationMap({
        nodes: mapdata.nodes,
        links: mapdata.links,
        container: '#relationMap'
    });
    console.log(mapdata);
});