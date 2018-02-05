<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-9">
        <div class="card-group">
          <div class="card p-4">
            <div class="card-body" @keyup.enter="login(user)">
              <h1>Login</h1>
              <p class="text-muted">Sign In to your account</p>
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text">
                    <i class="fa fa-user"></i>
                  </span>
                </div>
                <input
                  type="text"
                  name="username"
                  v-model="user.login"
                  class="form-control"
                  placeholder="Username"
                >
              </div>
              <div class="input-group mb-4">
                <div class="input-group-prepend">
                  <span class="input-group-text">
                    <i class="fa fa-lock"></i>
                  </span>
                </div>
                <input
                  type="password"
                  name="password"
                  v-model="user.password"
                  v-bind:class="{ 'is-invalid' : hasError }"
                  class="form-control"
                  placeholder="Password"
                >
                <div
                  data-cy="errorLogin"
                  class="invalid-feedback"
                >Error during authentification, please enter the right credentials</div>
              </div>
              <div class="row">
                <div class="col-6">
                  <button type="button" class="btn btn-primary px-4" @click="login(user)">Login</button>
                </div>
                <!--<div class="col-6 text-right">-->
                <!--<button type="button" class="btn btn-link px-0">Forgot password?</button>-->
                <!--</div>-->
              </div>
            </div>
          </div>
          <div class="card text-white bg-primary py-5">
            <div class="card-body text-center">
              <div>
                <h2>Sign up</h2>
                <p>Let's explore new horizon!</p>
                <!--<button type="button" class="btn btn-primary active mt-3">-->
                <button-custom
                  data-cy="registerLink"
                  name="Register Now!"
                  url="/register"
                  class="link-color"
                  btnClasses="btn-primary active mt-3"
                />
                <!--</button>-->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ButtonCustom from "./ButtonCustom";

export default {
  name: "login",
  components: {
    ButtonCustom
  },
  data: function() {
    return {
      hasError: false
    };
  },
  computed: {
    user() {
      return { login: "", password: "" };
    }
  },
  methods: {
    login(data) {
      var thus = this;
      this.$store
        .dispatch("users/login", data)
        .then(function(response) {
          console.log("successful login ");
          // route to homepage
          thus.$router.push("/");
        })
        .catch(function(error) {
          console.log("error login ", error);
          if (error.response.status == 401) thus.hasError = true;
        });
    }
  }
};
</script>

<style>
.link-color > a {
  color: white;
}
</style>
