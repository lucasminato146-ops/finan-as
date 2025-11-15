import { db } from "./firebase.js"; // removi auth temporariamente para teste
import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
    let transactions = [];

    // Inputs do formulário
    const description = document.getElementById("description");
    const amountInput = document.getElementById("amount");
    const dateInput = document.getElementById("date");
    const categoryInput = document.getElementById("category");

    const list = document.getElementById("transactions-list");
    const incomeBtn = document.getElementById("income-btn");
    const expenseBtn = document.getElementById("expense-btn");

    const totalIncomeEl = document.getElementById("total-income");
    const totalExpenseEl = document.getElementById("total-expense");
    const totalBalanceEl = document.getElementById("total-balance");

    // Inicializa data como hoje
    dateInput.valueAsDate = new Date();

    // Carregar transações do Firestore
    async function loadTransactions() {
        try {
            const snap = await getDocs(collection(db, "transactions"));

            transactions = snap.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            render();
            updateTotals();
        } catch (error) {
            console.error("Erro ao carregar transações:", error);
        }
    }

    // Adicionar transação
    async function addTransaction(type) {
        const desc = description.value.trim();
        const amount = parseFloat(amountInput.value);
        const date = dateInput.value;
        const category = categoryInput.value;

        if (!desc || isNaN(amount) || !date || !category) {
            alert("Preencha todos os campos corretamente!");
            return;
        }

        try {
            await addDoc(collection(db, "transactions"), {
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
        } catch (error) {
            console.error("Erro ao adicionar transação:", error);
        }
    }

    // Excluir transação
    async function deleteTransaction(id) {
        try {
            await deleteDoc(doc(db, "transactions", id));
            loadTransactions();
        } catch (error) {
            console.error("Erro ao excluir transação:", error);
        }
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

        if (window.feather) feather.replace();
    }

    // Atualizar totais
    function updateTotals() {
        let income = 0;
        let expense = 0;

        for (const t of transactions) {
            if (t.type === "income") income += t.amount;
            else if (t.type === "expense") expense += t.amount;
        }

        totalIncomeEl.textContent = `R$ ${income.toFixed(2)}`;
        totalExpenseEl.textContent = `R$ ${expense.toFixed(2)}`;
        totalBalanceEl.textContent = `R$ ${(income - expense).toFixed(2)}`;
    }

    // Botões
    incomeBtn.addEventListener("click", (e) => {
        e.preventDefault();
        addTransaction("income");
    });

    expenseBtn.addEventListener("click", (e) => {
        e.preventDefault();
        addTransaction("expense");
    });

    // Inicializa
    loadTransactions();
});
