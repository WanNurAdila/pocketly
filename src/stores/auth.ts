import { defineStore } from 'pinia'
import { ref } from 'vue'
import { CREDENTIALS } from '@/data'

export const useAuthStore = defineStore('auth', () => {
  const authenticated = ref(localStorage.getItem('pocketly_auth') === '1')
  const displayName   = ref(localStorage.getItem('pocketly_display_name') ?? '')

  function login(email: string, password: string): boolean {
    const cred = CREDENTIALS.find(c => c.email === email && c.password === password)
    if (cred) {
      authenticated.value = true
      displayName.value   = cred.displayName
      localStorage.setItem('pocketly_auth', '1')
      localStorage.setItem('pocketly_display_name', cred.displayName)
      return true
    }
    return false
  }

  function logout() {
    authenticated.value = false
    displayName.value   = ''
    localStorage.removeItem('pocketly_auth')
    localStorage.removeItem('pocketly_display_name')
  }

  return { authenticated, displayName, login, logout }
})
