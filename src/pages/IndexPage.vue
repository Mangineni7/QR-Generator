<template>
  <q-page class="flex justify-center">
    <div class="q-pa-md first-div" >

       <div class="flex flex-center" v-if="showLoader">
       <img src="../statics/Animation - 1713955201690.gif"  />
       </div>
      <div  style="width:100%;" >
      <q-form class="q-gutter-md ">
        <div v-if="openUrl && !showLoader">
        <div>
        <q-input filled v-model="url" label="Enter URL for QR code" placeholder="http://www.example.com" required class="url-input" @keyup="checkUrl" />
         <span style="color:red;" v-if="error">url must starts with http or https and enter valid url</span>
        </div>
        </div>
        <div class="flex flex-center q-mt-xl" v-if="openUrl&&!showLoader">
        <q-btn @click="generateQRCode(this.pdfUrl)" label="Generate QR Code" color="primary" />
      </div>
      </q-form>
      </div>
      <q-form v-if="openPdf&&!showLoader">
      <div class="q-mt-sm">
       <input type="file" accept=".pdf" @change="handlePdfUpload" style="display: none;" ref="pdfInput" />

       <div class="flex flex-center q-mt-lg">
      <q-input filled  v-model="selectedPdfName" label="Selecte PDF" class="pdf-input"   >
      <template v-slot:append>
         <div style="width:50px">
        <q-btn flat @click="openPdfUploadDialog"  color="primary" size="sm" ><img src="/attachment.gif" style="width:30px;height:30px"></q-btn>
         </div>
      </template>
      </q-input>
       </div>
        <div class="flex flex-center q-mt-xl">
       <q-btn @click="uploadPdfToFirebase(this.files)"  label="Generate Qr Code" color="primary"  />
       </div>

      </div>
      </q-form>
      <div class="flex justify-between colors q-mt-lg" style="width:100%"  v-if="qrCodeDataUrl&&this.addColors  && !showLoader">
          <div>
         <q-input filled v-model="fgColor" label="Foreground Color" placeholder="#000000" required>
          <template v-slot:append>
            <q-btn icon="palette" @click="showColorPickerFg" class="color-picker" :style="{backgroundColor:fgColor}" />
          </template>
        </q-input>
          </div>
          <div class="bgInput">
        <q-input filled v-model="bgColor" label="Background Color" required>
          <template v-slot:append>
            <q-btn icon="palette" @click="showColorPickerBg" class="color-picker" :style="{backgroundColor:bgColor}" />
          </template>
        </q-input>
          </div>
        </div>
        <div v-if="qrCodeDataUrl && this.addColors  && !showLoader">
        <div ref="colorPicker1" >
        <q-color @click="generateQRStyles" v-model="fgColor" v-if="showFgColorPicker" class="color-picker-overlay1" />
        </div>
        <div  ref="colorPicker2" >
        <q-color @click="generateQRStyles"  v-model="bgColor" v-if="showBgColorPicker" class="color-picker-overlay2" />
        </div>
        </div>



      <h6 v-if="qrCodeDataUrl && this.addFrame && !showLoader">Add frames</h6>
      <div class="frames">
      <div style=" display: inline-flex; " v-if="qrCodeDataUrl && this.addFrame && !showLoader">
        <q-btn @click="selectedFrame('simple')" style="margin-left:40px"> <div style="display: flex; flex-direction: column; ">
          <div style="width:50px;height:50px;border:2px solid black;"></div>
          <div style="width:60px;height:15px;background-color:black;margin-left:-5px;color:white;border-radius:5px;border-top-right-radius:0px;border-top-left-radius:0px"><span style="font-size:8px;">scan me</span></div>
        </div></q-btn>
        <q-btn @click="selectedFrame('bold')" style="margin-left:40px"> <div style="display: flex; flex-direction: column; ">
          <div style="width:50px;height:50px;border:4px solid black"></div>
         <div style="width:60px;height:15px;background-color:black;margin-left:-5px;color:white;border-radius:5px;border-top-right-radius:0px;border-top-left-radius:0px"><span style="font-size:8px;">scan me</span></div>
       </div> </q-btn>
        <q-btn @click="selectedFrame('dotted')" style="margin-left:40px"> <div style="display: flex; flex-direction: column; ">
          <div style="width:50px;height:50px;border:2px dashed black"></div>
          <div style="width:60px;height:15px;background-color:black;margin-left:-5px;color:white;border-radius:5px;border-top-right-radius:0px;border-top-left-radius:0px"><span style="font-size:8px;">scan me</span></div>
         </div> </q-btn>
        <q-btn @click="selectedFrame('double')" style="margin-left:40px"> <div style="display: flex; flex-direction: column; ">
           <div style="width:50px;height:50px;border:4px double black"></div>
           <div style="width:60px;height:15px;background-color:black;margin-left:-5px;color:white;border-radius:5px;border-top-right-radius:0px;border-top-left-radius:0px"><span style="font-size:8px;">scan me</span></div>
          </div> </q-btn>
      </div>
      </div>
      <div v-if="qrCodeDataUrl && this.addFrame  && !showLoader" class="q-mt-xl flex justify-between ">
          <q-input filled v-model="borderColor" @input="generateQRCode" label="Frame Color" class="addStyles" required >
            <template v-slot:append>
              <q-btn icon="palette" @click="showColorPickerFrame" class="color-picker"  :style="{backgroundColor:borderColor}" />
            </template>
          </q-input>
           <q-btn @click="generateQRCode" label="Add Frame Color" color="positive" class="addStyles" />
            <div ref="picker1">
            <q-color @click="generateQRCode(this.padfUrl)" v-model="borderColor" v-if="showFrameColorPicker"  class="color-picker-overlay3" />
            </div>
        </div>
         <div class=" q-mt-md flex justify-between " style="max-width:100%" v-if="qrCodeDataUrl && this.addFrame  && !showLoader">
          <q-input filled v-model="text" label="Text" class="text" >
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
         <q-color @click="generateQRCode(this.pdfUrl)" v-model="textcolor" v-if="showtextColorPicker"  class="color-picker-overlay4" />
         </div>
         </div>
         <div class="relative-container" v-if="qrCodeDataUrl && this.addFrame  && !showLoader"  ref="fontPicker">
         <div v-if="fontSelector" class="font-options-overlay" >
          <div class="font-options">
          <div v-for="font in fontOptions" :key="font" @click="applyFontStyle(font)" style="cursor:pointer">
              {{ font }}
              </div>
          </div>
         </div>
      </div>
     <!-- <frame-selector v-if="qrCodeDataUrl&& this.addFrame&& !showLoader" @frame-selected="selectedFrame"
     @font-selector="applyFontStyle" @callGenerate-Qr="generatingForColors" @text-change="textchange"></frame-selector> -->

      <h6 v-if="qrCodeDataUrl && this.addSvg  && !showLoader">Add Svg</h6>
      <div class="image-frames-scroll">
      <div class="class" v-if="qrCodeDataUrl && this.addSvg  && !showLoader">
        <q-btn @click="selectedImageFrame('frame1')"><img src="/scannerFrameGift3.jpg" alt="scanner img" style="width:70px;height:70px"/></q-btn>
        <q-btn @click="selectedImageFrame('frame2')"><img src="/scanmeMobile.webp" alt="scanner img" style="width:70px;height:70px"/></q-btn>
        <q-btn @click="selectedImageFrame('frame3')"><img src="/scanMe2Triangle.jpg" alt="scanner img" style="width:70px;height:70px"/></q-btn>
        <q-btn @click="selectedImageFrame('frame4')"><img src="/scan me  simple.jpg" alt="scanner img" style="width:70px;height:70px"/></q-btn>
        <q-btn @click="selectedImageFrame('frame5')"><img src="/scanMeBag.jpg" alt="scanner img" style="width:70px;height:70px"/></q-btn>
        <q-btn @click="selectedImageFrame('frame6')"><img src="/scanMe1.jpg" alt="scanner img" style="width:70px;height:70px"/></q-btn>
        <q-btn @click="selectedImageFrame('frame7')"><img src="/scanMe shapes.jpg" alt="scanner img" style="width:70px;height:70px"/></q-btn>
      </div>
      </div>

      <div v-if="qrCodeDataUrl && this.addImg  && !showLoader">
        <h6>Add Image</h6>
        <div class="flex justify-between">
          <div>
             <q-btn @click="addOverLayImages('cancel')" > <img src="/cancel.png"   class="image"></q-btn>
          </div>
          <div>
      <input type="file" accept="image/*" @change="handleImageUpload" style="display: none;" ref="imageInput" />
      <q-btn @click="openImageUploadDialog" > <img src="/image.png"   class="image"></q-btn>
          </div>
          <div>
            <q-btn @click="addOverLayImages('whatsapp')" > <img src="/whatsapp (1).png"  class="image" ></q-btn>
          </div>
           <div>
            <q-btn @click="addOverLayImages('facebook')" > <img src="/social (2).png"  class="image"></q-btn>
          </div>
           <div>
            <q-btn @click="addOverLayImages('youtube')" > <img src="/social (1).png"  class="image"></q-btn>
          </div>
           <div>
            <q-btn @click="addOverLayImages('linkedin')" > <img src="/social (3).png"  class="image"></q-btn>
          </div>
           <div>
            <q-btn @click="addOverLayImages('insta')" > <img src="/social.png" class="image"></q-btn>
          </div>
           <!-- <div>
            <q-btn @click="addOverLayImages('twitter')" > <img src="/twitter.png"  class="image"></q-btn>
          </div> -->
        </div>
        <div class="flex flex-column q-mt-md">
        <span class="q-mr-lg">Logo Size</span>
       <q-slider v-model="overlaySize" :min="10" :max="50" label
       style="width:300px;" @change="generateQRCode(this.pdfUrl)"></q-slider>

      </div>
      </div>
    </div>
    <div class="second-div"  >
      <div class="qr-container" >
        <div  class="q-mt-xl flex flex-center">
          <!-- Adjusted image container for QR code and frame -->
          <div class="qr-image-container ">
            <img src="/transparent@2.png" alt="QR Code" v-if="!qrCodeDataUrl" style="width:300px;height:200px" />
            <img :src="qrCodeDataUrl"  />
            <div v-if="qrCodeDataUrl && selectedImageFramePath === ''"  :style="{ width: scanMeWidth + 'px', height: scanMeHeight + 'px',
            backgroundColor: frameColor ? frameColor : 'black',color: this.textcolor,
             marginLeft: '-15px', marginRight: '-15px', borderRadius:'20px',
             borderTopRightRadius:'0px',borderTopLeftRadius:'0px',
             display:'flex', alignItems:'center' ,justifyContent:'center',marginTop:'-6px', fontFamily:this.selectedFont }"><span>{{this.text}}</span> </div>
          </div>
        </div>
      </div>
      <!-- <div class="flex flex-center " v-if="qrCodeDataUrl" >
        <q-btn @click="downloadQR" label="Download QR Code" color="primary" class="download-btn"   />
      </div> -->
       <div v-if="qrCodeDataUrl"  class=" q-mt-lg download">
           <q-btn @click="downloadQRCode('png')" label="Download Png" color="primary" class="downloadWidth"   />
           <q-btn @click="downloadQRCode('jpg')" label="Download Jpg" color="primary" class="downloadWidth"  />
           <q-btn @click="downloadQRCode('pdf')" label="Download pdf" color="primary" class="downloadWidth"    />
        </div>
    </div>

  </q-page>
