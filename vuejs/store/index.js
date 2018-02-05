import Vuex from 'vuex'
import pathify from 'vuex-pathify'

import cookie from 'cookie'
import { setAuthToken, resetAuthToken } from '~/utils/token'

import users from './modules/users'
import projects from './modules/projects'
import permissions from './modules/permissions'
import roles from './modules/roles'
import groups from './modules/groups'
import routes from './modules/routes'

console.log('STORE FILE LOADED!')

const createStore = () => {

  console.log('CREATE STORE!')

  return new Vuex.Store({

    plugins: [pathify.plugin],

    modules: {
      users,
      projects,
      permissions,
      roles,
      groups,
      routes,
    },

    actions: {
      nuxtServerInit({ dispatch }, context) {
        return new Promise((resolve, reject) => {
          const cookies = cookie.parse(context.req.headers.cookie || '')
          if (cookies.hasOwnProperty('Authorization')) {
            setAuthToken("Bearer " + cookies['Authorization'])
            dispatch('users/fetch')
              .then(result => {
                resolve(true)
              })
              .catch(error => {
                console.log('Provided token is invalid:', error)
                resetAuthToken()
                resolve(false)
              })
          } else {
            resetAuthToken()
            resolve(false)
          }
        })
      }
    }

  })
}

export default createStore
