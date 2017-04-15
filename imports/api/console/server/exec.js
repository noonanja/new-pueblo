// Normally, programs happening within the Node environment would need to occur
// in Javascript. But because Child Process uses Node’s Command Line Interface,
// it can execute Python files the exact same way the terminal would.
const exec = Npm.require('child_process').exec;

const cmd = "python ../../../../../server/.scripts/argmin.py";

_execSync = function(simId, stdoutHandler, stderrHandler) {
    exec(cmd + " simId", Meteor.bindEnvironment(
      function(error, stdout, stderr) {
        if (stdout != "") {
          stdoutHandler(stdout, simId);
        }
        if (stderr != "") {
          stderrHandler(stderr, simId);
        }
      })
    );
}
