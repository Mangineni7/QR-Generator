const routes = [
  {
    path:'/',
    component:() => import('pages/LoginPage.vue'),

  },
  {
    meta: { requiresAuth: true },
    path: '/mainLayout',
    component: () =>  import('layouts/MainLayout.vue'),


    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path:'/downloads', component: () =>  import('layouts/DownloadedQRCodes.vue')}
    ]
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
