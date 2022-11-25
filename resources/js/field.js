import DetailField from './components/DetailField.vue';
import FormField from './components/FormFields/TableField.vue';

Nova.booting(app => {
  // Nova Table Field...
  app.component('detail-nova-table-field', DetailField);
  app.component('form-nova-table-field', FormField);
});
