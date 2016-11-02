"use strict";

const cli = require('cli');

const Postprocersor = require('./lib/Postprocersor');


cli.parse({
    unit: ['u', 'Set unit to', 'string'],
    pathStroke: ['s', 'Set path stroke color', 'string'],
    pathStrokeWidth: ['w', 'Set path stroke width', 'decimal'],
    pathFill: ['f', 'Set path fill color', 'string']
});

cli.main((args, options) => {
    let file = args[0];

    if ( ! file) {
        return console.error('Specify input file');
    }

    let pp = new Postprocersor(options);
    pp.process(file, (err, result) => {
        if (err) {
            return console.error("Error:", err);
        }

        console.log(result);
    });

});