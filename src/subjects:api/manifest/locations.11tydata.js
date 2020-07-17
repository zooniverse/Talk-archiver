const awaitSubjects = require('../../helpers/subjects');
const subjectLocation = require('../../helpers/subjectLocation');

module.exports = async function () {
  const subjects = await awaitSubjects;
  const hosts = {};

  Object.values(subjects).forEach(function (subject) {
    const location = subjectLocation(subject.location.standard || subject.location);
    const url = new URL(location);
    if (hosts[url.host]) {
      hosts[url.host] = hosts[url.host] + 1;
    } else {
      hosts[url.host] = 1;
    }
  })

  return { hosts };
}