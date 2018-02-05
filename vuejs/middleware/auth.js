import CheckAccess from "../checkAccess";

export default function ({ app, store, redirect, route, error }) {
  //console.log("store debug :  ", store.state);
  const userIsLoggedIn = !!store.state.users.user
  const urlRequiresAdmin = /^\/admin(\/|$)/.test(route.fullPath)
  var hasAdminAccess = CheckAccess.getAdminAccess(store.state);
  const urlRequiresNonAuth = /^\/(login|register)(\/|$)/.test(route.fullPath)
  if (userIsLoggedIn && !hasAdminAccess && urlRequiresAdmin) {
    return redirect('/error/unauthorized')
  }
  //if (userIsLoggedIn && urlRequiresNonAuth) {
  //return redirect('/admin')
  //}
  if (!userIsLoggedIn && !urlRequiresNonAuth) {
    return redirect('/login')
  }
  if (route.path == '/') {
    return redirect('/proxy/projects')
  }

  return Promise.resolve()
}
