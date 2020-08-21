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
    this.theData = _.map(this.field.value || {}, cells => ({ cells }));
  },
};
</script>
