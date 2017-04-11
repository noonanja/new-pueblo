// Normally, programs happening within the Node environment would need to occur
// in Javascript. But because Child Process uses Node’s Command Line Interface,
// it can execute Python files the exact same way the terminal would.

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
