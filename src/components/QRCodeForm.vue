<template>
  <q-form class="q-gutter-md flex justify-between">
    <div>
      <q-input filled v-model="url" label="Enter URL for QR code" placeholder="http://www.example.com" required class="url-input" @keyup="checkUrl" />
      <span style="color:red" v-if="error">URL must start with http or https</span>
    </div>
    <q-input filled v-model="fgColor" label="Foreground Color" placeholder="#000000" required>
      <template v-slot:append>
        <q-btn icon="palette" @click="showColorPickerFg" class="color-picker" :style="{backgroundColor:fgColor}" />
      </template>
    </q-input>
    <q-input filled v-model="bgColor" label="Background Color" required>
      <template v-slot:append>
        <q-btn icon="palette" @click="showColorPickerBg" class="color-picker" :style="{backgroundColor:bgColor}" />
      </template>
    </q-input>
    <q-color @input="selectColor" v-model="fgColor" v-if="showFgColorPicker" />
    <q-color @input="selectColor" v-model="bgColor" v-if="showBgColorPicker" />
  </q-form>
</template>

<script>
export default {
  data() {
    return {
      error: false,
      url: '',
      fgColor: '#000000',
      bgColor: '#FFFFFF',
      // Other data properties...
    };
  },
  methods: {
    checkUrl() {
      const urlRegex = /^(http:\/\/|https:\/\/)/;
      if (!urlRegex.test(this.url.trim())) {
        this.error = true;
        return;
      }
      this.error = false;
    },
    showColorPickerFg() {
      this.showFgColorPicker = !this.showFgColorPicker;
    },
    showColorPickerBg() {
      this.showBgColorPicker = !this.showBgColorPicker;
    },
    selectColor() {
      this.showFgColorPicker = false;
      this.showBgColorPicker = false;
    }
  }
}
</script>