</template>

<script>
import qrcode from 'qrcode-generator'
import jsPDF from 'jspdf'
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
//import FrameSelector from 'src/components/FrameSelector.vue';

const firebaseConfig = {
  apiKey: "AIzaSyAfWC9HXTkDaAZS4K_NjDd57gti-p8sJZw",
  authDomain: "my-project-ab214.firebaseapp.com",
  projectId: "my-project-ab214",
  storageBucket: "my-project-ab214.appspot.com",
  messagingSenderId: "414297923372",
  appId: "1:414297923372:web:673058aad62b421775d689",
  measurementId: "G-J31JCPQ67H"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
export default {
  components:{
   // FrameSelector
  },
  data() {
    return {
      quitNotify:false,
      pdfUrl:'',
      files:'',
      path:'',
      overlaySize:30,
      overlayDrawImage:false,
      showLoader:false,
      selectedPdfName:'',
      qrCodeUrl:'',
      text: 'Scan me',
      fontSelector:false,
      download:false,
      showtextColorPicker:false,
      textcolor:'#FFFFFF',
      error:false,
      selectedUrl:'',
      url: '',
      fgColor: '#000000',
      bgColor: '#FFFFFF',
      borderColor: '#000000',
      frameColor: '',
      qrCodeDataUrl: '',
      selectedFrameStyle: 'none',
      scanMeWidth: 130,
      scanMeHeight: 40,
      showFgColorPicker: false,
      showBgColorPicker: false,
      showFrameColorPicker: false,
      selectedColor: '',
      selectedImageFramePath: '',
      overlayImageElement: null,
      generatingQr: false,
      selectedFont: 'Arial, sans-serif', // Default selected font
     fontOptions: [ 'Arial, sans-serif' ,'Helvetica, sans-serif'  , 'Times New Roman, serif' ,
                    'Courier New, monospace' , 'Verdana, Geneva, sans-serif' ,'Georgia, serif',
                    'Palatino, serif','Garamond, serif',  'Bookman, serif',
                    'Trebuchet MS, sans-serif',   'Arial Black, sans-serif', 'Impact, sans-serif', 'wide'
],
    };
  },


  computed: {
    addFrame() {
      return this.$store.state.addFrames;
    },
    addSvg() {
      return this.$store.state.addSvg
    },
    addImg() {
      return this.$store.state.addImg
    },
    openUrl(){
      return this.$store.state.openUrl
    },
    openPdf(){
      return this.$store.state.openPdf
    },
    addColors(){
      return this.$store.state.addColors
    }

  },
  watch:{
    addColors(){

        this.resetStyles()
    },
    addFrame(){

        this.resetStyles()
    },
    addSvg(){

        this.resetStyles()
    },
    addImg(){

        this.resetStyles()
    },
    openUrl(newVal){

      if(!newVal){

      if(this.generatingQr){
       this.qrCodeDataUrl = ''
       this.url='empty'
       }
      } if(newVal)[
        this.url = ''
      ]

    },
    openPdf(newVal){

      if(!newVal){

        if(this.generatingQr){
       this.qrCodeDataUrl = ''
       this.selectedPdfName =''
       this.pdfUrl='empty'
       }

      } if(newVal){
        this.pdfUrl = ''
      }


    }
  },
  methods: {
    resetStyles(){
      this.text = 'Scan me'
      this.fgColor ='#000000'
      this.bgColor ='#ffffff'
      this.frameColor ='#000000'
      this.borderColor = '#000000'
      this.textcolor = '#ffffff'
      this.selectedImageFramePath =''
      this.selectedFrameStyle =''
      this.overlayImageElement = ''
      this.generateQRCode(this.pdfUrl)
   },

    stylesShow(){
      if(!this.qrCodeDataUrl){
        this.$q.notify({
          color:'negative',
          message:'please Enter url And Create Qr Code '
        })
        return;
       }

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
    generatingForColors({borderColor,textColor,text}){
   // console.log("calling function");
    this.borderColor = borderColor
    this.textcolor   = textColor
    this.text = text
    this.generateQRCode(this.pdfUrl)

  },
    applyFontStyle(font) {
      this.selectedFont = font
    },
    downloadQR() {
      this.download =!this.download
    },
    generateQRStyles() {
      if(this.generatingQr || !this.url){

        this.generateQRCode(this.pdfUrl)
      }

    },
    addOverLayImages(Image) {
   // console.log('img', Image);
    let imagePath;
    switch (Image) {
        case 'cancel':
          imagePath = ''
          break
        case 'whatsapp':
            imagePath = "/whatsapp (1).png";
            break;
        case 'facebook':
            imagePath = "/social (2).png";
            break;
        case 'youtube':
            imagePath = "/social (1).png";
            break;
        case 'linkedin':
            imagePath = "/social (3).png";
            break;
        case 'insta':
            imagePath = "/social.png";
            break;
        case 'twitter':
            imagePath = "/twitter.png";
            break;
    }
   // console.log('overLay', imagePath);

    // Create an Image object
    const img = document.createElement('img');
    img.src = imagePath;

        // Once the image is loaded, call overlayImage with the HTMLImageElement
        this.overlayImage(img);


},
  openImageUploadDialog() {
      this.$refs.imageInput.click();
    },
    handleImageUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;
        img.onload = () => {
          this.overlayImage(img);
        };
      };

    },
   overlayImage(overlayImage) {

    this.overlayImageElement = overlayImage

    this.generateQRCode();
   // console.log(this.addFrame)

},
  checkUrl() {

    const urlRegex = /^(http:\/\/www\.|https:\/\/www\.)[a-zA-Z0-9\-:._\/]+$/;

  // Check if the URL matches the regular expression
  if (!urlRegex.test(this.url.trim())) {
    this.error = true; // URL doesn't match the pattern
    return;
  }

  this.error = false;
  },
    selectedFrame(frame) {
      this.selectedFrameStyle = frame;
      this.selectedImageFramePath = '';
      this.generateQRCode();
    },
    selectedImageFrame(frame) {
      switch (frame) {
        case 'frame1':
          this.selectedImageFramePath = '/scannerFrameGift3.jpg';
          break;
        case 'frame2':
          this.selectedImageFramePath = '/scanmeMobile.webp';
          break;
           case 'frame3':
          this.selectedImageFramePath = '/scanMe2Triangle.jpg';
          break;
          case 'frame4':
          this.selectedImageFramePath = '/scan me  simple.jpg';
          break;
          case 'frame5':
          this.selectedImageFramePath = '/scanMeBag.jpg';
          break;
          case 'frame6':
          this.selectedImageFramePath = '/scanMe1.jpg';
          break;
          case 'frame7':
          this.selectedImageFramePath = '/scanMe shapes.jpg';
          break;
        default:
          this.selectedImageFramePath = '';
      }
      this.generateQRCode(this.pdfUrl)
    },
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
     if (!this.$refs.colorPicker1.contains(event.target) && !this.$refs.colorPicker2.contains(event.target)) {
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
    //console.log("click event ");
    this.showFrameColorPicker = false;
    this.showtextColorPicker = false;
    this.fontSelector = false;
    document.removeEventListener('click', this.closeColorPicker);
  }
},
   openPdfUploadDialog() {
      this.$refs.pdfInput.click();
    },

   handlePdfUpload(event) {
      const file = event.target.files[0];
      if (!file) return;
      if(file && file.type === 'application/pdf'){
        this.selectedPdfName = file.name
        this.files = file
      } else {
        this.selectedPdfName = ''
        alert('Please select pdf file')
      }

      this.selectedPdfName = file.name
      // Upload the selected PDF file to Firebase Storage
      this.files= file
    },
    async uploadPdfToFirebase(file) {
      if(!file){
        this.$q.notify({
          color: 'negative',
          message:'Please enter a URL or PDF to generate its QR code.'

        })
        return
      }
      try {
        this.showLoader = true
       // console.log('show loader :' + this.showLoader);
        const storageRef = ref(storage, file.name);
        await uploadBytes(storageRef, file);
        const pdfUrl = await getDownloadURL(storageRef);
        const shortUrl = await this.shortenUrl(pdfUrl);
        this.pdfUrl = shortUrl
        this.generateQRCode(shortUrl);
      } catch (error) {
        console.error('Error uploading PDF to Firebase:', error);
      }
    },
    async shortenUrl(url) {
  try {
    const response = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`);

    if (!response.ok) {
      throw new Error('Failed to shorten URL');
    }

    return response.text();
  } catch (error) {
   // console.error('Error shortening URL:', error);
    return url; // Return original URL if there's an error
  }
},
    generateQRCode(pdfUrl = this.pdfUrl) {

      this.generatingQr = true
     // console.log('padfUrl: ' , pdfUrl);
     // console.log('Url: ' , this.url);
      const ispdfUrl = pdfUrl
  if (!this.url.trim() && !ispdfUrl) {
    this.$q.notify({
      color: 'negative',
      message: 'Please enter a URL or PDF to generate its QR code.',
    });
    return;
  }

  if (!this.error) {
    if(this.url === 'empty' ){
      this.url = ''

    }
    if(this.pdfUrl === 'empty' ){
      this.pdfUrl = ''

    }

    let dataToAdd = '';
    if ((this.url.trim() && this.openUrl) || (this.openPdf && !pdfUrl) ) {
      dataToAdd = this.url;
    } else if ((pdfUrl && this.openPdf) || (this.openUrl && !this.url)) {

      dataToAdd = pdfUrl;
    }

    //console.log('addFrame :'+this.addFrame)
    this.frameColor = this.borderColor;
    //console.log('screating qr')
     this.showLoader = false
  if(this.url.trim() || this.pdfUrl){
    const qr = qrcode(0, 'H');
    qr.addData(dataToAdd);
    qr.make();

   // console.log(this.selectedFont)
    const numCells = qr.getModuleCount();

   // console.log("numcells : "+numCells)
    const cellSize = 140 / numCells;

   // console.log("cellSize : "+ cellSize)
    const margin = cellSize * 7;

   // console.log("margin : "+ margin)
    const size = numCells * cellSize + margin * 2;
   // console.log(size)

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = size;
    canvas.height = size;

    context.fillStyle = this.bgColor;
    context.fillRect(0, 0, canvas.width, canvas.height);



    for (let row = 0; row < numCells; row++) {
      for (let col = 0; col < numCells; col++) {
        if (qr.isDark(row, col)) {
          context.fillStyle = this.fgColor;
          context.fillRect(col * cellSize + margin, row * cellSize + margin, cellSize, cellSize);
        }
      }
    }

    if (this.selectedImageFramePath ||(this.selectedImageFramePath && this.overlayDrawImage)  ) {
      this.drawImageFrame(context, canvas.width, canvas.height,pdfUrl);
    } else {
      this.drawFrame(context, canvas.width, canvas.height);
    }

    if (this.overlayImageElement) {
      // Calculate the position to place the image icon in the middle of the QR code
      const iconSize = this.overlaySize; // Size of the image icon
      const iconX = (size - iconSize) / 2;
      const iconY = (size - iconSize) / 2;

      context.drawImage(this.overlayImageElement, iconX, iconY, iconSize, iconSize);

    }

    this.qrCodeDataUrl = canvas.toDataURL();
    this.scanMeWidth = `${size + 30}`;
    this.$store.commit('toggleQrcode', this.qrCodeDataUrl);

  }
  }

},
drawImageFrame(context, width, height,pdfUrl) {
  this.overlayDrawImage = true
  const img = new Image();

  img.onload = () => {
    const imageWidth = 220; // Set the width of the frame image
    const imageHeight = 270; // Set the height of the frame image

    const canvasWidth = Math.max(width, imageWidth);
    const canvasHeight = Math.max(height, imageHeight);

    const imageX = (canvasWidth - imageWidth) / 2;
   // console.log('imageX : '+imageX)
    const imageY = (canvasHeight - imageHeight) / 2;

    let qrX, qrY;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Draw the frame image
    ctx.drawImage(img, imageX, imageY, imageWidth, imageHeight);

     let data = '';
    if ((this.url.trim() && this.openUrl) || (this.openPdf && !this.pdfUrl)) {
      data = this.url;
    } else if ((this.pdfUrl && this.openPdf) || (this.openUrl && !this.url)) {
      data  = this.pdfUrl;
    }

    // Generate the QR code
    const qr = qrcode(0, 'H');
    qr.addData(data);
    qr.make();

    const numCells = qr.getModuleCount();
    const cellSize = 135 / numCells;
    const margin = cellSize * 7;
    const qrSize = numCells * cellSize + margin * 2;

    // Calculate the position to center the QR code within the image frame
    qrX = (canvasWidth - qrSize) / 2;
    qrY = (canvasHeight - qrSize) / 2;

    // Adjust the position if needed for better appearance
    if (this.selectedImageFramePath === '/scanMeBag.jpg' || this.selectedImageFramePath === '/scanMe1.jpg' || this.selectedImageFramePath === '/scanMe shapes.jpg') {
      qrY += 20; // Move QR code down for these frame images
    } else {
      qrY -= 22; // Move QR code up for other frame images
    }


    // Draw the QR code
    for (let row = 0; row < numCells; row++) {
      for (let col = 0; col < numCells; col++) {
        if (qr.isDark(row, col)) {
          ctx.fillStyle = this.fgColor;
          ctx.fillRect(col * cellSize + qrX + margin, row * cellSize + qrY + margin, cellSize, cellSize);
        }
      }
    }



    if (this.overlayImageElement) {
      // Calculate the position to center the overlay image within the QR code
      const overlayImagSize = this.overlaySize; // Set the width of the overlay image
      const overlayImageX = qrX + (qrSize - overlayImagSize) / 2;
     // console.log('overlayImage : '+overlayImageX)
      const overlayImageY = qrY + (qrSize - overlayImagSize) / 2;
      // console.log('overlayImage : '+overlayImageY)

      // Draw the overlay image onto the canvas
      ctx.drawImage(this.overlayImageElement, overlayImageX, overlayImageY, overlayImagSize, overlayImagSize);

    }



    // Convert the canvas to data URL and set it as QR code data URL
    this.qrCodeDataUrl = canvas.toDataURL();
  };

  img.onerror = (error) => {
    console.error('Error loading image:', error);
  };

  img.src = this.selectedImageFramePath;

},

    drawFrame(context, width, height) {
      switch (this.selectedFrameStyle) {
        case 'simple':
          this.drawSimpleFrame(context, width, height, 5, this.borderColor);
          break;
        case 'bold':
          this.drawSimpleFrame(context, width, height, 10, this.borderColor);
          break;
        case 'dotted':
          this.drawDottedFrame(context, width, height, 4.5, this.borderColor);
          break;
        case 'double':
          this.drawDoubleFrame(context, width, height, 3, this.borderColor);
          break;
        default:
          //console.log(this.selectedFrameStyle);
      }

    },
    drawSimpleFrame(context, width, height, frameWidth, color) {
      context.fillStyle = color;
      context.fillRect(0, 0, width, frameWidth); // Top
      context.fillRect(0, 0, frameWidth, height); // Left
      context.fillRect(width - frameWidth, 0, frameWidth, height); // Right
      context.fillRect(0, height - frameWidth, width, frameWidth); // Bottom
    },
    drawDottedFrame(context, width, height, dotSize, color) {
      context.fillStyle = color;
      for (let x = 0; x < width; x += dotSize * 2) {
        context.fillRect(x, 0, dotSize, dotSize); // Top
        context.fillRect(x, height - dotSize, dotSize, dotSize);
      }
      for (let y = 0; y < height; y += dotSize * 2) {
        context.fillRect(0, y, dotSize, dotSize); // Left
        context.fillRect(width - dotSize, y, dotSize, dotSize); // Right
      }
    },
    drawDoubleFrame(context, width, height, frameWidth, color) {
      this.drawSimpleFrame(context, width, height, frameWidth, color);

      const innerOffset = frameWidth * 4;
      const innerWidth = width - innerOffset;
      const innerHeight = height - innerOffset;

      context.fillStyle = color;
      context.fillRect(frameWidth * 2, frameWidth * 2, innerWidth, frameWidth);
      context.fillRect(frameWidth * 2, height - frameWidth * 3, innerWidth, frameWidth);
      context.fillRect(frameWidth * 2, frameWidth * 2, frameWidth, innerHeight);
      context.fillRect(width - frameWidth * 3, frameWidth * 2, frameWidth, innerHeight);
    },
    downloadQRCode(formate) {
      if (!this.qrCodeDataUrl) {
        this.$q.notify({
          color: 'negative',
          message: 'Please generate a QR code first.',
        });
        return;
      }

      const link = document.createElement('a');
      const extraWidth = 15;
      const padding = 13;
      const fontSize = 16;
      const textHeight = fontSize;
      const borderRadius = 20;

      const qrImage = new Image();
      qrImage.onload = () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = qrImage.width +  extraWidth * 2;
        canvas.height = qrImage.height + textHeight + padding * 2;
          if(formate === 'pdf'){
         context.fillStyle = "white"; // Set it to match your QR code styles
         context.fillRect(0, 0, canvas.width, canvas.height);
          }

        function roundRect(ctx, x, y, width, height, radius) {
          ctx.beginPath();
          ctx.moveTo(x + radius, y);
          ctx.lineTo(x + width - radius, y);
          ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
          ctx.lineTo(x + width, y + height - radius);
          ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
          ctx.lineTo(x + radius, y + height);
          ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
          ctx.lineTo(x, y + radius);
          ctx.quadraticCurveTo(x, y, x + radius, y);
          ctx.closePath();
        }

        roundRect(context, 0, 0, canvas.width, canvas.height, borderRadius);
        context.clip();

        context.drawImage(qrImage, extraWidth, 0);

         if(this.selectedImageFramePath === ''){

        context.fillStyle = this.borderColor;
        context.fillRect(0, qrImage.height, canvas.width, textHeight + padding * 2);


        context.fillStyle = this.textcolor;
        context.font = `${fontSize}px ${this.selectedFont}`;
        context.textAlign = 'center';
        context.fillText(this.text, canvas.width / 2, qrImage.height + padding + fontSize);
        }
        let imgData
        if(formate === 'png' || formate === 'jpg'){

         imgData = canvas.toDataURL(`image/${formate}`)
        } else  if(formate === 'pdf'){
          const doc = new jsPDF()
          imgData = canvas.toDataURL('image/jpeg')
          doc.addImage(imgData,'JPEG',50 ,85, qrImage.width/2,qrImage.height/2)
          doc.save('QRCode.pdf')
          return
        }

        link.href = imgData
        link.download = `QR.${formate}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      qrImage.src = this.qrCodeDataUrl;
    },

  }
}
</script>

