<template>
  <q-layout view="lHh Lpr lff">
    <q-header elevated style="background-color:rgb(43, 192, 185);">

      <q-toolbar >
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
          style="color: white"
        />

        <div class="flex justify-between" style="flex-grow:1">
        <div class="flex justify-between q-ml-xl">
        <div :class="{'selected':this.$store.state.openUrl}" class="flex flex-center"  v-if="visiable">
          <img src="/world-wide-web_1006771.png" style="width:20px;height:20px;">
        <q-btn
          flat
          dense
          label="Url"
          style="color: white"
          @click="toggleUrl"
        />
        </div>

        <div class="q-ml-xl flex flex-center" :class="{'selected':this.$store.state.openPdf}"  v-if="visiable ">
         <img src="/pdf_4726010.png" style="width:22px;height:22px">
        <q-btn
          flat
          dense
          label="Pdf"
          style="color: white"
          @click="togglePdf"
        />
           </div>

        </div>
        <div class="flex justify-between">
        <!-- <div>
          <q-btn
          flat
          dense
          icon="download"
          aria-label="Download"
          @click="downloads"
          class="downloads">
          <q-tooltip>Downloads</q-tooltip>
          </q-btn>
        </div> -->
        <div>
        <q-btn
        flat
        dense
        icon="logout"

        aria-label="Logout"
        @click=" logout"
        class="logout-content">
        <q-tooltip>Logout</q-tooltip>

        </q-btn>
      </div>
        </div>

        </div>

      </q-toolbar>

    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    style="background-color:rgb(43, 192, 185);"
    >
      <q-list>
        <q-item-label
          header
        >

        </q-item-label>
         <div v-if="!visiableStyles">
           <h5  style="color: white ;font-weight:bold;text-align:center"> Downloads</h5>
           <div class="button q-mt-xl" @click="toggleBack "> Go Back

           </div>
        </div>
        <div style="margin-left:70px;" v-if="visiableStyles">
          <img src="/icons/proxima.png" alt="img" style="width:150px;height:50px;border-radius:25px" />
        </div>
        <div v-if="visiableStyles">
          <h5  style="color: white ;font-weight:bold;text-align:center"> Styles</h5>
        </div>

        <div class="button-container q-gutter-sm" v-if="visiableStyles" >

          <div class="button" @click="toggleAddColors() ">Add Color</div>
          <div class="button" @click="toggleAddFrame() ">Add Frame</div>
          <div class="button" @click="toggleAddSvg() ">Add Svg</div>
          <div class="button" @click="toggleAddImg() ">Add Logo</div>
          <!-- <div class="button" @click="toggleBack() ">
            Go Back</div> -->
        </div>
        <!-- <EssentialLink>
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        /> -->
         <!-- <q-btn @click="togglAddFrame" style="background:none">Add Frames</q-btn> -->
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>



  </q-layout>
</template>

<script>
import { useStore } from 'vuex'
import { defineComponent, ref ,onBeforeMount, computed, onMounted } from 'vue'
import {  Notify } from 'quasar'
import { useRouter } from 'vue-router'

//import EssentialLink from 'components/EssentialLink.vue'

const linksList = [
  {
    title: 'Docs',
    caption: 'quasar.dev',
    icon: 'school',
    link: 'https://quasar.dev'
  },
  {
    title: 'Github',
    caption: 'github.com/quasarframework',
    icon: 'code',
    link: 'https://github.com/quasarframework'
  },
  {
    title: 'Discord Chat Channel',
    caption: 'chat.quasar.dev',
    icon: 'chat',
    link: 'https://chat.quasar.dev'
  },
  {
    title: 'Forum',
    caption: 'forum.quasar.dev',
    icon: 'record_voice_over',
    link: 'https://forum.quasar.dev'
  },
  {
    title: 'Twitter',
    caption: '@quasarframework',
    icon: 'rss_feed',
    link: 'https://twitter.quasar.dev'
  },
  {
    title: 'Facebook',
    caption: '@QuasarFramework',
    icon: 'public',
    link: 'https://facebook.quasar.dev'
  },
  {
    title: 'Quasar Awesome',
    caption: 'Community Quasar projects',
    icon: 'favorite',
    link: 'https://awesome.quasar.dev'
  }
]


