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
        this.setupEvents();
        this.observeAuth();
    }

    render() {
        this.innerHTML = `
            <nav class="bg-gray-800 p-4 flex justify-between items-center shadow">
                <h1 class="text-xl font-bold text-primary-500">CoinKeeper</h1>

                <div id="authButtons">
                    <button id="loginBtn" class="bg-primary-500 px-4 py-2 rounded">Login</button>
                </div>
            </nav>

            <!-- Modal -->
            <div id="authModal" class="fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center">
                <div class="bg-gray-800 p-6 rounded-xl w-80">
                    <h2 class="text-xl mb-3 font-bold">Entrar</h2>

                    <input id="emailInput" type="email" placeholder="Email"
                        class="w-full mb-3 p-2 rounded bg-gray-700"/>

                    <input id="passwordInput" type="password" placeholder="Senha"
                        class="w-full mb-3 p-2 rounded bg-gray-700"/>

                    <button id="loginConfirm" class="bg-primary-500 w-full p-2 rounded mb-2">
                        Login
                    </button>

                    <button id="registerBtn" class="text-sm text-primary-400 hover:underline">
                        Criar conta
                    </button>

                    <button id="closeModal" class="text-red-400 mt-3 w-full">Fechar</button>
                </div>
            </div>
        `;
    }

    setupEvents() {
        const modal = this.querySelector("#authModal");

        this.querySelector("#loginBtn").onclick = () => {
            modal.classList.remove("hidden");
        };

        this.querySelector("#closeModal").onclick = () => {
            modal.classList.add("hidden");
        };

        this.querySelector("#loginConfirm").onclick = () => this.login();
        this.querySelector("#registerBtn").onclick = () => this.register();
    }

    async login() {
        const email = this.querySelector("#emailInput").value;
        const password = this.querySelector("#passwordInput").value;

        try {
            await signInWithEmailAndPassword(auth, email, password);
            alert("Login realizado!");
            this.querySelector("#authModal").classList.add("hidden");
        } catch (err) {
            alert("Erro: " + err.message);
        }
    }

    async register() {
        const email = this.querySelector("#emailInput").value;
        const password = this.querySelector("#passwordInput").value;

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            alert("Conta criada!");
            this.querySelector("#authModal").classList.add("hidden");
        } catch (err) {
            alert("Erro: " + err.message);
        }
    }

    observeAuth() {
        const authButtons = this.querySelector("#authButtons");

        onAuthStateChanged(auth, (user) => {
            if (user) {
                // logado
                authButtons.innerHTML = `
                    <span class="mr-4 text-green-400">${user.email}</span>
                    <button id="logoutBtn" class="bg-red-500 px-4 py-2 rounded">Sair</button>
                `;

                this.querySelector("#logoutBtn").onclick = () => signOut(auth);
            } else {
                // deslogado
                authButtons.innerHTML = `
                    <button id="loginBtn" class="bg-primary-500 px-4 py-2 rounded">Login</button>
                `;

                this.setupEvents();
            }
        });
    }
}

customElements.define("custom-navbar", CustomNavbar);
