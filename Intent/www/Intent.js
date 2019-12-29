var exec = require('cordova/exec');

exports.invoke = function (arg0, success, error) {
    exec(success, error, 'Intent', 'invoke', [arg0]);
};
