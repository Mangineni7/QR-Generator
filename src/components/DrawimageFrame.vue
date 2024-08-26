<template>

    <h6 >Add Svg</h6>
      <div class="image-frames-scroll">
      <div class="class" >
        <q-btn @click="selectedImageFrame('frame1')"><img src="/scannerFrameGift3.jpg" alt="scanner img" style="width:70px;height:70px"/></q-btn>
        <q-btn @click="selectedImageFrame('frame2')"><img src="/scanmeMobile.webp" alt="scanner img" style="width:70px;height:70px"/></q-btn>
        <q-btn @click="selectedImageFrame('frame3')"><img src="/scanMe2Triangle.jpg" alt="scanner img" style="width:70px;height:70px"/></q-btn>
        <q-btn @click="selectedImageFrame('frame4')"><img src="/scan me  simple.jpg" alt="scanner img" style="width:70px;height:70px"/></q-btn>
        <q-btn @click="selectedImageFrame('frame5')"><img src="/scanMeBag.jpg" alt="scanner img" style="width:70px;height:70px"/></q-btn>
        <q-btn @click="selectedImageFrame('frame6')"><img src="/scanMe1.jpg" alt="scanner img" style="width:70px;height:70px"/></q-btn>
        <q-btn @click="selectedImageFrame('frame7')"><img src="/scanMe shapes.jpg" alt="scanner img" style="width:70px;height:70px"/></q-btn>
      </div>
      </div>
</template>
<script>

export default {
    emits:['callSelectImageFrame'],
    methods:{
        selectedImageFrame(frame){
            this.$emit('callSelectImageFrame' , frame)
        }
    }

}
</script>
<style scoped>

</style>