<style>
body::-webkit-scrollbar {
    display: none;
}
.font-options-overlay {
    position: absolute;
    top:-244px;
    left:0;
    height: 200px;
    overflow: scroll;
    width: 200px;
    background-color: whitesmoke;
    border: 1px solid #ccc;
    padding: 10px;
    border-radius: 5px;
    z-index: 1;
  }
 .relative-container {
    position: relative;
}
  .font-options div {
    padding: 2px 0;
    cursor: pointer;
  }
  .font-options div:hover{
    background-color: rgb(201, 195, 195);
    border-radius: 5px;
  }
.colors{
  width: 600px;
}
.downloadWidth{
  width: 110px;
  margin-left:20px;
}
.download{
display:flex;
 justify-content:space-between;
  position: fixed;
  top: 400px;
}
.first-div{
  width:60%;
}
.second-div{

  width:40%;
  background-color: whitesmoke;
}
.q-field__control {
  height: 45px;
  width: 200px;
  border: 1px solid rgb(114, 22, 175);
  color: rgb(114, 22, 175);
}
.q-field__label {
  left: 0;
  top: 10px;
  max-width: 100%;
}
.qr-image-container {
  position:fixed;
  top:100px
}
.download-btn{
  position: fixed;
  top: 450px;
}
/*.frames {

  overflow-x: auto;
  white-space: nowrap;
}*/
.url-input .q-field__control{
  width: 100%;
}
.q-field__append{
  height: 43px !important;
}
.image-frames-scroll{
  overflow-x: auto;
}
.class{
  display: inline-flex;
}
 .image-frames-scroll::-webkit-scrollbar {
  height: 3px;
  background: rgb(0, 119, 255);
 }

