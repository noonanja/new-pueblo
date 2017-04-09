import { Console } from '../console.js'

exec = Npm.require('child_process').exec;

_execSync = function(cmd, stdoutHandler, stderrHandler) {
    exec(cmd, Meteor.bindEnvironment(
      function(error, stdout, stderr) {
        if (stdout != "")
          stdoutHandler(stdout);
        if (stderr != "")
          stderrHandler(stderr);
      })
    );
}

Meteor.methods({
  consoleExecSync : function() {
    const cmd = "python " + "../../../../../server/.scripts/decomposition.py"
    _execSync(cmd, consoleInsert, consoleInsert);
  }
});

consoleInsert = function(_data) {
  Console.insert({
    timestamp : new Date().getTime(),
    data : _data
  });
}
