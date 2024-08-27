<template>
  <div>
  <div class="flex-container" >

    <div v-for="(link,index) in qrLinks" :key="link" class="qrLinks"  >
      <div class="flex  flex-start">
        <div >
      <q-btn flat dense icon="download" @mouseenter="showDownload(index)" @mouseleave="hideDownload()" color="cyan" />

        </div>
      <div v-if="showDownloads&& index === this.index"  @mouseenter="showDownload(index)" @mouseleave="hideDownload()">
      <q-btn flat dense label="pdf" @click="download( 'pdf',link, index)" color="cyan" />
      <q-btn flat dense label="jpg" @click="download('jpg',link, index , )" color="cyan" />
      <q-btn flat dense label="png" @click="download('png',link, index)" color="cyan" />
      </div>
      <div class="remove">
         <q-btn flat dense icon="cancel" @click="removeQr(index)" />
      </div>
      </div>
       <div class="flex flex-center" >
        <img :src="link" alt="QRLinks" style="width:130px;height:130px;" />
       </div>

     </div>
  </div>
  </div>
</template>

<script>
import axios from 'axios'
import jsPDF from 'jspdf'
export default {
    data(){
        return{

          qrLinks:[],
          showDownloads : false,
          index:null
        }
    },

 async mounted(){
      this.$store.commit("toggleEdits", false)
    this.$store.commit('toggleSetVisiable', false)
    const token = localStorage.getItem('token')
  if(token){
    try{
    const response = await axios.get('http://localhost:3000/getQrLinks',{
      headers:{
        Authorization:token
      }
    })
    this.qrLinks = response.data.qrLinks
    // const storedLinks = localStorage.getItem('qrLinks');
    //  this.qrLinks = storedLinks ? JSON.parse(storedLinks) : [];

  }
  catch(err){
    this.$q.notify({
      type:'negative',
       message: err.response.data.message || 'Failed to fetch QR links.',
    })
  }
  } else{
    this.$q.notify({
      type:'negative',
      message:'you are not logged in '
    })
  }


},
methods:{
 showDownload(index) {
      this.showDownloads = true;
      this.index = index;
    },
    hideDownload() {
      this.showDownloads = false;
      this.index = null;
    },
      download(formate, link) {
    const a = document.createElement('a');

    // Set the download file name with the correct extension
    const fileName = `Qr_code.${formate}`;

    // If the format is jpg or png, download the image directly
    if (formate === 'png' || formate === 'jpg') {
      // Create a canvas to ensure the image format is correct
      const img = new Image();
      img.crossOrigin = 'Anonymous'; // To avoid CORS issues
      img.src = link;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        // Convert canvas to the desired format
        const dataURL = canvas.toDataURL(`image/${formate}`);
        a.href = dataURL;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      };
    } else if(formate === 'pdf'){
           const doc = new jsPDF()
           doc.addImage(link,'png',12,50,180,180)
           doc.save('Qr__code.pdf')

         }
      },
     async removeQr(index) {
      const token = localStorage.getItem('token');
      if (!token) {
        this.$q.notify({
          type: 'negative',
          message: 'You are not logged in.',
        });
        return;
      }

      // const linkToRemove = this.qrLinks[index];
      this.qrLinks.splice(index, 1); // Remove from local state

      try {
        // await axios.post(
        //   'http://localhost:3000/removeQrLink',
        //   { link: linkToRemove },
        //   { headers: { Authorization: token } }
        // );

        localStorage.setItem('qrLinks', JSON.stringify(this.qrLinks));
        this.$q.notify({
          type: 'positive',
          message: 'QR link removed successfully.',
        });
      } catch (err) {
        console.error('Failed to remove QR link:', err);
        this.$q.notify({
          type: 'negative',
          message: err.response?.data?.message || 'Failed to remove QR link.',
        });
      }

      }

}

}
</script>

<style>
.flex-container{
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 20px;
  margin: 20px;

}
.qrLinks{
  border: 2px solid black;
  width: 190px;
  height: 190px;
  position: relative;
}
.remove{
  position: absolute;
  right: 0px;
}

</style>