const script = require('./index.js');
const core = require('@actions/core');

try {
  script.playlist({}, null, (err, callback) => {
    if (err) {
      core.setFailed(err.message);
    }
    console.log(callback);
  });
} catch (error) {
  core.setFailed(error.message);
}