export default defineComponent({
  name: 'MainLayout',

  components: {
    //EssentialLink


  },

  setup (){
     const store = useStore()

    const router = useRouter()
    const leftDrawerOpen = ref(false)
    const visiable =computed(() => store.state.setVisiable)
     const visiableStyles = computed(() => store.state.editValue )


    // const store = useStore()
    // // function togglAddFrame() {
    // //   store.dispatch('toggleFrame')
    // // }


    onBeforeMount(() => {
      console.log("mountedmains :"+ store.state.editValue);
      router.beforeEach((to, from, next) => {
        if (to.path !== '/downloads') {
           visiable.value= store.commit('toggleSetVisiable', true)
          visiableStyles.value = store.commit('toggleEdits' ,true) // Set visiable to true for other routes
          //store.commit("toggleEdits", true)
        }

        next()
      })
    })


    const  toggleAddFrame = () => {

       if(store.state.qrCode === null ){
        Notify.create({
          message:'Please Enter Url or Pdf And Create Qr Code',
          color:'negative'
        })
        return
       }
      store.dispatch('toggleFrame')
      console.log("store frames :", store.state.addFrames);

       //console.log("store "+ store.state.addFrames)
        if(window.innerWidth < 1000) {
         hideDrawer()
       }
       }
    const  toggleAddSvg = () => {
      if(store.state.qrCode ===null ){
          console.log("shannu :");
        Notify.create({
          message:'Please Enter Url or Pdf And Create Qr Code',
          color:'negative'
        })
        return
      }
      store.dispatch('toggleSvg')
      console.log("svgg :", store.state.addSvg);

      // console.log("store "+ store.state.addSvg)
       if(window.innerWidth < 1000) {
         hideDrawer()
       }
      }

    const  toggleAddImg = () => {
      if(store.state.qrCode === null ){

        Notify.create({
          message:'Please Enter Url or Pdf And Create Qr Code',
          color:'negative'
        })
        return
      }
      store.dispatch('toggleImg')
       //console.log("store "+ store.state.addImg)
        if(window.innerWidth < 1000) {
         hideDrawer()
       }
      }
      const toggleAddColors = () =>{
        if(store.state.qrCode === null){

        Notify.create({
          message:'Please Enter Url or Pdf And Create Qr Code',
          color:'negative'
        })
        return
      }
      store.dispatch('toggleAddColors')
       //console.log("store "+ store.state.adColors)
        if(window.innerWidth < 1000) {
         hideDrawer()
       }
      }
   const toggleLeftDrawer =() => {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
      const toggleUrl = () => {
        store.dispatch('toggleUrl')
      }
      const togglePdf = () => {
        store.dispatch('togglePdf')
      }

    const hideDrawer = () => {
      leftDrawerOpen.value = false
    }

    const logout = () => {
      localStorage.removeItem('token')
      router.push('/')
    }
    const downloads = () =>{
     visiable.value = false
      store.commit('toggleEdits', false)
      console.log('store :'+ store.state.editValue);
      router.push('/downloads')
    }
    const toggleBack = () =>{
      store.commit('toggleQrCodeDataUrl','')
      store.commit('toggleEdits', true)
      store.commit('toggleUrls', '')
      console.log(" qrcodedata url    ::: "+ store.state.editValue);
      router.push('/mainLayout')

    }

    // watch(
    //   () => $q.screen.width,
    //   (width) => {
    //     if (width < 1000) {
    //       hideDrawer()
    //     }
    //   },
    //   { immediate: true }
    // )
    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer,
      toggleAddFrame,
      toggleAddImg,
      toggleAddSvg,
      hideDrawer,
      togglePdf,
      toggleUrl,
      toggleAddColors,
      logout,
      downloads,
      toggleBack,
      visiable,
      visiableStyles

    }
  }
})
</script>
<style scoped>
.downloads{
  margin-right: 15px;
}
.header-content{
  display: flex;
  justify-content: space-around;
  align-items: center;
 width: 100%;
}


.button{
  color: white;
  text-align: center;
  font-weight: bold;
  margin-right: 5px;
  margin-left: 13px;
  cursor: pointer;
  padding: 10px;
  border: 1px solid #fcf6f6;
  border-radius: 25px;
  background-color: rgb(43, 192, 185);
  transition: background-image 0.3s ease;
}
.button::before{
  content: "";
  height: 4px;
  color: red;
  width:0px;
  translate: 3s ;

}
.button:hover{
  background-color: rgb(43, 192, 185);
  background-color: rgba(248, 250, 250, 0.74);


  color: black;
}
.selected{
  background-color: rgb(49, 49, 107);
  border-radius: 10px;
}
</style>
