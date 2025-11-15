// components/navbar.js
// Este arquivo é um ES module — seu index.html deve carregá-lo com: <script type="module" src="components/navbar.js"></script>

import { auth } from "../firebase.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

class CustomNavbar extends HTMLElement {
  connectedCallback() {
    this.render();
    this.cache();
    this.bind();
    this.observeAuth();
  }

  render() {
    this.innerHTML = `
      <header class="bg-gray-900 border-b border-gray-800">
        <div class="container mx-auto px-4 py-3 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <!-- logo: ícone + texto -->
            <div class="w-10 h-10 rounded flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-600 text-white font-bold">
              CK
            </div>
            <div class="text-white font-bold text-lg">CoinKeeper</div>
          </div>

          <!-- menu desktop -->
          <nav class="hidden md:flex items-center gap-6">
            <a href="index.html" class="text-gray-200 hover:text-white">Home</a>
          </nav>

          <!-- auth area -->
          <div id="auth-area" class="flex items-center gap-3">
            <button id="login-open-btn" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded hidden md:inline-block">Entrar</button>
            <!-- when logged: user email + logout button will replace above -->
            <button id="mobile-menu-btn" class="md:hidden text-gray-200 p-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
            </button>
          </div>
        </div>

        <!-- mobile menu -->
        <div id="mobile-menu" class="md:hidden hidden bg-gray-900 border-t border-gray-800">
          <div class="px-4 py-3">
            <a href="index.html" class="block py-2 text-gray-200">Home</a>
            <div id="mobile-auth-area" class="mt-2"></div>
          </div>
        </div>
      </header>

      <!-- Auth Modal (login/register) -->
      <div id="auth-modal" class="fixed inset-0 z-50 hidden items-center justify-center bg-black bg-opacity-50">
        <div class="bg-gray-800 rounded-xl p-6 w-80 shadow-lg">
          <h3 class="text-xl font-bold mb-4 text-white" id="auth-modal-title">Entrar</h3>

          <label class="block text-sm text-gray-300">Email</label>
          <input id="auth-email" type="email" class="w-full mb-3 px-3 py-2 rounded bg-gray-700 text-white outline-none" />

          <label class="block text-sm text-gray-300">Senha</label>
          <input id="auth-password" type="password" class="w-full mb-4 px-3 py-2 rounded bg-gray-700 text-white outline-none" />

          <div class="flex gap-2">
            <button id="auth-login-btn" class="flex-1 bg-indigo-600 hover:bg-indigo-700 py-2 rounded text-white font-semibold">Entrar</button>
            <button id="auth-register-btn" class="flex-1 bg-gray-700 hover:bg-gray-600 py-2 rounded text-white">Criar</button>
          </div>

          <button id="auth-close" class="mt-3 text-red-400 w-full">Fechar</button>
          <p id="auth-msg" class="mt-3 text-sm text-red-400"></p>
        </div>
      </div>
    `;
  }

  cache() {
    this.loginOpenBtn = this.querySelector("#login-open-btn");
    this.mobileMenuBtn = this.querySelector("#mobile-menu-btn");
    this.mobileMenu = this.querySelector("#mobile-menu");
    this.authModal = this.querySelector("#auth-modal");
    this.authEmail = this.querySelector("#auth-email");
    this.authPassword = this.querySelector("#auth-password");
    this.authLoginBtn = this.querySelector("#auth-login-btn");
    this.authRegisterBtn = this.querySelector("#auth-register-btn");
    this.authClose = this.querySelector("#auth-close");
    this.authMsg = this.querySelector("#auth-msg");
    this.authArea = this.querySelector("#auth-area");
    this.mobileAuthArea = this.querySelector("#mobile-auth-area");
  }

  bind() {
    // open modal
    if (this.loginOpenBtn) this.loginOpenBtn.addEventListener("click", () => this.openModal());
    if (this.mobileMenuBtn) this.mobileMenuBtn.addEventListener("click", () => this.toggleMobileMenu());

    // modal buttons
    this.authLoginBtn.addEventListener("click", () => this.login());
    this.authRegisterBtn.addEventListener("click", () => this.register());
    this.authClose.addEventListener("click", () => this.closeModal());

    // close modal by clicking overlay
    this.authModal.addEventListener("click", (e) => {
      if (e.target === this.authModal) this.closeModal();
    });
  }

  toggleMobileMenu() {
    this.mobileMenu.classList.toggle("hidden");
  }

  openModal() {
    this.authMsg.textContent = "";
    this.authEmail.value = "";
    this.authPassword.value = "";
    this.authModal.classList.remove("hidden");
    this.authEmail.focus();
  }

  closeModal() {
    this.authModal.classList.add("hidden");
  }

  async login() {
    const email = this.authEmail.value.trim();
    const password = this.authPassword.value;
    this.authMsg.textContent = "";
    if (!email || password.length < 6) {
      this.authMsg.textContent = "Informe email e senha (mín 6 caracteres).";
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
      this.closeModal();
    } catch (err) {
      this.authMsg.textContent = "Erro: " + (err.message || err.code);
    }
  }

  async register() {
    const email = this.authEmail.value.trim();
    const password = this.authPassword.value;
    this.authMsg.textContent = "";
    if (!email || password.length < 6) {
      this.authMsg.textContent = "Informe email e senha (mín 6 caracteres).";
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      this.closeModal();
    } catch (err) {
      this.authMsg.textContent = "Erro: " + (err.message || err.code);
    }
  }

  observeAuth() {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // mostra email + botão logout
        this.authArea.innerHTML = `
          <span class="hidden md:inline-block text-sm text-gray-200 mr-3">${user.email}</span>
          <button id="logout-btn" class="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded">Sair</button>
        `;
        this.mobileAuthArea.innerHTML = `<button id="mobile-logout" class="w-full bg-red-500 py-2 rounded text-white">Sair</button>`;

        const logoutBtn = this.querySelector("#logout-btn");
        const mobileLogout = this.querySelector("#mobile-logout");
        if (logoutBtn) logoutBtn.onclick = () => signOut(auth);
        if (mobileLogout) mobileLogout.onclick = () => signOut(auth);
      } else {
        // mostra botão entrar
        this.authArea.innerHTML = `<button id="login-open-btn" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded hidden md:inline-block">Entrar</button>`;
        this.mobileAuthArea.innerHTML = `<button id="mobile-login" class="w-full bg-indigo-600 py-2 rounded text-white">Entrar</button>`;
        // rebind events because we replaced innerHTML
        const mobileLogin = this.querySelector("#mobile-login");
        const loginOpen = this.querySelector("#login-open-btn");
        if (loginOpen) loginOpen.addEventListener("click", () => this.openModal());
        if (mobileLogin) mobileLogin.addEventListener("click", () => this.openModal());
      }
    });
  }
}

customElements.define("custom-navbar", CustomNavbar);
