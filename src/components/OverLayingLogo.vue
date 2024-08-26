<template>


      <div >
        <h6>Add Image</h6>
        <div class="flex justify-between">
          <div>
             <q-btn @click="addOverLayImages('cancel')" > <img src="/cancel.png"   class="image"></q-btn>
          </div>
          <div>
      <input type="file" accept="image/*" @change="handleImageUpload"  style="display: none;" ref="imageInput" />
      <q-btn  > <img src="/image.png" @click="openImageUploadDialog"  class="image"></q-btn>
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
       style="width:300px;" @change="generateQRCode"></q-slider>

      </div>
      </div>

</template>
<script>
export default {
  emits:['callOverlayFunction','callGenerateQRCode','callOverlayImageMethod'],
    data(){
        return{
             overlaySize:30

        }
    },
    methods:{
        addOverLayImages(logo){
            this.$emit('callOverlayFunction' , logo)
        },
        generateQRCode(){
            this.$emit('callGenerateQRCode' , this.overlaySize)

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
          this.$emit('callOverlayImageMethod', img);
        };
      };

    },

    }
}
</script>
<style>

</style>