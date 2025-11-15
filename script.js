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

    // Inputs
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

    // Inicializa data
    dateInput.valueAsDate = new Date();

    // Carregar transações
    async function loadTransactions() {
        if (!userId) return;

        try {
            const q = query(
                collection(db, "transactions"),
                where("userId", "==", userId)
            );

            const snap = await getDocs(q);
            transactions = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            render();
            updateTotals();
        } catch (err) {
            console.error(err);
        }
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

        try {
            await addDoc(collection(db, "transactions"), {
                userId,
                desc,
                amount,
                category,
                date,
                type
            });

            description.value = "";
            amountInput.value = "";
            dateInput.valueAsDate = new Date();
            categoryInput.value = "food";

            loadTransactions();
        } catch (err) {
            console.error(err);
        }
    }

    // Excluir transação
    async function deleteTransaction(id) {
        try {
            await deleteDoc(doc(db, "transactions", id));
            loadTransactions();
        } catch (err) {
            console.error(err);
        }
    }
    window.deleteTransaction = deleteTransaction;

    // Renderizar lista
    function render() {
        list.innerHTML = "";
        for (const t of transactions) {
            list.innerHTML += `
                <tr>
                    <td>${t.desc}</td>
                    <td>${t.category}</td>
                    <td>${t.date}</td>
                    <td class="text-right ${t.type === "income" ? "text-green-400" : "text-red-400"}">
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
        let income = 0, expense = 0;
        transactions.forEach(t => {
            if (t.type === "income") income += t.amount;
            else if (t.type === "expense") expense += t.amount;
        });
        totalIncomeEl.textContent = `R$ ${income.toFixed(2)}`;
        totalExpenseEl.textContent = `R$ ${expense.toFixed(2)}`;
        totalBalanceEl.textContent = `R$ ${(income - expense).toFixed(2)}`;
    }

    // Botões
    incomeBtn.addEventListener("click", () => addTransaction("income"));
    expenseBtn.addEventListener("click", () => addTransaction("expense"));

    // Observa login
    auth.onAuthStateChanged(user => {
        if (user) {
            userId = user.uid;
            loadTransactions();
        } else {
            userId = null;
            transactions = [];
            render();
            updateTotals();
        }
    });
});
