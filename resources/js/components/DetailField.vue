<template>
  <panel-item :field="field">
    <template slot="value">
      <KeyValueTable :edit-mode="false" class="overflow-hidden" v-if="theData.length > 0">
        <div class="bg-white overflow-hidden key-value-items">
          <KeyValueItem :disabled="true" :key="index" :row="row" v-for="(row, index) in theData" />
        </div>
      </KeyValueTable>
    </template>
  </panel-item>
</template>

<script>
import KeyValueItem from './FormFields/KeyValueItem';
import KeyValueTable from './FormFields/KeyValueTable';

export default {
  props: ['resource', 'resourceName', 'resourceId', 'field'],

  components: { KeyValueTable, KeyValueItem },

  data: () => ({ theData: [] }),

  created() {
    this.theData = _.map(this.field.value || {}, cells => ({ cells }));
  },
};
</script>
