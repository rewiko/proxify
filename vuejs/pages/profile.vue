<template>
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card mx-12">
            <div class="card-body p-12" @keyup.enter="update(user)">
              <h1>Your profile</h1>
              <form>
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text"><i class="fa fa-user"></i></span>
                </div>
                <input data-cy="userField" type="text" v-model="user.username" placeholder="Username"
                            v-bind:class="{ 'is-valid' : success , 'form-control' : true }">
              </div>
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text">@</span>
                </div>
                <input data-cy="emailField" type="text" v-model="user.email" placeholder="Email"
                            v-bind:class="{ 'is-valid' : success , 'form-control' : true }">
              </div>
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text"><i class="fa fa-lock"></i></span>
                </div>
                <input data-cy="passwordField" type="password" v-model="user.password" placeholder="Password"
                            v-bind:class="{ 'is-invalid' : error, 'is-valid' : success , 'form-control' : true }">
              </div>
              <div class="input-group mb-4">
                <div class="input-group-prepend">
                  <span class="input-group-text"><i class="fa fa-lock"></i></span>
                </div>
                <input data-cy="repasswordField" type="password" v-model="user.repassword" placeholder="Repeat password"
                            v-bind:class="{ 'is-invalid' : error, 'is-valid' : success , 'form-control' : true }">
                <div data-cy="errorUpdate" class="invalid-feedback"> {{ error }} </div>
                <div data-cy="successUpdate" class="valid-feedback"> {{ success }} </div>
              </div>
              <div class="col-md-4 pull-right">
                <button type="button" @click="update(user)" class="btn btn-block btn-success">Update</button>
              </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import axios from "@/plugins/axios";

export default {
  asyncData(context) {
    return context.store
      .dispatch("users/fetch")
      .then(res => {
        return {
          user: {
            username: res.data.data.username,
            email: res.data.data.email,
            password: "",
            repassword: ""
          }
        };
      })
      .catch(e => {
        console.log("ERROR Profile vue response api me", e);
        context.error({ statusCode: 500, message: "Unable to get profile" });
      });
  },
  data() {
    return {
      error: null,
      success: null
    };
  },
  methods: {
    update(data) {
      var thus = this;
      thus.error = null;
      thus.success = null;
      var dataToSend = { data: {} };
      if (data.password != "" || data.repassword != "") {
        if (data.password == data.repassword) {
          dataToSend.data.password = data.password;
        } else {
          thus.error = "Password is not matching.";
          return;
        }
      }
      dataToSend.data.username = data.username;
      dataToSend.data.email = data.email;
      this.$store
        .dispatch("users/updateProfile", dataToSend)
        .then(function(response) {
          thus.error = null;
          thus.success = "Profile Updated.";
        })
        .catch(function(error) {
          console.log("Error updating profile ", error);
          if (error.response.data.error) thus.error = error.response.data.error;
        });
    }
  }
};
</script>

