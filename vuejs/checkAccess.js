export default {
  getAdminAccess: function(state){
      var adminAccess = false;
      if(state.users.user){
        if(typeof(state.users.user.admin) != 'undefined'){
          if(state.users.user.admin)
            adminAccess = true;
        }
        if(typeof(state.users.user.groups) != 'undefined'){
           _.forEach(state.users.user.groups, function(group, key) {
             _.forEach(group.roles, function(role, key) {
               if(role.name == "Admin")
                 adminAccess = true;
             });
           });
        }
      }

    return adminAccess;
  }
}
