<template>
<div>
<div class="flex justify-between" v-if="qrCodeDataUrl">
        <q-btn @click="selectedFrame('simple')"> <div style="display: flex; flex-direction: column;">
          <div style="width:50px;height:50px;border:2px solid black;"></div>
          <div style="width:60px;height:15px;background-color:black;margin-left:-5px;color:white;border-radius:5px;border-top-right-radius:0px;border-top-left-radius:0px"><span style="font-size:8px;">scan me</span></div>
        </div></q-btn>
        <q-btn @click="selectedFrame('bold')"> <div style="display: flex; flex-direction: column;">
          <div style="width:50px;height:50px;border:4px solid black"></div>
         <div style="width:60px;height:15px;background-color:black;margin-left:-5px;color:white;border-radius:5px;border-top-right-radius:0px;border-top-left-radius:0px"><span style="font-size:8px;">scan me</span></div>
       </div> </q-btn>
        <q-btn @click="selectedFrame('dotted')"> <div style="display: flex; flex-direction: column;">
          <div style="width:50px;height:50px;border:2px dashed black"></div>
          <div style="width:60px;height:15px;background-color:black;margin-left:-5px;color:white;border-radius:5px;border-top-right-radius:0px;border-top-left-radius:0px"><span style="font-size:8px;">scan me</span></div>
         </div> </q-btn>
        <q-btn @click="selectedFrame('double')"> <div style="display: flex; flex-direction: column;">
           <div style="width:50px;height:50px;border:4px double black"></div>
           <div style="width:60px;height:15px;background-color:black;margin-left:-5px;color:white;border-radius:5px;border-top-right-radius:0px;border-top-left-radius:0px"><span style="font-size:8px;">scan me</span></div>
          </div> </q-btn>
      </div>
      <div v-if="qrCodeDataUrl" class="q-mt-xl flex justify-between">
          <q-input filled v-model="borderColor" @input="generateQRCode" label="Frame Color" required >
            <template v-slot:append>
              <q-btn icon="palette" @click="showColorPickerFrame"  :style="{backgroundColor:borderColor}" />
            </template>
          </q-input>
           <q-btn @click="generateQRCode" label="Add Frame Color" color="positive" />
            <q-color @input="selectColorFrame" v-model="borderColor" v-if="showFrameColorPicker" />
        </div>
</div>

        </template>

<script>
  export default {
  methods: {
    selectedFrame(frame) {
      this.$emit('frame-selected', frame);
    }
  }
}
</script>
