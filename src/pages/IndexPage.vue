<template>
  <q-page class="flex justify-center">
    <div class="q-pa-md first-div" >
      <url-component-vue v-if="openUrl "  @callQrGenerator='urlForGenerateQr' />

      <pdf-component-vue v-if="openPdf && !showLoader" :data='showLoader ' @callQrGeneratorPdf='QrGeneratorPdf' />

      <color-pickers-vue v-if="this.addColors && qrCodeDataUrl"  @callColorPicker='generateQRStyles'/>

     <frame-selector v-if="qrCodeDataUrl&& this.addFrame" @frame-selected="selectedFrame"
     @font-selector="applyFontStyle" @callGenerate-Qr="generatingForColors" ></frame-selector>


      <drawimage-frame v-if="this.qrCodeDataUrl && this.addSvg " @callSelectImageFrame ='selectedImageFrame'/>

      <over-laying-logo v-if="this.qrCodeDataUrl && this.addImg "
      @callOverlayFunction='addOverLayImages' @callGenerateQRCode='addOverLayImageSize' @callOverlayImageMethod="overlayImage" />

    </div>
    <div class="second-div"  >

     <qr-code-visiability
      v-model:qrCodeDataUrl="qrCodeDataUrl"
      v-model:scanMeWidth="scanMeWidth"
      v-model:scanMeHeight="scanMeHeight"

      v-model:selectedFont="selectedFont"
      v-model:frameColor="frameColor"
      :selectedImageFramePath="selectedImageFramePath"
      :showReset="showResetValue"
      @resetStyles='resetStyles'
      @callDownaloader='downloadQRCode'
    />
    </div>

  </q-page>
</template>

<script>
import LZString from 'lz-string'
import qrcode from 'qrcode-generator'
import jsPDF from 'jspdf'
import FrameSelector from 'src/components/FrameSelector.vue';
import DrawimageFrame from 'components/DrawimageFrame.vue';
import OverLayingLogo from 'components/OverLayingLogo.vue'
import UrlComponentVue from 'src/components/UrlComponent.vue';
import PdfComponentVue from 'src/components/PdfComponent.vue';
import colorPickersVue from 'src/components/colorPickers.vue';
import QrCodeVisiability from 'src/components/QrCodeVisiability.vue';
import axios from 'axios';


