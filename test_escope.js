const path = require('path');
const fs = require("fs");
const acorn = require("acorn");
const escope = require("./src")
let code = `
 function x (mo, o, e) {
            const {mat4: vo, vec3: bo, quat: Co} = mo("./lib/math"),
                yo = mo("fit-rect"),
                xo = mo("./lib/make-dots"),
                Mo = mo("./lib/ramda-lite"),
                _o = document.createElement("canvas");
          (features = []), t(), (window.generateSeadragon = t);
        }
        `
this_ = {}

this_.ast = acorn.parse(code, {
    ranges: true,
    preserveParens: true,
    ecmaVersion: 'latest',
    sourceType: 'script'
});

let scopeManager = escope.analyze(this_.ast)

console.log(scopeManager)
