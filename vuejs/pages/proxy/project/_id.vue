<template>
  <b-row class="row justify-content-center" ref="iframeBox">
      <!-- <div class="content-frame content" style="min-height: 910px;"> -->
      <!-- window.innerWidth window.innerHeight -->
      <!-- width="{{width}}" height="{{height}}" -->
      <iframe
        v-if="item.token"
        :width="canvasWidth"
        :height="canvasHeight"
        allowfullscreen
        frameborder="0"
        :src="'http://localhost:8087/?tokenapp=' + item.token"
      ></iframe>
  </b-row>
</template>

<script>
import { get, sync } from "vuex-pathify";

export default {
  async asyncData(context) {
    let [getDataRes, getListRes] = await Promise.all([
      context.store.dispatch("permissions/getItem", context)
    ]);
  },
  data() {
    return {
      canvasHeight: 0,
      canvasWidth: 0
    };
  },
  computed: {
    item: get("permissions/item")
  },
  components: {},
  methods: {
    adjustSize() {
      var thus =  this;
      setTimeout(function(){
        console.log("refs", thus.$parent.$el.children )
        _.forEach(thus.$parent.$el.children, function(dataDiv, key){
          if(dataDiv.className == 'app-body'){
            _.forEach(dataDiv.children, function(data, key){
              if(data.className =="main"){
                thus.canvasHeight = data.clientHeight;
                thus.canvasWidth = data.clientWidth;
              }
            });
          }
        });
      });
    }
  },
  beforeDestroy: function() {
    window.removeEventListener("resize", this.adjustSize);
  },
  mounted() {
    this.adjustSize();
    window.addEventListener("resize", this.adjustSize);
  }
};
</script>
