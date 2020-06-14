import Vue from 'vue'
import {
  BButton,
  BButtonToolbar,
  BCol,
  BCollapse,
  BContainer,
  BForm,
  BFormFile,
  BFormGroup,
  BFormInput,
  BFormSpinbutton,
  BImg,
  BJumbotron,
  BNavbar,
  BNavbarBrand,
  BNavbarNav,
  BNavbarToggle,
  BNavItem,
  BPagination,
  BRow,
  BSpinner,
  BTable,
  ModalPlugin
} from 'bootstrap-vue'

Vue.component('b-button', BButton)
Vue.component('b-button-toolbar', BButtonToolbar)
Vue.component('b-col', BCol)
Vue.component('b-collapse', BCollapse)
Vue.component('b-container', BContainer)
Vue.component('b-form', BForm)
Vue.component('b-form-file', BFormFile)
Vue.component('b-form-group', BFormGroup)
Vue.component('b-form-input', BFormInput)
Vue.component('b-form-spinbutton', BFormSpinbutton)
Vue.component('b-img', BImg)
Vue.component('b-jumbotron', BJumbotron)
Vue.component('b-nav-item', BNavItem)
Vue.component('b-navbar', BNavbar)
Vue.component('b-navbar-brand', BNavbarBrand)
Vue.component('b-navbar-nav', BNavbarNav)
Vue.component('b-navbar-toggle', BNavbarToggle)
Vue.component('b-pagination', BPagination)
Vue.component('b-row', BRow)
Vue.component('b-spinner', BSpinner)
Vue.component('b-table', BTable)

Vue.use(ModalPlugin)
