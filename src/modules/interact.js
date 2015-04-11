'use strict';
var $ = require('jquery');
var relationMap = require('common/relationMap.js');
var util = require('core/util.js');
var users,
    interacts = [],
    q1, q2, q3;

q1 = new Promise(function (resovle) {
    $.ajax('/src/core/mocks/central_interacts.json').done(function (data) {
        var seniorInteracts = util.formatLinks(data);
        seniorInteracts.forEach(function (item) {
            item.level = 10;
        });
        interacts = interacts.concat(seniorInteracts);
        resovle();
    });
});
q2 = new Promise(function (resovle) {
    $.ajax('/src/core/mocks/second_interacts.json').done(function (data) {
        var secondaryInteracts = [];
        data.results.forEach(function (item) {
            secondaryInteracts = secondaryInteracts.concat(util.formatLinks(item));
        });
        secondaryInteracts.forEach(function (item) {
            item.level = 1;
        });
        interacts = interacts.concat(secondaryInteracts);
        resovle();
    });
});
q3 = new Promise(function (resovle) {
    $.ajax('/src/core/mocks/users.json').done(function (data) {
        users = data.users;
        resovle();
    });
});

// var uid = 1702079711;
Promise.all([q1, q2, q3]).then(function () {
    var map = {};
    users = util.filterObjectArr(users);
    users.forEach(function (item, index) {
        map[item.id] = index;
    });
    function getUserByUid (uid) {
        return users[map[uid]]; 
    }
    function addUserWeightByUid(uid, weight) {
        var user = getUserByUid(uid);
        user.rweight = ~~user.rweight + weight;
    }

    interacts.forEach(function (link) {
        link.source = map[link.sourceUid];
        link.target = map[link.targetUid];
        addUserWeightByUid(link.sourceUid, link.level);
        addUserWeightByUid(link.targetUid, link.level);
    });
    relationMap({
        nodes: users,
        links: interacts,
        container: '#relationMap'
    });
});