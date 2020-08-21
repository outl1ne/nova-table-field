<template>
  <div class="flex items-center key-value-item">
    <div class="flex flex-grow border-b border-50 key-value-fields">
      <div
        :key="`column-${index}`"
        @click="handleColumnFieldFocus(index)"
        class="flex-grow border-l border-50"
        v-for="(cell, index) in row.cells"
      >
        <textarea
          :class="{
            'bg-white': !isEditable,
            'hover:bg-20 focus:bg-white': isEditable,
          }"
          :disabled="!isEditable"
          :dusk="`key-value-value-${index}`"
          :key="cell.id"
          @focus="handleColumnFieldFocus(index)"
          class="font-mono text-sm block min-h-input w-full foarm-control form-input form-input-row py-4 text-90"
          ref="columnFields"
          v-model="row.cells[index]"
        />
      </div>
    </div>

    <div class="flex justify-center h-11 w-11 absolute" style="right: -50px;" v-if="isEditable && canDelete">
      <button
        @click="$emit('remove-row', row.id)"
        class="flex appearance-none cursor-pointer text-70 hover:text-danger active:outline-none active:shadow-outline focus:outline-none focus:shadow-outline"
        tabindex="-1"
        title="Delete"
        type="button"
      >
        <icon />
      </button>
    </div>
  </div>
</template>

<script>
import autosize from 'autosize';

export default {
  props: {
    index: Number,
    row: Object,
    disabled: {
      type: Boolean,
      default: false,
    },
    readOnly: {
      type: Boolean,
      default: false,
    },
    canDelete: {
      type: Boolean,
      default: true,
    },
  },

  mounted() {
    autosize(this.$refs.columnFields);
  },

  methods: {
    handleColumnFieldFocus(index) {
      this.$refs.columnFields[index].select();
    },
  },

  computed: {
    isEditable() {
      return !this.readOnly && !this.disabled;
    },
  },
};
</script>
