<template>
      <b-nav-item-dropdown right no-caret>
        <template slot="button-content">
          <span data-cy="user.firstName"> {{ user.firstName }} </span>
          <img  data-cy="user.gravatar" v-bind:src="'https://www.gravatar.com/avatar/' + user.gravatar" class="img-avatar" v-bind:alt="user.email">
        </template>
        <!--<b-dropdown-header tag="div" class="text-center"><strong>Account</strong></b-dropdown-header>-->
        <!--<b-dropdown-item><i class="fa fa-bell-o"></i> Updates<b-badge variant="info">{{itemsCount}}</b-badge></b-dropdown-item>-->
        <!--<b-dropdown-item><i class="fa fa-envelope-o"></i> Messages<b-badge variant="success">{{itemsCount}}</b-badge></b-dropdown-item>-->
        <!--<b-dropdown-item><i class="fa fa-tasks"></i> Tasks<b-badge variant="danger">{{itemsCount}}</b-badge></b-dropdown-item>-->
        <!--<b-dropdown-item><i class="fa fa-comments"></i> Comments<b-badge variant="warning">{{itemsCount}}</b-badge></b-dropdown-item>-->
        <b-dropdown-header tag="div" class="text-center"><strong>Settings</strong></b-dropdown-header>
        <b-dropdown-item to="/profile">
          <i class="fa fa-user"></i> Profile
        </b-dropdown-item>
        <!--<b-dropdown-item><i class="fa fa-wrench"></i> Settings</b-dropdown-item>-->
        <!--<b-dropdown-item><i class="fa fa-usd"></i> Payments<b-badge variant="secondary">{{itemsCount}}</b-badge></b-dropdown-item>-->
        <!--<b-dropdown-item><i class="fa fa-file"></i> Projects<b-badge variant="primary">{{itemsCount}}</b-badge></b-dropdown-item>-->
        <!--<b-dropdown-divider></b-dropdown-divider>-->
        <!--<b-dropdown-item><i class="fa fa-shield"></i> Lock Account</b-dropdown-item>-->
        <b-dropdown-item data-cy="logout" @click="logout()"><i class="fa fa-lock"></i> Logout</b-dropdown-item>
      </b-nav-item-dropdown>
</template>
<script>
  export default {
    name: 'header-dropdown',
    data: () => {
      return {
        itemsCount: 42
      }
    },
    computed: {
      user () { return this.$store.getters['users/getUser'] || { login: '', password:''}}
    },
    methods: {
      logout () {
        var thus = this;
        this.$store.dispatch('users/reset').then(function(response) {
          console.log("Successful logout");
          // route to homepage
          thus.$router.push('/login');
        }).catch(function(error) {
          console.log("Error logout ", error);
        })
      }
    }
  }
</script>

