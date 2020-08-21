<template>
  <default-field :errors="errors" :field="field" :full-width-content="true">
    <template slot="field">
      <KeyValueTable :can-delete-row="field.canDeleteRow" :edit-mode="!field.readonly">
        <div class="bg-white overflow-hidden key-value-items">
          <KeyValueItem
            :can-delete-row="field.canDeleteRow"
            :index="index"
            :item.sync="item"
            :key="item.id"
            :read-only="field.readonly"
            :read-only-keys="field.readonlyKeys"
            :ref="item.id"
            @remove-row="removeRow"
            v-for="(item, index) in theData"
          />
        </div>
      </KeyValueTable>
      <div class="relative mr-12 mt-3 flex">
        <div class="flex flex-grow justify-center" v-for="n in columnCount">
          <button
            @click="removeColumn(n)"
            class="appearance-none cursor-pointer text-70 hover:text-danger active:outline-none active:shadow-outline focus:outline-none focus:shadow-outline"
            tabindex="-1"
            title="Delete"
            type="button"
          >
            <icon />
          </button>
        </div>
      </div>
      <div class="mr-12 flex" v-if="!field.readonly && !field.readonlyKeys && field.canAddRow">
        <button
          @click="addRowAndSelect"
          class="btn btn-link dim cursor-pointer rounded-lg mx-auto text-primary mt-3 px-3 rounded-b-lg flex items-center"
          type="button"
        >
          <icon height="24" type="add" view-box="0 0 24 24" width="24" />
          <span class="ml-1">{{ field.actionText }}</span>
        </button>
        <button
          @click="addColumnAndSelect"
          class="btn btn-link dim cursor-pointer rounded-lg mx-auto text-primary mt-3 px-3 rounded-b-lg flex items-center"
          tabindex="-1"
          type="button"
        >
          <icon height="24" type="add" view-box="0 0 24 24" width="24" />
          <span class="ml-1">{{ 'Add Column' }}</span>
        </button>
      </div>
    </template>
  </default-field>
</template>

<script>
import { FormField, HandlesValidationErrors } from 'laravel-nova';
import KeyValueItem from './KeyValueItem';
import KeyValueTable from './KeyValueTable';
import autosize from 'autosize';

function guid() {
  var S4 = function () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  return S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4();
}

export default {
  mixins: [HandlesValidationErrors, FormField],

  components: { KeyValueTable, KeyValueItem },

  data: () => ({ theData: [] }),

  mounted() {
    this.theData = _.map(this.value || {}, (value, key) => ({
      id: guid(),
      key,
      value,
    }));
    if (this.theData.length === 0) {
      this.addRow();
    }
  },

  methods: {
    /**
     * Provide a function that fills a passed FormData object with the
     * field's internal value attribute.
     */
    fill(formData) {
      formData.append(this.field.attribute, JSON.stringify(this.finalPayload));
    },

    /**
     * Add a row to the table.
     */
    addRow() {
      return _.tap(guid(), id => {
        this.theData = [...this.theData, { id, key: '', value: Array(this.columnCount).join('.').split('.') }];
        return id;
      });
    },

    /**
     * Add a column to the table.
     */
    addColumn() {
      this.theData.forEach((_, index) => {
        this.theData[index].value.push('');
      });
    },

    /**
     * Add a row to the table and select its first field.
     */
    addRowAndSelect() {
      return this.selectRow(this.addRow());
    },

    /**
     * Remove the row from the table.
     */
    removeRow(id) {
      return _.tap(
        _.findIndex(this.theData, row => row.id === id),
        index => this.theData.splice(index, 1)
      );
    },

    /**
     * Remove the column from the table.
     */
    removeColumn(index) {
      return this.theData.map(data => {
        data.value.splice(index - 1, 1);
        return data;
      });
    },

    /**
     * Add a column to the row and select its last field.
     */
    addColumnAndSelect() {
      return this.selectColumn(this.addColumn());
    },

    /**
     * Select the first field in a row with the given ref ID.
     */
    selectRow(refId) {
      return this.$nextTick(() => {
        this.$refs[refId][0].$refs.columnFields[0].select();
      });
    },

    /**
     * Select the last field in a row with the given ref ID.
     */
    selectColumn() {
      return this.$nextTick(() => {
        Object.values(this.$refs)
          .map(ref => autosize(ref[0].$refs.columnFields))[0]
          .slice(-1)[0]
          .select();
      });
    },
  },

  computed: {
    /**
     * Return the final filtered json object
     */
    finalPayload() {
      return _(this.theData)
        .map(row => (row && row.key ? [row.key, row.value] : undefined))
        .reject(row => row === undefined)
        .fromPairs()
        .value();
    },

    columnCount() {
      return this.theData[0] ? this.theData[0].value.length : 1;
    },
  },
};
</script>
