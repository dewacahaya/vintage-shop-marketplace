import CartPage from '@/components/pages/CartPage.vue'
import DetailPage from '@/components/pages/DetailPage.vue'
import HomePage from '@/components/pages/HomePage.vue'
import LoginPage from '@/components/pages/LoginPage.vue'
import ProductPage from '@/components/pages/ProductPage.vue'
import SignupPage from '@/components/pages/SignupPage.vue'
import UserMenu from '@/components/user/UserMenu.vue'
import { createRouter, createWebHistory } from 'vue-router'

export const routes = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomePage },
    { path: '/login', name: 'login', component: LoginPage },
    { path: '/signup', name: 'signup', component: SignupPage },
    { path: '/products', name: 'products', component: ProductPage },
    { path: '/product/:id', name: 'detail-product', component: DetailPage, props: true },
    { path: '/cart', name: 'cart', component: CartPage },
    { path: '/user-menu', name: 'user-menu', component: UserMenu },
  ],
})
