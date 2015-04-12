'use strict';

/**
 * [formatLinks 转换一级关系数据]
 * @return {[Object]} [数据格式见mocks/central_interacts.json]
 */
function formatLinks (interacts) {
    var sourceUid = interacts.uid;
    return interacts.top_interact.map(function (item) {
        return {
            sourceUid: sourceUid,
            targetUid: item.uid,
            weight: item.weight.all[0]
        };
    });
}

function filterObjectArr (arr) {
    var map = {};
    arr.forEach(function (item, index) {
        if (map[item.id] === null || map[item.id] === undefined) {
            map[item.id] = true;
        } else {
            arr[index] = null;
        }
    });
    return arr.filter(function (item) {
        return !!item;
    });
}

/**
 * [formatData 过滤users 根据users设置 link中source targe]
 * @param  {[type]} users     [description]
 * @param  {[type]} interacts [description]
 * @return {[type]}           [description]
 */
function formatData(users, interacts) {
    var map = {},
        keyUser = users[0];
    users = filterObjectArr(users);
    users.forEach(function (item, index) {
        item.level = 0;
        map[item.id] = index;
    });
    keyUser.level = 100;
    interacts.forEach(function (link) {
        link.source = map[link.sourceUid];
        link.target = map[link.targetUid];
        if (link.sourceUid === keyUser.id) {
            users[map[link.targetUid]].level = 10;
            link.directed = true;
        } else if (link.targetUid === keyUser.id) {
            users[map[link.sourceUid]].level = 10;
            link.directed = true;
        }
    });
    return {
        nodes: users,
        links: interacts
    };
}

module.exports = {
    formatLinks: formatLinks,
    filterObjectArr: filterObjectArr,
    formatData: formatData
};
