const _ALLAPPS = "/allapps";
const _APP = ":app";
const _USERID = ":userId";
const _PICID = ":picId";

const multiAppRoutes = {
  allApps: _ALLAPPS,
  app: `${_ALLAPPS}/${_APP}`,
  appUser: `${_ALLAPPS}/${_APP}/${_USERID}`,
  userPic: `${_ALLAPPS}/${_APP}/${_USERID}/${_PICID}`,
};

module.exports = { multiAppRoutes };
