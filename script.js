import { db, auth } from "./firebase.js";
import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    query,
    where
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
    let userId = null;
    let transactions = [];

    // Inputs do formulário
    const description = document.getElementById("description");
    const amountInput = document.getElementById("amount");
    const dateInput = document.getElementById("date");
    const categoryInput = document.getElementById("category");

    const list = document.getElementById("transactions-list");
    const incomeBtn = document.getElementById("income-btn");
    const expenseBtn = document.getElementById("expense-btn");

    // Carregar transações do Firestore
    async function loadTransactions() {
        if (!userId) return;

        const q = query(
            collection(db, "transactions"),
            where("userId", "==", userId)
        );

        const snap = await getDocs(q);

        transactions = snap.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        render();
    }

    // Adicionar transação
    async function addTransaction(type) {
        if (!userId) {
            alert("Você precisa estar logado!");
            return;
        }

        const desc = description.value.trim();
        const amount = parseFloat(amountInput.value);
        const date = dateInput.value;
        const category = categoryInput.value;

        if (!desc || isNaN(amount) || !date || !category) {
            alert("Preencha todos os campos corretamente!");
            return;
        }

        await addDoc(collection(db, "transactions"), {
            userId,
            desc,
            amount,
            category,
            date,
            type
        });

        // Limpa formulário
        description.value = "";
        amountInput.value = "";
        dateInput.valueAsDate = new Date();
        categoryInput.value = "food";

        loadTransactions();
    }

    // Excluir transação
    async function deleteTransaction(id) {
        await deleteDoc(doc(db, "transactions", id));
        loadTransactions();
    }
    window.deleteTransaction = deleteTransaction; // necessário para onclick inline

    // Renderizar lista
    function render() {
        list.innerHTML = "";

        for (const t of transactions) {
            list.innerHTML += `
                <tr>
                    <td>${t.desc}</td>
                    <td>${t.category}</td>
                    <td>${t.date}</td>
                    <td class="text-right ${t.type == "income" ? "text-green-400" : "text-red-400"}">
                        R$ ${t.amount.toFixed(2)}
                    </td>
                    <td class="text-right">
                        <button onclick="deleteTransaction('${t.id}')">
                            <i data-feather="trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        }

        // Atualiza Feather icons
        feather.replace();
    }

    // Botões
    incomeBtn.onclick = () => addTransaction("income");
    expenseBtn.onclick = () => addTransaction("expense");

    // Inicializa a data como hoje
    dateInput.valueAsDate = new Date();

    // Observar login
    auth.onAuthStateChanged(user => {
        if (user) {
            userId = user.uid;
            loadTransactions();
        } else {
            userId = null;
            transactions = [];
            render();
        }
    });
});
