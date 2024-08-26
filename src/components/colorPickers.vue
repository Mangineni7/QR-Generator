<template>
<div class="flex justify-between colors q-mt-lg" style="width:100%" >
          <div>
         <q-input filled v-model="fgColor" label="Foreground Color" placeholder="#000000" required>
          <template v-slot:append>
            <q-btn icon="brush" @click="showColorPickerFg" class="color-picker" :style="{backgroundColor:fgColor}" />
          </template>
        </q-input>
          </div>
          <div class="bgInput">
        <q-input filled v-model="bgColor" label="Background Color" required>
          <template v-slot:append>
            <q-btn icon="brush" @click="showColorPickerBg" class="color-picker" :style="{backgroundColor:bgColor}" />
          </template>
        </q-input>
          </div>
        </div>
        <div >
        <div ref="colorPicker1" >
        <q-color @click="generateQRStyles" v-model="fgColor" v-if="showFgColorPicker" class="color-picker-overlay1" />
        </div>
        <div  ref="colorPicker2" >
        <q-color @click="generateQRStyles"  v-model="bgColor" v-if="showBgColorPicker" class="color-picker-overlay2" />
        </div>
        </div>

</template>
<script>
export default {
  emits:['callColorPicker'],
 // props:['initialFgColor','initialBgColor'],
    data(){
        return{
            showFgColorPicker:false,
            showBgColorPicker:false

        }
    },
    computed: {
    fgColor: {
      get() {
        return this.$store.state.fgColor;
      },
      set(value) {
        this.$store.commit('toggleFg', value);
      },
    },
    bgColor: {
      get() {
        return this.$store.state.bgColor;
      },
      set(value) {
        this.$store.commit('toggleBg', value);
      },
    },
  },
    methods:{
        showColorPickerFg(event) {
       event.stopPropagation();

      // Toggle the color picker visibility
      this.showFgColorPicker = !this.showFgColorPicker;

      // If color picker is opened, add event listener to close it on outside click
      if (this.showFgColorPicker) {
        this.showBgColorPicker = false
        document.addEventListener('click', this.closeColorPickerOnClickOutside);
      } else {
        document.removeEventListener('click', this.closeColorPickerOnClickOutside);
      }
    },
    closeColorPickerOnClickOutside(event) {
      // Check if the click occurred outside the color picker or its button
     if (this.$refs.colorPicker1 && !this.$refs.colorPicker1.contains(event.target) && !this.$refs.colorPicker2.contains(event.target)) {
        this.showFgColorPicker = false;
        this.showBgColorPicker = false;
    document.removeEventListener('click', this.closeColorPickerOnClickOutside);
  }
    },
    showColorPickerBg(event) {
       event.stopPropagation();
      this.showBgColorPicker = !this.showBgColorPicker;
       if (this.showBgColorPicker) {
        this.showFgColorPicker = false
        document.addEventListener('click', this.closeColorPickerOnClickOutside);
      } else {
        document.removeEventListener('click', this.closeColorPickerOnClickOutside);
      }
    },
    generateQRStyles(){
        this.$emit('callColorPicker', {fgColor:this.fgColor,bgColor:this.bgColor})
    }
    }


}
</script>
<style>

</style>