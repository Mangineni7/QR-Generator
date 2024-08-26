<template>
  <div class="class">
    <!-- Frame image buttons -->
  </div>
</template>

<script>
export default {
  methods: {
    selectedImageFrame(frame) {
      this.$emit('image-frame-selected', frame);
    }
  }
}
</script>
