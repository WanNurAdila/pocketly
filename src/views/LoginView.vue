<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import PocketlyLogo from '@/components/PocketlyLogo.vue'
import AppIcon from '@/components/AppIcon.vue'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth   = useAuthStore()

const email    = ref('')
const password = ref('')
const showPass = ref(false)
const hasError = ref(false)
const loading  = ref(false)

function handleSubmit() {
  if (loading.value) return
  loading.value = true
  hasError.value = false

  setTimeout(() => {
    if (auth.login(email.value, password.value)) {
      router.push('/home')
    } else {
      hasError.value = true
      loading.value  = false
    }
  }, 400)
}
</script>

<template>
  <div data-testid="screen-login" style="display:flex;height:100vh;overflow:hidden;">

    <!-- ─── Left brand panel ──────────────────────────────── -->
    <div class="login-brand" style="width:540px;flex-shrink:0;background:var(--ink);color:var(--paper);position:relative;overflow:hidden;padding:48px 44px;display:flex;flex-direction:column;">

      <!-- Top bar -->
      <div style="position:relative;z-index:2;display:flex;justify-content:space-between;align-items:center;">
        <PocketlyLogo :size="30" :dark="true" />
        <span class="label-xs" style="color:var(--paper);opacity:0.6;">v 2.4 · demo</span>
      </div>

      <!-- Geometric composition -->
      <div style="position:relative;flex:0 0 auto;height:320px;margin-top:40px;margin-bottom:40px;" aria-hidden="true">
        <div style="position:absolute;top:30px;left:-40px;width:220px;height:220px;border-radius:50%;background:var(--coral);border:2px solid var(--paper);" />
        <div style="position:absolute;top:90px;left:180px;width:160px;height:160px;background:var(--butter);border:2px solid var(--paper);" />
        <!-- Triangle (mint) via clip-path -->
        <div style="position:absolute;top:0;left:280px;width:0;height:0;border-left:90px solid transparent;border-right:90px solid transparent;border-bottom:160px solid var(--mint);" />
        <div style="position:absolute;top:200px;left:350px;width:110px;height:110px;border-radius:50%;background:var(--lilac);border:2px solid var(--paper);" />
        <div style="position:absolute;top:240px;left:70px;width:150px;height:80px;background:var(--sky);border-radius:999px 999px 0 0;border:2px solid var(--paper);" />
        <div style="position:absolute;top:20px;right:0;width:44px;height:44px;border:2.5px solid var(--paper);transform:rotate(45deg);" />
      </div>

      <!-- Headline zone -->
      <div style="position:relative;z-index:2;">
        <h2 class="display" style="font-size:60px;line-height:0.92;color:var(--paper);">
          Money,<br/>
          <span style="color:var(--butter);">shaped.</span>
        </h2>
        <p style="margin-top:18px;font-size:15.5px;color:var(--paper);opacity:0.95;max-width:400px;line-height:1.55;">
          A small, geometric budgeting tool. Track expenses, set ceilings,
          see where your month is going.
        </p>
      </div>

      <!-- Footer -->
      <div style="margin-top:auto;padding-top:28px;position:relative;z-index:2;display:flex;justify-content:space-between;align-items:center;">
        <span class="label-xs" style="color:var(--paper);opacity:0.55;">© 2026 · Built for QA practice</span>
        <div class="row" style="gap:6px;">
          <span v-for="c in ['coral','mint','butter','sky']" :key="c"
            :style="{ width:'8px', height:'8px', background:`var(--${c})`, borderRadius:'50%' }" />
        </div>
      </div>
    </div>

    <!-- ─── Right form panel ──────────────────────────────── -->
    <div class="login-form" style="flex:1;padding:64px 80px;display:flex;flex-direction:column;position:relative;overflow-y:auto;">
      <!-- floating decorations -->
      <div style="position:absolute;top:40px;right:40px;width:80px;height:80px;border-radius:50%;background:var(--butter);border:2px solid var(--ink);pointer-events:none;" />
      <div style="position:absolute;top:90px;right:100px;width:18px;height:18px;background:var(--ink);pointer-events:none;" />

      <p class="label-xs" data-testid="login-eyebrow">Sign in to your account</p>
      <h1 class="display" style="font-size:44px;margin-top:8px;">Welcome back.</h1>
      <p style="color:var(--ink-mute);margin-top:8px;font-size:14px;">
        New here? <a href="#" data-testid="link-create-account" style="color:var(--ink);font-weight:600;">Create an account ›</a>
      </p>

      <form style="margin-top:36px;display:flex;flex-direction:column;gap:18px;"
        data-testid="form-login"
        @submit.prevent="handleSubmit">

        <!-- Email -->
        <div class="field">
          <label for="input-email">Email</label>
          <input id="input-email" v-model="email" type="email" class="input"
            placeholder="you@email.com"
            data-testid="input-email"
            autocomplete="email"
            @keydown.enter.prevent="handleSubmit" />
        </div>

        <!-- Password -->
        <div class="field">
          <label for="input-password">Password</label>
          <div style="position:relative;">
            <input id="input-password" v-model="password"
              :type="showPass ? 'text' : 'password'"
              :class="['input', hasError ? 'error' : '']"
              placeholder="••••••••"
              style="padding-right:52px;"
              data-testid="input-password"
              autocomplete="current-password"
              :aria-invalid="hasError"
              @keydown.enter.prevent="handleSubmit" />
            <button type="button" data-testid="btn-toggle-password"
              style="position:absolute;right:6px;top:6px;bottom:6px;width:38px;border:none;background:transparent;cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--ink-mute);"
              @click="showPass = !showPass">
              <AppIcon :name="showPass ? 'eye-off' : 'eye'" :size="18" />
            </button>
          </div>
          <p v-if="hasError" data-testid="error-password"
            style="color:var(--bad);font-size:13px;margin-top:4px;display:flex;align-items:center;gap:6px;">
            <AppIcon name="x" :size="14" :stroke="2.5" />
            Incorrect email or password. Try again.
          </p>
        </div>

        <!-- Remember + forgot -->
        <div class="row-between" style="margin-top:4px;">
          <label style="display:flex;align-items:center;gap:8px;font-size:13px;cursor:pointer;">
            <input type="checkbox" data-testid="checkbox-remember"
              style="width:16px;height:16px;accent-color:var(--ink);" />
            Remember me
          </label>
          <a href="#" data-testid="link-forgot" style="font-size:13px;color:var(--ink);font-weight:600;">
            Forgot password?
          </a>
        </div>

        <!-- Submit -->
        <button class="btn btn-primary" type="submit"
          data-testid="btn-submit-login"
          :disabled="loading"
          style="height:52px;margin-top:8px;font-size:15px;">
          {{ loading ? 'Signing in…' : 'Sign in' }}
          <AppIcon v-if="!loading" name="arrow-up-right" :size="16" />
        </button>
      </form>

      <!-- Demo credentials -->
      <div class="card-flat" data-testid="demo-creds"
        style="margin-top:28px;padding:16px;background:var(--butter);">
        <p class="label-xs" style="margin-bottom:6px;">Demo credentials</p>
        <div class="mono" style="font-size:13px;line-height:1.7;">
          <p data-testid="demo-email"><strong>email</strong> · demo@pocketly.app</p>
          <p data-testid="demo-password"><strong>pass&nbsp;</strong> · pocket1234</p>
        </div>
      </div>

      <p style="margin-top:auto;padding-top:24px;color:var(--ink-mute);font-size:12px;">
        © 2026 Pocketly · A demo for automation testing.
      </p>
    </div>
  </div>
</template>
