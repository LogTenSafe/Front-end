import VueRouter, { RouteConfig } from 'vue-router'
import DownloadClient from '@/components/DownloadClient.vue'

const BackupsIndex = () => import(/* webpackChunkName: "logged-in" */ '@/views/BackupsIndex.vue')
const EditAccount = () => import(/* webpackChunkName: "logged-in" */ '@/views/EditAccount.vue')
const Home = () => import(/* webpackChunkName: "logged-out" */ '@/views/Home.vue')
const SignUp = () => import(/* webpackChunkName: "logged-out" */ '@/views/SignUp.vue')
const ForgotPassword = () => import(/* webpackChunkName: "logged-out" */ '@/views/ForgotPassword.vue')
const NotFound = () => import('@/views/NotFound.vue')
const ResetPassword = () => import('@/views/ResetPassword.vue')

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
    component: BackupsIndex
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
