<template>

<div  style="width:100%;" >
      <q-form class="q-gutter-md ">
        <div >
        <div>
        <q-input filled v-model="url" label="Enter URL for QR code" placeholder="http://www.example.com" required class="url-input" @keyup="checkUrl" />
         <span style="color:red;" v-if="error">url must starts with http or https and enter valid url</span>
        </div>
        </div>
        <div class="flex flex-center q-mt-xl" >
        <q-btn @click="generateQRCode" label="Generate QR Code" color="primary" />
      </div>
      </q-form>
      </div>

</template>
<script>
export default {
  emits:['callQrGenerator'],
    data(){
        return{
            url:'',
            error:false
        }
    },
    methods:{
        generateQRCode(){
            this.$emit('callQrGenerator' , this.url,this.error )
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
    }
}
</script>
<style scoped>

</style>
