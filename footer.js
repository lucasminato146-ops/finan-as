class CustomFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <footer class="mt-16 py-8 border-t border-gray-800 glass">
                <div class="container mx-auto px-6 text-center text-gray-400">
                    <p class="text-lg font-semibold text-gray-300">CoinKeeper © 2025</p>
                    <p class="text-sm mt-1">Controle financeiro simples, rápido e inteligente.</p>

                    <div class="flex justify-center space-x-6 mt-4">
                        <a href="#" class="hover:text-indigo-400 transition">
                            <i data-feather="github"></i>
                        </a>
                        <a href="#" class="hover:text-indigo-400 transition">
                            <i data-feather="instagram"></i>
                        </a>
                        <a href="#" class="hover:text-indigo-400 transition">
                            <i data-feather="mail"></i>
                        </a>
                    </div>

                    <p class="text-xs mt-6 opacity-70">
                        Desenvolvido por Heitor — Todos os direitos reservados.
                    </p>
                </div>
            </footer>
        `;

        // Recarrega os ícones Feather
        if (window.feather) {
            feather.replace();
        }
    }
}

customElements.define("custom-footer", CustomFooter);
