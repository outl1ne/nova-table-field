<template>
  <div class="relative bg-30 bg-clip border border-60" :class="{ 'mr-12': editMode && deleteRowEnabled }">
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    deleteRowEnabled: {
      type: Boolean,
      default: true,
    },
    editMode: {
      type: Boolean,
      default: true,
    },
  },
};
</script>
