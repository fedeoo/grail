'use strict';
var d3 = require('d3');
var d3tip = require('d3-tip')(d3);
module.exports = function(options) {
    var container = options.container || document.body,
        width = options.width || 960,
        height = options.height || 600;

    function zoomed() {
        svg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    }
    var zoom = d3.behavior.zoom()
        .scaleExtent([1, 10])
        .on("zoom", zoomed);

    var svg = d3.select(container).append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .call(zoom);
    var tip = d3tip().attr('class', 'd3-tip').html(function (d) {
        return ['<div class="container-fluid ">',
                    '<div class="row">',
                        '<div class="col-md-4 left-side">',
                            '<div>',
                               '<img src="' + d.avatar_large + '" alt="用户头像" width="60px"/>',
                           ' </div>',
                           '<div>' + d.name + '</div>',
                        '</div>',
                        '<div class="col-md-8 right-side"></div>',
                    '</div>',
            '</div>'].join('');
    });
    var tiptimer;
    svg.call(tip);

    var nodesData = options.nodes;
    var linksData = options.links;

    var force = d3.layout.force()
        .nodes(nodesData)
        .links(linksData)
        .gravity(0.05)
        .linkDistance(100)
        .charge(-100)
        .linkStrength(function(d) {
            return d.weight;
        })
        .size([width, height])
        .start();

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
            return d.profile_image_url;
        })
        .attr("x", -8)
        .attr("y", -8)
        .attr("width", 16)
        .attr("height", 16);

    nodes.append('text')
        .attr('dx', 12)
        .attr('y', '.35em')
        .text(function(d) {
            return d.name;
        });

    var links = svg.selectAll('.link')
        .data(linksData)
        .enter()
        .append('line')
        .attr('class', function(d) {
            var classNames = ['link'];
            if (d.level < 10) {
                classNames.push('dotted');
            }
            return classNames.join(' ');
        });
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