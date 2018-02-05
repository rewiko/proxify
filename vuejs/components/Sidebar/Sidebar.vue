<template>
  <div data-cy="sidebar" class="sidebar">
    <SidebarHeader/>
    <SidebarForm/>
    <nav class="sidebar-nav">
      <div slot="header"></div>
      <ul class="nav">
        <template v-for="(item, index) in navItemsComp">
          <template v-if="item.title">
            <SidebarNavTitle
              :name="item.name"
              :classes="item.class"
              :wrapper="item.wrapper"
              v-bind:key="index"
            />
          </template>
          <template v-else-if="item.divider">
            <SidebarNavDivider :classes="item.class" v-bind:key="index"/>
          </template>
          <template v-else-if="item.label">
            <SidebarNavLabel
              :name="item.name"
              :url="item.url"
              :icon="item.icon"
              :label="item.label"
              :classes="item.class"
              v-bind:key="index"
            />
          </template>
          <template v-else>
            <template v-if="item.children">
              <!-- First level dropdown -->
              <SidebarNavDropdown
                :name="item.name"
                :url="item.url"
                :icon="item.icon"
                v-bind:key="index"
              >
                <template v-for="(childL1, index) in item.children">
                  <template v-if="childL1.children">
                    <!-- Second level dropdown -->
                    <SidebarNavDropdown
                      :name="childL1.name"
                      :url="childL1.url"
                      :icon="childL1.icon"
                      v-bind:key="index"
                    >
                      <li
                        class="nav-item dropdown-item"
                        v-for="(childL2, index) in childL1.children"
                        v-bind:key="index"
                      >
                        <SidebarNavLink
                          :name="childL2.name"
                          :url="childL2.url"
                          :icon="childL2.icon"
                          :badge="childL2.badge"
                          :variant="item.variant"
                        />
                      </li>
                    </SidebarNavDropdown>
                  </template>
                  <template v-else>
                    <SidebarNavItem :classes="item.class" v-bind:key="index">
                      <SidebarNavLink
                        :name="childL1.name"
                        :url="childL1.url"
                        :icon="childL1.icon"
                        :badge="childL1.badge"
                        :variant="item.variant"
                      />
                    </SidebarNavItem>
                  </template>
                </template>
              </SidebarNavDropdown>
            </template>
            <template v-else>
              <SidebarNavItem :classes="item.class" v-bind:key="index">
                <SidebarNavLink
                  :name="item.name"
                  :url="item.url"
                  :icon="item.icon"
                  :badge="item.badge"
                  :variant="item.variant"
                />
              </SidebarNavItem>
            </template>
          </template>
        </template>
      </ul>
      <slot></slot>
    </nav>
    <SidebarFooter/>
    <SidebarMinimizer/>
  </div>
</template>
<script>
import SidebarFooter from "./SidebarFooter";
import SidebarForm from "./SidebarForm";
import SidebarHeader from "./SidebarHeader";
import SidebarMinimizer from "./SidebarMinimizer";
import SidebarNavDivider from "./SidebarNavDivider";
import SidebarNavDropdown from "./SidebarNavDropdown";
import SidebarNavLink from "./SidebarNavLink";
import SidebarNavTitle from "./SidebarNavTitle";
import SidebarNavItem from "./SidebarNavItem";
import SidebarNavLabel from "./SidebarNavLabel";

import CheckAccess from "../../checkAccess";

import { get, sync } from "vuex-pathify";

export default {
  name: "sidebar",
  props: {
    navItems: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  watch: {
    $route(to, from) {
      this.navItemsComp = this.generateItem(to);
    }
  },
  mounted: function() {
    this.navItemsComp = this.generateItem(this.$router.currentRoute);
  },
  data: function() {
    return {
      navItemsComp: this.navItems
    };
  },
  components: {
    SidebarFooter,
    SidebarForm,
    SidebarHeader,
    SidebarMinimizer,
    SidebarNavDivider,
    SidebarNavDropdown,
    SidebarNavLink,
    SidebarNavTitle,
    SidebarNavItem,
    SidebarNavLabel
  },
  methods: {
    generateItem(route) {
      var items = [
        {
          name: 'My projects',
          url: '/proxy/projects',
          icon: 'fa fa-list'
        }];

      var adminMenu = [
        {
          name: 'Administration',
          url: '#',
          icon: 'fa fa-gear',
          children: [
            {
              name: 'Projects',
              url: '/admin/projects',
              icon: 'fa fa-list'
            },
            {
              name: 'Create Project',
              url: '/admin/project',
              icon: 'fa fa-plus'
            },
            {
              name: 'Permissions',
              url: '/admin/permissions',
              icon: 'fa fa-list'
            },
            {
              name: 'Create Permission',
              url: '/admin/permission',
              icon: 'fa fa-plus'
            },
            {
              name: 'Routes',
              url: '/admin/routes',
              icon: 'fa fa-list'
            },
            {
              name: 'Create Route',
              url: '/admin/route',
              icon: 'fa fa-plus'
            },
            {
              name: 'Roles',
              url: '/admin/roles',
              icon: 'fa fa-list'
            },
            {
              name: 'Create Role',
              url: '/admin/role',
              icon: 'fa fa-plus'
            },
            {
              name: 'Groups',
              url: '/admin/groups',
              icon: 'fa fa-list'
            },
            {
              name: 'Create Group',
              url: '/admin/group',
              icon: 'fa fa-plus'
            },
            {
              name: 'Users',
              url: '/admin/users',
              icon: 'fa fa-list'
            },
            {
              name: 'Create User',
              url: '/admin/user',
              icon: 'fa fa-plus'
            },
          ]
        }
      ];

      var addAdminMenu = CheckAccess.getAdminAccess(this.$store.state);
      if(addAdminMenu)
        items = _.union(items, adminMenu);

      var currentItem = this.$store.state.permissions.item;
      if (route.name == "proxy-project-id") {
        var item = {
          name: currentItem.application.name,
          url: this.$router.currentRoute.path,
          icon: "fa fa-eye"
        };

        return _.union([item], items);
      } else {
        return items;
      }
    },
    handleClick(e) {
      e.preventDefault();
      e.target.parentElement.classList.toggle("open");
    }
  }
};
</script>

<style lang="css">
.nav-link {
  cursor: pointer;
}
</style>
