<template>
  <div v-if="isExternalLink">
    <a :href="url" :class="classList">
      <i :class="icon"></i> {{name}}
      <b-badge v-if="badge && badge.text" :variant="badge.variant">{{badge.text}}</b-badge>
    </a>
  </div>
  <div v-else>
    <router-link :to="url" :class="classList">
      <button :class="btnClassList" type="button">
        <i :class="icon"></i> {{name}}
        <b-badge v-if="badge && badge.text" :variant="badge.variant">{{badge.text}}</b-badge>
      </button>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'button-custom',
  props: {
    name: {
      type: String,
      default: ''
    },
    url: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: ''
    },
    badge: {
      type: Object,
      default: () => {}
    },
    variant: {
      type: String,
      default: ''
    },
    classes: {
      type: String,
      default: ''
    },
    btnClasses: {
      type: String,
      default: ''
    }
  },
  computed: {
    classList () {
      return [
      '',
      this.linkVariant,
      ...this.itemClasses
      ]
    },
    btnClassList () {
      return [
      'btn',
      ...this.btnClass
      ]
    },
    linkVariant () {
      return this.variant ? `nav-link-${this.variant}` : ''
    },
    itemClasses () {
      return this.classes ? this.classes.split(' ') : []
    },
    btnClass () {
      return this.btnClasses ? this.btnClasses.split(' ') : []
    },
    isExternalLink () {
      if (this.url.substring(0, 4) === 'http') {
        return true
      } else {
        return false
      }
    }
  }
}
</script>