export default {
  components:{
   FrameSelector,
   DrawimageFrame,
   OverLayingLogo,
   UrlComponentVue,
   PdfComponentVue,
   colorPickersVue,
   QrCodeVisiability
  },
  data() {
    return {
      qrLinks:[],
      quitNotify:false,
      showResetValue:false,
      pdfUrl:'',
      files:'',
      path:'',
      overlaySize:30,
      overlayDrawImage:false,
      showLoader:false,
      selectedPdfName:'',
      qrCodeUrl:'',
      text:this.$store.state.text,
      fontSelector:false,
      download:false,
      showtextColorPicker:false,
      // textcolor: this.$store.state.textColor,
      error:false,
      selectedUrl:'',
      url: '',
      // fgColor:this.$store.state.fgColor,
      // bgColor: this.$store.state.bgColor,
      // borderColor: this.$store.state.borderColor,
      frameColor: this.$store.state.frameColor,
      qrCodeDataUrl: '',
      selectedFrameStyle: this.$store.state.frame,
      scanMeWidth:130,
      scanMeHeight: 40,
      showFgColorPicker: false,
      showBgColorPicker: false,
      showFrameColorPicker: false,
      selectedColor: '',
      selectedImageFramePath: '',
      overlayImageElement: this.$store.state.overLayImg,
      generatingQr: false,
      index : '',
      selectedFont: 'Arial, sans-serif', // Default selected font
     fontOptions: [ 'Arial, sans-serif' ,'Helvetica, sans-serif'  , 'Times New Roman, serif' ,
                    'Courier New, monospace' , 'Verdana, Geneva, sans-serif' ,'Georgia, serif',
                    'Palatino, serif','Garamond, serif',  'Bookman, serif',
                    'Trebuchet MS, sans-serif',   'Arial Black, sans-serif', 'Impact, sans-serif', 'wide'
],
    };
  },


  computed: {
    fgColor(){

      return this.$store.state.fgColor
    },
    bgColor(){
      return this.$store.state.bgColor
    },
    borderColor(){
      return this.$store.state.borderColor
    },
    textcolor(){
     return this.$store.state.textColor
    },
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
 mounted(){
  console.log("qrcodedataurl :"+ this.qrCodeDataUrl)
    console.log("mounted :" + this.$store.state.editValue)
    if(this.$route.query.qrCodeDataUrl){

   // this.qrCodeDataUrl = this.$route.query.qrCodeDataUrl
    this.index = this.$route.query.index
    this.$store.commit('toggleQrCodeDataUrl', this.qrCodeDataUrl)
   // this.$store.commit('toggleEdits', true)
    console.log('store :'+ this.$store.state.editValue);
    console.log("qr codes :"+ this.qrCodeDataUrl)
    console.log("commits :"+ this.$store.state.qrCodeDataUrl);
    console.log(" qrcode data url :::"+ this.$store.state.qrCodeDataUrl);
    }

 },

  methods: {
    urlForGenerateQr(url,error){
      this.url = url
      this.error= error
      this.generateQRCode(this.pdfUrl)

    },
    QrGeneratorPdf({pdf,showLoader}){
      this.showLoader = showLoader
     this.pdfUrl = pdf
     this.generateQRCode(this.pdfUrl)
    },
    resetStyles(){
  this.text = 'Scan me';
  this.$store.commit('toggleFg', '#000000');
  this.$store.commit('toggleBg','#FFFFFF');
  this.frameColor ='#000000';
  this.$store.commit('toggleBorderColor','#000000');
  this.$store.commit('toggleTextColor','#FFFFFF')
  this.selectedImageFramePath ='';
  this.selectedFrameStyle ='';
  this.overlayImageElement = null;
  this.showResetValue = false;
  this.selectedFont = 'Arial, sans-serif'
  this.generateQRCode(this.pdfUrl);
},
showReset(){
  // Debugging statements to print current values


  if (this.text !== 'Scan me' || this.fgColor !== '#000000' || this.bgColor !== '#FFFFFF' ||
      this.frameColor !== '#000000' || this.borderColor !== '#000000' || this.textcolor !== '#FFFFFF' ||
      this.selectedImageFramePath !== '' || this.selectedFrameStyle !== '' || this.overlayImageElement !== null
      || this.selectedFont !== 'Arial, sans-serif') {
    this.showResetValue = true;
  }
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
      this.generateQRCode(this.pdfUrl)
      console.log('font :' , this.selectedFont);
    },
    downloadQR() {
      this.download =!this.download
    },
    generateQRStyles({fgColor,bgColor}) {

      if(this.generatingQr || !this.url || !this.qrCodeDataUrl ){
        this.fgColor=fgColor
        this.bgColor =bgColor

        this.generateQRCode(this.pdfUrl)
      }

    },
    addOverLayImageSize(overlaySize){
      this.overlaySize = overlaySize
      this.generateQRCode(this.pdfUrl)

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
  // openImageUploadDialog() {
  //     this.$refs.imageInput.click();
  //   },
  //   handleImageUpload(event) {
  //     const file = event.target.files[0];
  //     if (!file) return;

  //     const reader = new FileReader();
  //     reader.readAsDataURL(file);
  //     reader.onload = (e) => {
  //       const img = new Image();
  //       img.src = e.target.result;
  //       img.onload = () => {
  //         this.overlayImage(img);
  //       };
  //     };

  //   },
   overlayImage(img) {

    this.overlayImageElement = img

    this.generateQRCode();
   // console.log(this.addFrame)

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

    generateQRCode(pdfUrl = this.pdfUrl) {

      this.generatingQr = true
      const ispdfUrl = pdfUrl
  if (!this.url.trim() && !ispdfUrl && !this.qrCodeDataUrl) {
    console.log("shanmukhi rao geneating QR");
    this.$q.notify({
      color: 'negative',
      message: 'Please enter a URL or PDF to generate its QR code.',

    });
    return;
  }
    console.log(" entering into generating qr ss ");
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
    this.$store.commit('toggleQrcode',this.qrCodeDataUrl)

    this.scanMeWidth = `${size + 30}`;
     this.showReset()


    // if(this.$store.state.qrCodeDataUrl    ){
    //   console.log("into toggle edits");

    //    this.$store.commit('toggleEdits', true )
    // }
    // if(!this.$store.state.qrCodeDataUrl){
    //   this.qrCodeDataUrl = ''
    // }
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
    this.$store.commit('toggleQrCodeDataUrl', this.qrCodeDataUrl)
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
          // console.log(this.selectedFrameStyle);
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
 async storeQrLink(qrLink) {
  try {
    const token = localStorage.getItem("token"); // Assuming you store the token in local storage
    console.log("Token (frontend):", token);

    if (!token) {
      this.$q.notify({
        color: 'negative',
        message: 'You need to log in first.',
      });
      return;
    }
    //  const compressedData = LZString.compress(JSON.stringify(qrLink));
    // localStorage.setItem('qrLinks', compressedData)


    await axios.post("http://localhost:3000/storeQrLink", {qrLink}, {
      headers: {
        Authorization: token,
      },
    });


    this.$q.notify({
      color: 'positive',
      message: 'QR link stored successfully.',
    });
  } catch (error) {
    console.log(error);
    this.$q.notify({
      color: 'negative',
      message: 'Failed to store QR link.',
    });
  }
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
          this.storeQrLink(imgData)
          return
        }

        link.href = imgData
        link.download = `QR.${formate}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        this.storeQrLink(imgData)
      }
      qrImage.src = this.qrCodeDataUrl;
    },

  }
}
</script>

<style >
body::-webkit-scrollbar {
    display: none;
}
.color-picker{
  position: relative;
  bottom: 0.7px;
  height: 30px;
  width: 50px;
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
  width: 250px;
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