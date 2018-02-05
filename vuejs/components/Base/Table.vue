<template>
  <b-card :header="caption">
    <b-table
      :dark="dark"
      :hover="hover"
      :striped="striped"
      :bordered="bordered"
      :small="small"
      :fixed="fixed"
      responsive="sm"
      :items="items"
      :fields="captions"
      :current-page="currentPage"
      :per-page="perPage"
      :sort-by="sortBy"
      :sort-desc="sortDesc"
      :busy.sync="busySync"
      :no-sort-reset="noSortReset"
      @context-changed="contextChanged"
      :no-local-sorting="noLocalSorting"
    >
      <template slot="top-row" slot-scope="row">
        <td v-for="(value, key) in row.fields" :key="key" style="padding:0px">
          <b-form-input
            @keydown.enter.native="filterChanged"
            v-model="filterData[value.key]"
            type="text"
            v-bind:placeholder="'Filter ' + value.label"
            v-if="value.filterable"
          ></b-form-input>
          <a
            v-if="value.searchButton"
            @click="filterChanged"
            style="color:#fff"
            class="btn btn-success"
          >
            <i class="fa fa-search-plus"></i>
          </a>
        </td>
      </template>
      <template slot="actions" slot-scope="data">
        <span v-for="(value, key) in data.item.actions" :key="key" class="ml-2" v-if="value.show">
          <nuxt-link
            v-if="!value.deleteModal && !value.addItem && !value.removeItem"
            style="color:#fff"
            :class="value.class"
            :to="value.path"
          >
            <i :class="value.icon"></i>
          </nuxt-link>
          <b-btn v-if="value.addItem" @click="addItemChanged(value.id)" :class="value.class">
            <i :class="value.icon"></i>
          </b-btn>
          <b-btn v-if="value.removeItem" @click="removeItemChanged(value.id)" :class="value.class">
            <i :class="value.icon"></i>
          </b-btn>
          <b-btn v-if="value.deleteModal" @click="requestDelete(value.id)" :class="value.class">
            <i :class="value.icon"></i>
          </b-btn>
        </span>
      </template>
    </b-table>
    <b-modal
      ref="modal"
      @ok="acceptDelete"
      ok-title="Yes"
      title="Do you really want to delete this item?"
    ></b-modal>
    <div class="row" v-if="pagination">
      <div class="col-md-12 text-center">
        <b-pagination
          :total-rows="totalRows"
          :per-page="perPage"
          v-model="currentPage"
          prev-text="Prev"
          next-text="Next"
          data-cy="pagination-table"
        />
      </div>
      <div class="col-md-12 text-center">
        <span class="float-md-right">
          Showing {{ offset==0 ? 1 : offset }} to {{ (limit + offset) > count ? count : (limit + offset) }} of {{ count }} entries -
          Items per page :
          <label>
            <select
              v-on:change="nbItemsChanged"
              v-model="nbItem"
              class="custom-select custom-select-sm form-control form-control-sm"
              data-cy="select-table"
            >
              <option v-for="(nb, key) in nbItemsData" :key="key" :value="nb">{{nb}}</option>
            </select>
          </label>
        </span>
      </div>
    </div>
    <div class="float-none"></div>
  </b-card>
</template>

<script>
export default {
  name: "c-table",
  inheritAttrs: false,
  props: {
    contextChanged: {},
    caption: {
      type: String,
      default: "Table"
    },
    busySync: {
      type: Boolean,
      default: false
    },
    hover: {
      type: Boolean,
      default: false
    },
    noLocalSorting: {
      type: Boolean,
      default: true
    },
    noSortReset: {
      type: Boolean,
      default: true
    },
    striped: {
      type: Boolean,
      default: false
    },
    bordered: {
      type: Boolean,
      default: false
    },
    small: {
      type: Boolean,
      default: true
    },
    fixed: {
      type: Boolean,
      default: false
    },
    tableData: {
      type: [Array, Function],
      default: () => []
    },
    fields: {
      type: [Array, Object],
      default: () => []
    },
    nbItems: {
      type: [Array],
      default: function() {
        return [10, 25, 50, 75, 100];
      }
    },
    filter: {
      default: function() {
        return {};
      }
    },
    perPage: {
      type: Number,
      default: 10
    },
    pagination: {
      type: Boolean,
      default: true
    },
    dark: {
      type: Boolean,
      default: false
    },
    sortBy: {
      type: String
    },
    componentBehavior: {
      type: String
    },
    sortDesc: {
      type: Boolean,
      default: false
    },
    count: {
      type: Number
    },
    limit: {
      type: Number
    },
    offset: {
      type: Number
    }
  },
  data() {
    return {
      offsetData: this.offset,
      filterData: this.filter,
      nbItem: this.perPage,
      itemToDelete: null
    };
  },
  computed: {
    currentPage: {
      get: function() {
        return this.offsetData / this.perPage + 1;
      },
      set: function(data) {
        this.offsetData = (data - 1) * this.perPage;
      }
    },
    items: function() {
      const items = this.tableData;
      return Array.isArray(items) ? items : items();
    },
    totalRows: function() {
      return this.getRowCount();
    },
    captions: function() {
      return this.fields;
    },
    nbItemsData: function() {
      return _.union([this.perPage], this.nbItems);
    }
  },
  methods: {
    getRowCount: function() {
      return this.count;
    },
    filterChanged() {
      this.$emit("filterEvent", this.filterData);
    },
    nbItemsChanged() {
      this.$emit("nbItemsEvent", this.nbItem);
    },
    addItemChanged(ctx) {
      this.$emit("addItemEvent", ctx);
    },
    removeItemChanged(ctx) {
      this.$emit("removeItemEvent", ctx);
    },
    acceptDelete(evt) {
      this.$emit("deleteItemEvent", this.itemToDelete);
    },
    requestDelete(data) {
      this.itemToDelete = data;
      this.showModal();
    },
    showModal() {
      this.$refs.modal.show();
    },
    hideModal() {
      this.$refs.modal.hide();
    }
  }
};
</script>