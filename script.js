// script.js
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
  let userId = "demo"; // Para teste local
  let transactions = [];
  let currentFilter = "all"; // "today", "month", "all"

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

  const dayFilterBtn = document.getElementById("day-filter");
  const monthFilterBtn = document.getElementById("month-filter");
  const allFilterBtn = document.getElementById("all-filter");

  dateInput.valueAsDate = new Date();

  function render() {
    list.innerHTML = "";

    let filtered = transactions;
    const today = new Date();

    if (currentFilter === "today") {
      filtered = transactions.filter(t => {
        const tDate = new Date(t.date);
        return tDate.toDateString() === today.toDateString();
      });
    } else if (currentFilter === "month") {
      filtered = transactions.filter(t => {
        const tDate = new Date(t.date);
        return tDate.getMonth() === today.getMonth() &&
               tDate.getFullYear() === today.getFullYear();
      });
    }

    filtered.forEach(t => {
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
    });

    feather.replace();
    updateTotals();
  }

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

  function addTransaction(type) {
    const desc = description.value.trim();
    const amount = parseFloat(amountInput.value);
    const date = dateInput.value;
    const category = categoryInput.value;

    if (!desc || isNaN(amount) || !date || !category) {
      alert("Preencha todos os campos corretamente!");
      return;
    }

    transactions.push({
      id: Date.now().toString(),
      desc,
      amount,
      date,
      category,
      type
    });

    description.value = "";
    amountInput.value = "";
    dateInput.valueAsDate = new Date();
    categoryInput.value = "food";

    render();
  }

  window.deleteTransaction = function(id) {
    transactions = transactions.filter(t => t.id !== id);
    render();
  }

  incomeBtn.addEventListener("click", () => addTransaction("income"));
  expenseBtn.addEventListener("click", () => addTransaction("expense"));

  // Filtros
  dayFilterBtn.addEventListener("click", () => {
    currentFilter = "today";
    render();
  });
  monthFilterBtn.addEventListener("click", () => {
    currentFilter = "month";
    render();
  });
  allFilterBtn.addEventListener("click", () => {
    currentFilter = "all";
    render();
  });

  render();
});
