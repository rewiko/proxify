<template>
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card mx-4">
            <div class="card-body p-4" @keyup.enter="register(user)">
              <h1>Register</h1>
              <p class="text-muted">Create your account</p>
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text"><i class="fa fa-user"></i></span>
                </div>
                <input data-cy="userField" type="text" v-model="user.username" class="form-control" placeholder="Username">
              </div>
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text">@</span>
                </div>
                <input data-cy="emailField" type="text" v-model="user.email" class="form-control" placeholder="Email">
              </div>
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text"><i class="fa fa-lock"></i></span>
                </div>
                <input data-cy="passwordField" type="password" v-model="user.password" class="form-control" placeholder="Password">
              </div>
              <div class="input-group mb-4">
                <div class="input-group-prepend">
                  <span class="input-group-text"><i class="fa fa-lock"></i></span>
                </div>
                <input data-cy="repasswordField" type="password" v-model="user.repassword" class="form-control" placeholder="Repeat password"
                            v-bind:class="{ 'is-invalid' : error }" >
                <div data-cy="errorRegistration" class="invalid-feedback"> {{ error }} </div>
              </div>
              <button type="button" @click="register(user)" class="btn btn-block btn-success">Create Account</button>
            </div>
            <div class="card-footer p-4">
              <div class="row">
                <div class="col-12">
                    <button-custom data-cy="loginLink" name="Already Registered?" url="/login" class="link-color" btnClasses="btn-primary"/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import { mapMutations } from 'vuex'

import ButtonCustom from './ButtonCustom'

export default {
  name: 'register',
  components: {
    ButtonCustom
  },
  data: function () {
    return {
      error: ''
    }
  },
  computed: {
    user () { return { username: '', email:'',
    password: '', repassword: ''}}
  },
  methods: {
    register (data) {
      var thus = this;
      if(data.password == data.repassword){
        this.$store.dispatch('users/register',
          { email: data.email, username: data.username, password: data.password }
        ).then(function(response) {
          console.log("Successful registration");
          thus.$router.push('/');
        }).catch(function(error) {
          console.log("Error registration ", error);
          if(error.response.data.error)
            thus.error = error.response.data.error;
        })
      } else {
          thus.error = "Password is not matching.";
      }
    }
  }
}

</script>

<style>

.link-color > a {
  color: white;
}

</style>
