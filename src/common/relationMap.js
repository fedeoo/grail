'use strict';
var d3 = require('d3');
var d3tip = require('d3-tip')(d3);
module.exports = function(options) {
    var container = options.container || document.body,
        width = options.width || 960,
        height = options.height || 600;

    var svg = d3.select(container).append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g');
    var tip = d3tip().attr('class', 'd3-tip').html(function (d) {
        return ['<div class="container-fluid ">',
                    '<div class="row">',
                        '<div class="col-md-4 left-side">',
                            '<div>',
                               '<img src="' + d.avatar_large + '" alt="用户头像" width="60px"/>',
                            ' </div>',
                            '<p>' + d.name + '</p>',
                            '<p>' + d.location + '</p>',
                        '</div>',
                        '<div class="col-md-8 right-side">',
                            '<p><span>公司：</span></p>',
                            '<p><span>共同点：</span></p>',
                            '<p><span>标签：</span></p>',
                        '</div>',
                    '</div>',
            '</div>'].join('');
    });
    var tiptimer;
    svg.call(tip);

    var nodesData = options.nodes; // distinguish between data and svn node
    var linksData = options.links;

    nodesData[0].fixed = true;
    nodesData[0].x = width / 2;
    nodesData[0].y = height / 2;
    var force = d3.layout.force()
        .nodes(nodesData)
        .links(linksData)
        // .gravity(0.05)
        .linkDistance(120)
        .charge(-150)
        .size([width, height])
        .start();
    // paint links first so that put link under the node, link will not trigger mouse event    
    var links = svg.selectAll('.link')
        .data(linksData)
        .enter()
        .append('line')
        .attr('class', function(d) {
            var classNames = ['link'];
            if (!d.directed) {
                classNames.push('dotted');
            }
            return classNames.join(' ');
        });

    var nodes = svg.selectAll('.node')
        .data(nodesData)
        .enter()
        .append('g')
        .attr('class', function (d) {
            var classNames = ['node'];
            if (d.rweight >= 80) {
                classNames.push('primary');
            } else if (d.rweight > 8) {
                classNames.push('secondary');
            } else {
                classNames.push('ordinary');
            }
            return classNames.join(' ');
        })
        .call(force.drag)
        .on('click', function() {

        })
        .on('mouseover', function (d) {
            tiptimer && clearTimeout(tiptimer);
            tip.show(d);
        })
        .on('mouseout', function (d) {
            tiptimer && clearTimeout(tiptimer);
            tiptimer = setTimeout(function () {
                tip.hide(d);
            }, 500);
        });

    nodes.append("image")
        .attr("xlink:href", function (d) {
            return d.avatar_large;
        })
        .attr("x", -8)
        .attr("y", -8)
        .attr("width", 16)
        .attr("height", 16);

    // nodes.append('text')
    //     .attr('dx', 12)
    //     .attr('y', '.35em')
    //     .text(function(d) {
    //         return d.name;
    //     });

    force.on("tick", function() {
        links.attr("x1", function(d) {
                return d.source.x;
            })
            .attr("y1", function(d) {
                return d.source.y;
            })
            .attr("x2", function(d) {
                return d.target.x;
            })
            .attr("y2", function(d) {
                return d.target.y;
            });

        nodes.attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")";
        });
    });
};