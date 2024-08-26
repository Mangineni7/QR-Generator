<template>
  <div class="qr-container">
    <div v-if="showReset" class="q-ma-md flex justify-end">
      <q-btn @click="reset" outline color="cyan" label="Reset Styles" />
    </div>

    <!-- <div class="flex justify-between" v-if="localQrCodeDataUrl" >
      <q-btn @click="undo" icon="undo" :disabled="!canUndo" outline />
      <q-btn @click="redo" icon="redo" :disabled="!canRedo" outline />
    </div> -->

    <div class="q-mt-xl flex flex-center">
      <div class="q-mt-xl qr-image-container">
        <img src="/transparent@2.png" alt="QR Code" v-if="!localQrCodeDataUrl" style="width:300px;height:200px" />
        <img :src="localQrCodeDataUrl" />
         <div v-if="qrCodeDataUrl&& selectedImageFramePath == '' && this.$store.state.addSvg === false"
          :style="{
            width: scanMeWidth + 'px',
            height: scanMeHeight + 'px',
            backgroundColor: localFrameColor ? localFrameColor : 'black',
            color: localTextColor,
            marginLeft: '-15px',
            marginRight: '-15px',
            borderRadius: '20px',
            borderTopRightRadius: '0px',
            borderTopLeftRadius: '0px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: '-6px',
            fontFamily: selectedFont
          }"
        >
          <span>{{ localText }}</span>
        </div>
      </div>
    </div>

    <div v-if="localQrCodeDataUrl" class="q-mt-xl download">
      <q-btn @click="downloadQRCode('png')" label="Download Png" color="primary" class="downloadWidth" />
      <q-btn @click="downloadQRCode('jpg')" label="Download Jpg" color="primary" class="downloadWidth" />
      <q-btn @click="downloadQRCode('pdf')" label="Download Pdf" color="primary" class="downloadWidth" />
    </div>
  </div>
</template>

<script>
import { debounce } from 'quasar';
export default {
  props: {
    qrCodeDataUrl: {
      type: String,
      default: '',
    },
    scanMeWidth: {
      type: [Number, String],
      default: 300,
    },
    scanMeHeight: {
      type: Number,
      default: 200,
    },

    selectedFont: {
      type: String,
      default: 'Arial',
    },

    selectedImageFramePath: {
      type: String,
      default: '',
    },
    frameColor:{
      type:String,
      default:''
    },

    showReset: Boolean,
  },
  data() {
    return {
      history: [], // To store history of states
      future: [], // To store future states for redo
      currentIndex: -1, // Index to track the current state
      isCapturing : false
    };
  },
  computed: {
    canUndo() {
      return this.currentIndex > 0;
    },
    canRedo() {
      return this.future.length > 0;
    },
    // computedTextStyle() {
    //   return {
    //     width: `${this.scanMeWidth}px`,
    //     height: `${this.scanMeHeight}px`,
    //     backgroundColor: this.frameColor || 'black',
    //     color: this.textColor,
    //     marginLeft: '-15px',
    //     marginRight: '-15px',
    //     borderRadius: '20px',
    //     borderTopRightRadius: '0px',
    //     borderTopLeftRadius: '0px',
    //     display: 'flex',
    //     alignItems: 'center',
    //     justifyContent: 'center',
    //     marginTop: '-6px',
    //     fontFamily: this.selectedFont,
    //   };
    // },
    localQrCodeDataUrl() {
      return this.qrCodeDataUrl;
    },
    localScanMeWidth() {
      return this.scanMeWidth;
    },
    localScanMeHeight() {
      return this.scanMeHeight;
    },
    localText() {

       return this.$store.state.text;
    },
    localSelectedFont() {
      return this.selectedFont;
    },
    localTextColor(){

        return this.$store.state.textColor;

    },
    localSelectedImageFramePath() {
      return this.selectedImageFramePath;
    },
    localFrameStyle(){

        return this.$store.state.frame

    },
    localborderColor(){

        return this.$store.state.borderColor

    },
    localOverlayImg(){

         return this.$store.state.overalyImg

    },
    localFgColor(){

       return this.$store.state.fgColor

    },
    localBgColor(){

        return this.$store.state.bgColor
    },
    localFrameColor(){
      return this.frameColor
    }
  },
  methods: {
    captureStateBeforeChange: debounce(function (){
       const state = {
        qrCodeDataUrl: this.localQrCodeDataUrl,
        scanMeWidth: this.localScanMeWidth,
        scanMeHeight: this.localScanMeHeight,
        text: this.localText,
        selectedFont: this.localSelectedFont,
        textColor: this.localTextColor,
        selectedImageFramePath: this.localSelectedImageFramePath,
        overalyImg: this.localOverlayImg,
        borderColor: this.localborderColor,
        frameColor:this.localFrameColor,
        Frame: this.localFrameStyle,
        fgColor:this.localFgColor,
        bgColor: this.localBgColor
      };

      console.log("state captured :", state);

      // If we're not at the end of history, truncate the future stack
      if (this.currentIndex < this.history.length - 1) {
        this.history = this.history.slice(0, this.currentIndex);

      }

      // Add the current state to history and clear future stack
      this.history.push(state);
       console.log("history length :", this.history.length-1);
      this.currentIndex = this.history.length - 1;
      //this.future = [];

    }, 200),
    undo() {
      if (this.canUndo) {
        console.log("undo :  ", this.history.length-1);
        this.future.push(this.history[this.currentIndex]);
        this.currentIndex--;
        const prevState = this.history[this.currentIndex];
        this.applyState(prevState);
      }
    },
    redo() {
      if (this.canRedo) {
        console.log("redo :", this.future.length-1);

        const nextState = this.future.pop();
        this.currentIndex++;
        this.applyState(nextState);
      }
    },
    applyState(state) {
  this.$emit('update:qrCodeDataUrl', state.qrCodeDataUrl);
  this.$emit('update:scanMeWidth', state.scanMeWidth);
  this.$emit('update:scanMeHeight', state.scanMeHeight);

  // Update Vuex store values
  this.$store.commit('toggleText',state.text)
  this.$emit('update:selectedFont',state.selectedFont)
  this.$store.commit('toggleTextColor',state.textColor)
  //this.$store.commit('toggleFramestyle',state.Frame)
  this.localSelectedImageFramePath = state.selectedImageFramePath;
  this.$store.commit('toggleOverLayImg',state.overalyImg)
  this.$store.commit ('toggleBorderColor',state.borderColor) ;
  this.$emit('update:frameColor',state.frameColor)
  this.$store.commit ('toggleFg',state.fgColor)
  this.$store.commit ('toggleBg', state.bgColor)

  console.log("State applied:", state);
},
    downloadQRCode(format) {
      this.$emit('callDownaloader', format);
    },
    reset() {
      this.$emit('resetStyles');
    },
  },
  watch: {
    qrCodeDataUrl: 'captureStateBeforeChange',
    scanMeWidth: 'captureStateBeforeChange',
    scanMeHeight: 'captureStateBeforeChange',
    text: 'captureStateBeforeChange',
    selectedFont: 'captureStateBeforeChange',
    textColor: 'captureStateBeforeChange',
    frameColor: 'captureStateBeforeChange',
    selectedImageFramePath: 'captureStateBeforeChange',
    Frame:'captureStateBeforeChange',
    overalyImg:'captureStateBeforeChange',
    borderColor:'captureStateBeforeChange',
    fgColor:'captureStateBeforeChange',
    bgColor:'captureStateBeforeChange',
  },
};
</script>

<style>
/* Add your styles here */
</style>
