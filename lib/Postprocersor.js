"use strict";

const async = require('async');
const cheerio = require('cheerio');
const fs = require('fs');

class Postprocersor {
    constructor(options) {
        this.options = options;
    }

    process(file, callback) {
        async.auto({
            "load": (cb) => {
                fs.readFile(file, cb);
            },
            "parse": ['load', (results, cb) => {
                cb(null, cheerio.load(results.load, {xmlMode: true}));
            }],
            "unit": ['parse', (results, cb) => {
                if (this.options.unit) {
                    let $ = results.parse;

                    let w = $('svg').attr('width').replace(/^.*?([\d\,\.]+).*$/gi, '$1' + this.options.unit);
                    let h = $('svg').attr('height').replace(/^.*?([\d\,\.]+).*$/gi, '$1' + this.options.unit);

                    $('svg').attr('width', w);
                    $('svg').attr('height', h);

                }

                cb();
            }],
            "pathStroke": ['parse', (results, cb) => {
                if (this.options.pathStroke) {
                    let $ = results.parse;

                    $('path').attr('stroke', this.options.pathStroke);

                }

                cb();
            }],
            "pathStrokeWidth": ['parse', (results, cb) => {
                if (this.options.pathStrokeWidth !== null) {
                    let $ = results.parse;

                    $('path').attr('stroke-width', this.options.pathStrokeWidth);

                }

                cb();
            }],
            "pathFill": ['parse', (results, cb) => {
                if (this.options.pathFill) {
                    let $ = results.parse;

                    $('path').attr('fill', this.options.pathFill);

                }

                cb();
            }]
        }, (err, results) => {
            if (err) {
                return callback(err);
            }

            callback(null, results.parse.xml());
        });
    }
}

module.exports = Postprocersor;