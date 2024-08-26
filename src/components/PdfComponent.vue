<template>
<div class="flex flex-center" v-if="showLoader">
       <img src="../statics/Animation - 1713955201690.gif"  />
       </div>

 <q-form v-else>
      <div class="q-mt-sm" >
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

</template>
<script>
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";


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
  emits:['callQrGeneratorPdf'],
// props: {
//     data: Boolean
//   },

data(){
    return{
       selectedPdfName:'',
       pdfUrl:'',
       showLoader:false
    }
},
// watch:{
//   data(newVal){
//     this.showLoader = newVal
//     console.log('showLoader', this.showLoader);
//   }

//},
methods:{
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
        this.showLoader = false
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
generateQRCode(){
    this.$emit('callQrGeneratorPdf' , {pdf:this.pdfUrl, showLoader:this.showLoader})
},

}
}
</script>
<style scoped>

</style>