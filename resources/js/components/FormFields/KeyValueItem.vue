<template>
  <div class="flex items-center key-value-item" v-if="isNotObject">
    <div class="flex flex-grow border-b border-50 key-value-fields">
      <div :class="{ 'bg-30': readOnlyKeys || !isEditable }" class="w-48 cursor-text">
        <textarea
          :class="{
            'bg-white': !isEditable || readOnlyKeys,
            'hover:bg-20 focus:bg-white': isEditable && !readOnlyKeys,
          }"
          :disabled="!isEditable || readOnlyKeys"
          :dusk="`key-value-key-${index}`"
          @focus="handleKeyFieldFocus"
          class="font-mono text-sm resize-none block min-h-input w-full form-control form-input form-input-row py-4 text-90"
          ref="keyField"
          style="background-clip: border-box;"
          type="text"
          v-model="item.key"
        />
      </div>

      <div @click="handleValueFieldFocus" class="flex-grow border-l border-50">
        <textarea
          :class="{
            'bg-white': !isEditable,
            'hover:bg-20 focus:bg-white': isEditable,
          }"
          :disabled="!isEditable"
          :dusk="`key-value-value-${index}`"
          @focus="handleValueFieldFocus"
          class="font-mono text-sm block min-h-input w-full form-control form-input form-input-row py-4 text-90"
          ref="valueField"
          type="text"
          v-model="item.value"
        />
      </div>
    </div>

    <div class="flex justify-center h-11 w-11 absolute" style="right: -50px;" v-if="isEditable && canDeleteRow">
      <button
        class="btn dim cursor-pointer rounded-lg mx-auto text-primary rounded-b-lg flex justify-center"
        tabindex="-1"
        type="button"
      >
        <icon height="24" type="add" view-box="0 0 24 24" width="24" />
      </button>
      <button
        @click="$emit('remove-row', item.id)"
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
    item: Object,
    disabled: {
      type: Boolean,
      default: false,
    },
    readOnly: {
      type: Boolean,
      default: false,
    },
    readOnlyKeys: {
      type: Boolean,
      default: false,
    },
    canDeleteRow: {
      type: Boolean,
      default: true,
    },
  },

  mounted() {
    autosize(this.$refs.keyField);
    autosize(this.$refs.valueField);
  },

  methods: {
    handleKeyFieldFocus() {
      this.$refs.keyField.select();
    },

    handleValueFieldFocus() {
      this.$refs.valueField.select();
    },
  },

  computed: {
    isNotObject() {
      return !(this.item.value instanceof Object);
    },
    isEditable() {
      return !this.readOnly && !this.disabled;
    },
  },
};
</script>
