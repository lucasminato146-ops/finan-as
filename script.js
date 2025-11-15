// script.js
import { db, auth } from "./firebase.js"; // seu firebase.js deve exportar db e auth
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
  let userId = "demo"; // Para teste local sem login Firebase
  let transactions = [];

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

  // Render tabela
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
    feather.replace();
    updateTotals();
  }

  // Atualiza totais
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

  // Adicionar transação (local)
  function addTransaction(type) {
    const desc = description.value.trim();
    const amount = parseFloat(amountInput.value);
    const date = dateInput.value;
    const category = categoryInput.value;

    if (!desc || isNaN(amount) || !date || !category) {
      alert("Preencha todos os campos corretamente!");
      return;
    }

    const newTransaction = {
      id: Date.now().toString(),
      desc,
      amount,
      date,
      category,
      type
    };

    transactions.push(newTransaction);

    description.value = "";
    amountInput.value = "";
    dateInput.valueAsDate = new Date();
    categoryInput.value = "food";

    render();
  }

  // Excluir transação
  window.deleteTransaction = function(id) {
    transactions = transactions.filter(t => t.id !== id);
    render();
  }

  // Botões
  incomeBtn.addEventListener("click", () => addTransaction("income"));
  expenseBtn.addEventListener("click", () => addTransaction("expense"));

  render();
});