.image-frames-scroll::-webkit-scrollbar-thumb {
  background: #888;
}
.addStyles{
 height: 20px;
}
.color-picker-overlay1 {
  position: absolute;
  top:210px;
  left: 30px;
  z-index: 10;
}
.color-picker-overlay2 {
  position: absolute;
  top:210px;
  left: 400px;
  z-index: 10;

}
.color-picker-overlay3 {
  position: absolute;
  top: 80px;
  left: 20px;
  z-index: 10;
}
.color-picker-overlay4{
  position: absolute;
  top: 120px;
  left:320px;
  z-index:10 ;
}
.image{
    width: 40px;
    height: 40px;
  }

@media screen and (max-width: 1024px){
   .downloadWidth{
  width: 90px;
  margin-left:22px;
}
.image{
    width: 30px;
    height: 30px;
  }
  .frames {
  overflow-x: auto;
  white-space: nowrap;
}
.color-picker-overlay3 {
  position: absolute;
  top:0px;
  left: 0px;
  z-index: 10;
}
.color-picker-overlay4{
  position: absolute;
  top: 0px;
  left:320px;
  z-index:10 ;
}

}
@media screen and (max-width: 767px) {
  .image{
    width: 15px;
    height: 15px;
  }
  .colors{
    width: 95%;
  }
  .frames {
  overflow-x: auto;
  white-space: nowrap;
}
  .url-input .q-field__control{
  width: 100%;
}
  .qr-image-container {
  position:relative;
  top: 0px;
}
.download-btn{
  position: relative;
  top: 0px;
  margin-top: 20px;
  margin-bottom: 10px;
}
.download{
  position: relative;
  top:0px;
  margin-top: 20px;
   margin-bottom: 10px;
}
.downloadWidth{
  width: 110px;
  margin-left:10px
}
.first-div{
  width:100%;
}
.second-div{
  width:100%;
  background-color: whitesmoke;
}
  .q-field__control {
    width: 150px;
    max-width: 100%;
  }

  .q-field__label {
    max-width: 100%;
  }
  .class {
    display: inline-flex;
    /* Add margin from the left side */
  }

  .image-frames-scroll {
    overflow-x: auto;
    white-space: nowrap;
    margin-left: 20px;
  }
  .color-picker-overlay1 {
  position: absolute;
  top:210px;
  left:0px;
  z-index: 10;
}
.color-picker-overlay2 {
  position: absolute;
  top:210px;
  left:200px;
  z-index: 10;
}
.color-picker-overlay3 {
  position: absolute;
  top: 110px;
  left:10px;
  z-index: 10;
}
.color-picker-overlay4{
  position: absolute;
  top: 150px;
  left:178px;
  z-index:10 ;

}
.addStyles{
  margin-top:30px;
}
.font-options-overlay {
    position: absolute;
    top:-244px;
    left:0;
    height: 200px;
    overflow: scroll;
    width: 150px;
    background-color: whitesmoke;
    border: 1px solid #ccc;
    padding: 10px;
    border-radius: 5px;
    z-index: 1;
  }


  /* Add more styles for smaller screens as needed */
}
@media screen and (min-width:768px ) and (max-width:1024px){
  .downloadWidth{
  width: 90px;
  margin-left:10px
}
  .color-picker-overlay1 {
  position: absolute;
  top:210px;
  left:30px;
  z-index: 10;
}
.color-picker-overlay2 {
  position: absolute;
  top:210px;
  left: 250px;
  z-index: 10;
}
.color-picker-overlay3 {
  position: absolute;
  top: 80px;
  left: 10px;
  z-index: 10;
}
.color-picker-overlay4 {
  position: absolute;
  top: 120px;
  left: 240px;
  z-index: 10;
}
.frames {
  overflow-x: auto;
  white-space: nowrap;
}

}
@media screen and (width: 280px){

  .q-field__control{
    width: 250px;
  }
  .bgInput {
    margin-top: 15px;
  }
  .download{
    display: inline;
  }

}


</style>