<template>
<div>
    <h6>Add frames</h6>
        <div class="frames">
        <div style="display:inline-flex">
        <q-btn @click="selectedFrame('simple')" style="margin-left:45px"> <div style="display: flex; flex-direction: column;">
          <div style="width:50px;height:50px;border:2px solid black;"></div>
          <div style="width:60px;height:15px;background-color:black;margin-left:-5px;color:white;border-radius:5px;border-top-right-radius:0px;border-top-left-radius:0px"><span style="font-size:8px;">scan me</span></div>
        </div></q-btn>
        <q-btn @click="selectedFrame('bold')" style="margin-left:45px"> <div style="display: flex; flex-direction: column;">
          <div style="width:50px;height:50px;border:4px solid black"></div>
         <div style="width:60px;height:15px;background-color:black;margin-left:-5px;color:white;border-radius:5px;border-top-right-radius:0px;border-top-left-radius:0px"><span style="font-size:8px;">scan me</span></div>
         </div> </q-btn>
        <q-btn @click="selectedFrame('dotted')" style="margin-left:45px"> <div style="display: flex; flex-direction: column;">
          <div style="width:50px;height:50px;border:2px dashed black"></div>
          <div style="width:60px;height:15px;background-color:black;margin-left:-5px;color:white;border-radius:5px;border-top-right-radius:0px;border-top-left-radius:0px"><span style="font-size:8px;">scan me</span></div>
         </div> </q-btn>
        <q-btn @click="selectedFrame('double')" style="margin-left:45px"> <div style="display: flex; flex-direction: column;">
           <div style="width:50px;height:50px;border:4px double black"></div>
           <div style="width:60px;height:15px;background-color:black;margin-left:-5px;color:white;border-radius:5px;border-top-right-radius:0px;border-top-left-radius:0px"><span style="font-size:8px;">scan me</span></div>
          </div> </q-btn>
      </div>
        </div>
      <div  class="q-mt-xl flex justify-between" style="width:100%" >
          <q-input filled v-model="borderColor" @input="generateQRCode" label="Frame Color" class="addStyles" required >
            <template v-slot:append>
              <q-btn icon="palette" @click="showColorPickerFrame" class="color-picker"  :style="{backgroundColor:borderColor}" />
            </template>
          </q-input>
           <q-btn @click="generateQRCode" label="Add Frame Color" color="positive" class="addStyles" />
            <div ref="picker1">
            <q-color @click="generateQrCodes" v-model="borderColor" v-if="showFrameColorPicker"  class="color-picker-overlay3" />
            </div>
        </div>
         <div class=" q-mt-md flex justify-between " style="width:100%" >
          <q-input @keyup="generateQrCodes" filled v-model="text"  label="Text" class="text" >
            <template v-slot:append>
                <q-btn icon="font_download" @click="toggleFontOptions" />
           </template>
          </q-input>


         <q-input filled v-model="textcolor" label="Text-color" class="text bgInput" >
          <template v-slot:append>
            <q-btn icon="palette" @click="showTextColor" class="color-picker" :style="{backgroundColor:textcolor}"></q-btn>
          </template>
         </q-input>
         <div ref="picker2">
         <q-color @click="generateQrCodes" v-model="textcolor" v-if="showtextColorPicker"  class="color-picker-overlay4" />
         </div>
         </div>
         <div class="relative-container"   ref="fontPicker">
         <div v-if="fontSelector" class="font-options-overlay" >
          <div class="font-options">
          <div v-for="font in fontOptions" :key="font" @click="applyFontStyle(font)" style="cursor:pointer">
              {{ font }}
              </div>
          </div>
         </div>
      </div>

</div>

 </template>

<script>
  export default {
    data(){

      return{
        showFrameColorPicker:false,
        showtextColorPicker:false,
        fontSelector:false,
        text:'Scan me',
        borderColor: '#000000',
        textcolor:'#FFFFFF',
     fontOptions: [ 'Arial, sans-serif' ,'Helvetica, sans-serif'  , 'Times New Roman, serif' ,
                    'Courier New, monospace' , 'Verdana, Geneva, sans-serif' ,'Georgia, serif',
                    'Palatino, serif','Garamond, serif',  'Bookman, serif',
                    'Trebuchet MS, sans-serif',   'Arial Black, sans-serif', 'Impact, sans-serif', 'wide'
],

      }

    },
  methods: {
    generateQrCodes(){
      this.$emit('callGenerate-Qr',{borderColor:this.borderColor, textColor:this.textcolor, text:this.text})
    },
    applyFontStyle(font){
      this.$emit('font-selector', font)

    },
    selectedFrame(frame) {
      this.$emit('frame-selected' , frame)
    },
    toggleFontOptions(event) {
      event.stopPropagation()
    this.fontSelector = !this.fontSelector;
    if(this.fontSelector){
      this.showFrameColorPicker = false
      this.showtextColorPicker = false
      document.addEventListener('click' ,this.closeColorPicker)
    }
  },
  showColorPickerFrame(event) {
  event.stopPropagation();
  this.showFrameColorPicker = !this.showFrameColorPicker;

  if (this.showFrameColorPicker) {
    this.showtextColorPicker = false;
     this.fontSelector = false
    document.addEventListener('click', this.closeColorPicker);
  } else {
    document.removeEventListener('click', this.closeColorPicker);
  }
},
showTextColor(event) {
  event.stopPropagation();
  this.showtextColorPicker = !this.showtextColorPicker;

  if (this.showtextColorPicker) {
    this.showFrameColorPicker = false;
    this.fontSelector = false // Close frame color picker
    document.addEventListener('click', this.closeColorPicker);
  } else {
    document.removeEventListener('click', this.closeColorPicker);
  }
},
closeColorPicker(event) {
  const fontPicker = this.$refs.fontPicker;
  const picker1 = this.$refs.picker1;
  const picker2 = this.$refs.picker2;

  if (!picker1 || !picker2 || !fontPicker) {
    return;
  }
if (!picker1.contains(event.target) && !picker2.contains(event.target) && !fontPicker.contains(event.target)) {
    console.log("click event ");
    this.showFrameColorPicker = false;
    this.showtextColorPicker = false;
    this.fontSelector = false;
    document.removeEventListener('click', this.closeColorPicker);
  }
    },
  }
}
</script>
