import { createRouter, createWebHistory } from 'vue-router'
import Cookies from "js-cookie";
import { store } from '@/store';
import HomePage from '@/components/pages/HomePage.vue'
import LoginPage from '@/components/pages/LoginPage.vue'
import SignupPage from '@/components/pages/SignupPage.vue'
import ProductPage from '@/components/pages/ProductPage.vue'
import DetailPage from '@/components/pages/DetailPage.vue'
import CartPage from '@/components/pages/CartPage.vue'
import UserMenu from '@/components/user/UserMenu.vue'
import CheckoutPage from '@/components/pages/CheckoutPage.vue';
import UserPage from '@/components/pages/UserPage.vue';
import WishlistPage from '@/components/pages/WishlistPage.vue';

const checkAuth = () => {
  const jwtCookie = Cookies.get("jwt");
  const expirationDate = Cookies.get("tokenExpirationDate");
  const userId = Cookies.get("UID");

  if (jwtCookie) {
    if (new Date().getTime() < +expirationDate) {
      store.commit("auth/setToken", { idToken: jwtCookie, expiresIn: expirationDate });
      store.dispatch("auth/getUser", userId);
      return true;
    } else {
      store.commit("auth/setUserLogout");
      return false;
    }
  } else {
    return false;
  }
}

export const routes = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomePage, beforeEnter: (to, from, next) => { checkAuth(); next(); } },
    { path: '/login', name: 'login', component: LoginPage, beforeEnter: (to, from, next) => { checkAuth() ? next({ name: "home" }) : next(); } },
    { path: '/signup', name: 'signup', component: SignupPage, beforeEnter: (to, from, next) => { checkAuth() ? next({ name: "home" }) : next(); } },
    { path: '/products', name: 'products', component: ProductPage, beforeEnter: (to, from, next) => { checkAuth(); next(); } },
    { path: '/product/:id', name: 'detail-product', component: DetailPage, props: true, beforeEnter: (to, from, next) => { checkAuth() ? next() : next({ name: "login" }); } },
    { path: '/cart', name: 'cart', component: CartPage, beforeEnter: (to, from, next) => { checkAuth() ? next() : next({ name: "login" }); } },
    { path: '/wishlist', name: 'wishlist', component: WishlistPage, beforeEnter: (to, from, next) => { checkAuth() ? next() : next({ name: "login" }); } },
    { path: '/user/:component', name: 'user-menu', component: UserPage, props: true, beforeEnter: (to, from, next) => { checkAuth() ? next() : next({ name: "login" }); } },
    { path: '/cart/checkout', name: 'checkout', component: CheckoutPage, props: true, beforeEnter: (to, from, next) => { checkAuth() ? next() : next({ name: "login" }); } },
  ],
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 }
  }
})