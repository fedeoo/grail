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

module.exports = {
    formatLinks: formatLinks,
    filterObjectArr: filterObjectArr
};
