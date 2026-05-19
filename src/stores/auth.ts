import { defineStore } from 'pinia'
import { ref } from 'vue'
import { VALID_EMAIL, VALID_PASSWORD } from '@/data'

export const useAuthStore = defineStore('auth', () => {
  const authenticated = ref(localStorage.getItem('pocketly_auth') === '1')

  function login(email: string, password: string): boolean {
    if (email === VALID_EMAIL && password === VALID_PASSWORD) {
      authenticated.value = true
      localStorage.setItem('pocketly_auth', '1')
      return true
    }
    return false
  }

  function logout() {
    authenticated.value = false
    localStorage.removeItem('pocketly_auth')
  }

  return { authenticated, login, logout }
})
