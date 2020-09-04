<template>
  <panel-item :field="field">
    <template slot="value">
      <Table :edit-mode="false" class="overflow-hidden" v-if="theData.length > 0">
        <div class="bg-white overflow-hidden">
          <TableRow :disabled="true" :key="index" :row="row" v-for="(row, index) in theData" />
        </div>
      </Table>
    </template>
  </panel-item>
</template>

<script>
import TableRow from './FormFields/TableRow';
import Table from './FormFields/Table';

export default {
  props: ['resource', 'resourceName', 'resourceId', 'field'],

  components: { Table, TableRow },

  data: () => ({ theData: [] }),

  created() {
    let valuesArray = Array.isArray(this.field.value) ? this.field.value : JSON.parse(this.field.value);
    if (!Array.isArray(valuesArray) || !valuesArray.length) valuesArray = [];

    this.theData = _.map(valuesArray, cells => ({ cells }));
  },
};
</script>
