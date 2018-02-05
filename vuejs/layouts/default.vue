<template>
  <div class="app">
    <AppHeader/>
    <div class="app-body">
      <Sidebar :navItems="nav"/>
      <main class="main">
        <!--<breadcrumb :list="list"/>-->
        <nuxt-child/>
      </main>
      <!-- <AppAside/> -->
    </div>
    <AppFooter/>
  </div>
</template>

<script>
import nav from "../_nav";
import {
  Header as AppHeader,
  Sidebar,
  Aside as AppAside,
  Footer as AppFooter,
  Breadcrumb
} from "../components/";

export default {
  name: 'Main',
  head: {
    bodyAttrs: {
      class: "app header-fixed sidebar-fixed aside-menu-hidden"
    }
  },
  components: {
    AppHeader,
    Sidebar,
    AppAside,
    AppFooter,
    Breadcrumb
  },
  data() {
    return {
      nav: nav.items
    };
  },
  computed: {
    name() {
      return this.$route.name;
    },
    list() {
      return this.$route.matched;
    }
  }
};
</script>

<style>
html {
  font-family: "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}
</style>
