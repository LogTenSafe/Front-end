import VueRouter, { RouteConfig } from 'vue-router'
import Home from '@/views/Home.vue'
import SignUp from '@/views/SignUp.vue'
import DownloadClient from '@/components/DownloadClient.vue'
import ResetPassword from '@/views/ResetPassword.vue'
import ForgotPassword from '@/views/ForgotPassword.vue'
import EditAccount from '@/views/EditAccount.vue'
import NotFound from '@/views/NotFound.vue'

const routes: Array<RouteConfig> = [
  {
    name: 'Home',
    path: '/',
    component: Home
  },
  {
    name: 'SignUp',
    path: '/signup',
    component: SignUp
  },
  {
    name: 'BackupsIndex',
    path: '/backups',
    component: () => import(/* webpackChunkName: "backups" */ '@/views/BackupsIndex.vue')
  },
  {
    name: 'DownloadClient',
    path: '/download',
    component: DownloadClient
  },
  {
    path: '/reset_password/:token',
    name: 'ResetPassword',
    component: ResetPassword
  },
  {
    path: '/password/forgot',
    name: 'ForgotPassword',
    component: ForgotPassword
  },
  {
    path: '/password/change',
    name: 'ChangePassword',
    component: EditAccount
  },
  { path: '*', component: NotFound }
]

const router = new VueRouter({
  routes
})

export default router
