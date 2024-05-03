import { store } from 'quasar/wrappers'
import { createStore } from 'vuex'

// import example from './module-example'

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default store(function (/* { ssrContext } */) {
  const Store = createStore({
    state:{
       addFrames: false,
       addSvg: false,
       addImg:false,
       openUrl:true,
       openPdf:false,
       qrCode:null,
       addColors:false
    },
    mutations:{
      toggleFrame(state) {
        state.addFrames = !state.addFrames
        if(state.addFrames){
          state.addImg = false
          state.addColors =false
          state.addSvg =false
         }
      },
      toggleSvg(state){
        state.addSvg = !state.addSvg
        if(state.addSvg){
          state.addImg = false
          state.addColors =false
          state.addFrames =false
         }

      },
      toggleImg(state){
        state.addImg = !state.addImg
        if(state.addImg){
          state.addFrames = false
          state.addColors =false
          state.addSvg =false
         }
      },
      toggleAddColors(state){
         state.addColors = ! state.addColors
         if(state.addColors){
          state.addImg = false
          state.addFrames =false
          state.addSvg =false
         }
      },
      toggleUrl(state){
        state.openUrl = true
        if(state.openUrl){
          state.openPdf = false
          state.addFrames = false
          state.addSvg = false
          state.addImg = false
          state.addColors = false
        }
      },
      togglePdf(state){
        state.openPdf = true
        if(state.openPdf){
          state.openUrl = false
          state.addFrames = false
          state.addSvg = false
          state.addImg = false
          state.addColors = false
        }
      },
      toggleQrcode(state, value){
        state.qrCode = value
      }

    },
    actions:{
      toggleFrame({commit}) {
        commit('toggleFrame')
      },
      toggleSvg({commit}) {
        commit('toggleSvg')
      },
      toggleImg({commit}) {
        commit('toggleImg')
      },
      toggleUrl({commit}){
        commit('toggleUrl')
      },
      togglePdf({commit}){
        commit('togglePdf')
      },
      toggleAddColors({commit}){
        commit('toggleAddColors')
      }

    },
    modules: {
      // example
    },

    // enable strict mode (adds overhead!)
    // for dev mode and --debug builds only
    strict: process.env.DEBUGGING
  })

  return Store
})
