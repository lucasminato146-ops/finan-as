document.addEventListener('DOMContentLoaded', function() {
    // Initialize transactions array from localStorage or empty array
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    
    // DOM elements
    const transactionForm = document.getElementById('transaction-form');
    const descriptionInput = document.getElementById('description');
    const amountInput = document.getElementById('amount');
    const dateInput = document.getElementById('date');
    const categoryInput = document.getElementById('category');
    const incomeBtn = document.getElementById('income-btn');
    const expenseBtn = document.getElementById('expense-btn');
    const transactionsList = document.getElementById('transactions-list');
    const totalIncomeElement = document.getElementById('total-income');
    const totalExpenseElement = document.getElementById('total-expense');
    const totalBalanceElement = document.getElementById('total-balance');
    const dayFilterBtn = document.getElementById('day-filter');
    const monthFilterBtn = document.getElementById('month-filter');
    const allFilterBtn = document.getElementById('all-filter');
    
    let currentFilter = 'all'; // 'day', 'month', 'all'
    
    // Initialize the app
    function init() {
        updateSummary();
        renderTransactions();
        setupEventListeners();
    }
    
    // Set up event listeners
    function setupEventListeners() {
        incomeBtn.addEventListener('click', () => addTransaction('income'));
        expenseBtn.addEventListener('click', () => addTransaction('expense'));
        
        dayFilterBtn.addEventListener('click', () => {
            currentFilter = 'day';
            updateActiveFilterButton();
            renderTransactions();
        });
        
        monthFilterBtn.addEventListener('click', () => {
            currentFilter = 'month';
            updateActiveFilterButton();
            renderTransactions();
        });
        
        allFilterBtn.addEventListener('click', () => {
            currentFilter = 'all';
            updateActiveFilterButton();
            renderTransactions();
        });
    }
    
    // Update active filter button style
    function updateActiveFilterButton() {
        dayFilterBtn.classList.remove('bg-primary-500', 'hover:bg-primary-600');
        dayFilterBtn.classList.add('bg-gray-700', 'hover:bg-gray-600');
        
        monthFilterBtn.classList.remove('bg-primary-500', 'hover:bg-primary-600');
        monthFilterBtn.classList.add('bg-gray-700', 'hover:bg-gray-600');
        
        allFilterBtn.classList.remove('bg-primary-500', 'hover:bg-primary-600');
        allFilterBtn.classList.add('bg-gray-700', 'hover:bg-gray-600');
        
        if (currentFilter === 'day') {
            dayFilterBtn.classList.add('bg-primary-500', 'hover:bg-primary-600');
            dayFilterBtn.classList.remove('bg-gray-700', 'hover:bg-gray-600');
        } else if (currentFilter === 'month') {
            monthFilterBtn.classList.add('bg-primary-500', 'hover:bg-primary-600');
            monthFilterBtn.classList.remove('bg-gray-700', 'hover:bg-gray-600');
        } else {
            allFilterBtn.classList.add('bg-primary-500', 'hover:bg-primary-600');
            allFilterBtn.classList.remove('bg-gray-700', 'hover:bg-gray-600');
        }
    }
    
    // Add a new transaction
    function addTransaction(type) {
        if (!transactionForm.checkValidity()) {
            transactionForm.reportValidity();
            return;
        }
        
        const transaction = {
            id: Date.now(),
            description: descriptionInput.value,
            amount: parseFloat(amountInput.value),
            date: dateInput.value,
            category: categoryInput.value,
            type: type
        };
        
        transactions.unshift(transaction);
        updateLocalStorage();
        updateSummary();
        renderTransactions();
        
        // Reset form
        descriptionInput.value = '';
        amountInput.value = '';
        dateInput.valueAsDate = new Date();
        categoryInput.value = 'food';
    }
    
    // Delete a transaction
    function deleteTransaction(id) {
        transactions = transactions.filter(transaction => transaction.id !== id);
        updateLocalStorage();
        updateSummary();
        renderTransactions();
    }
    
    // Update localStorage with current transactions
    function updateLocalStorage() {
        localStorage.setItem('transactions', JSON.stringify(transactions));
    }
    
    // Update summary cards
    function updateSummary() {
        const amounts = transactions.map(transaction => {
            return transaction.type === 'income' ? transaction.amount : -transaction.amount;
        });
        
        const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
        const income = amounts.filter(item => item > 0).reduce((acc, item) => (acc += item), 0).toFixed(2);
        const expense = amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0).toFixed(2);
        
        totalIncomeElement.textContent = `R$ ${income}`;
        totalExpenseElement.textContent = `R$ ${Math.abs(expense)}`;
        totalBalanceElement.textContent = `R$ ${total}`;
        
        // Update balance color based on value
        if (total > 0) {
            totalBalanceElement.classList.remove('text-red-400');
            totalBalanceElement.classList.add('text-green-400');
        } else if (total < 0) {
            totalBalanceElement.classList.remove('text-green-400');
            totalBalanceElement.classList.add('text-red-400');
        } else {
            totalBalanceElement.classList.remove('text-green-400', 'text-red-400');
        }
    }
    
    // Render transactions list
    function renderTransactions() {
        // Clear current transactions
        transactionsList.innerHTML = '';
        
        // Filter transactions based on current filter
        let filteredTransactions = [...transactions];
        
        const today = new Date().toISOString().split('T')[0];
        const currentMonth = new Date().toISOString().substring(0, 7);
        
        if (currentFilter === 'day') {
            filteredTransactions = filteredTransactions.filter(
                transaction => transaction.date === today
            );
        } else if (currentFilter === 'month') {
            filteredTransactions = filteredTransactions.filter(
                transaction => transaction.date.substring(0, 7) === currentMonth
            );
        }
        
        if (filteredTransactions.length === 0) {
            transactionsList.innerHTML = `
                <tr>
                    <td colspan="5" class="py-4 text-center text-gray-400">
                        Nenhuma transação encontrada
                    </td>
                </tr>
            `;
            return;
        }
        
        // Add filtered transactions to the list
        filteredTransactions.forEach(transaction => {
            const transactionElement = document.createElement('tr');
            transactionElement.className = 'transaction-item py-2';
            
            const categoryNames = {
                'food': 'Alimentação',
                'transport': 'Transporte',
                'housing': 'Moradia',
                'entertainment': 'Lazer',
                'health': 'Saúde',
                'education': 'Educação',
                'other': 'Outros'
            };
            
            transactionElement.innerHTML = `
                <td class="py-3">${transaction.description}</td>
                <td class="py-3">${categoryNames[transaction.category]}</td>
                <td class="py-3">${formatDate(transaction.date)}</td>
                <td class="py-3 text-right font-medium ${transaction.type === 'income' ? 'text-green-400' : 'text-red-400'}">
                    ${transaction.type === 'income' ? '+' : '-'} R$ ${transaction.amount.toFixed(2)}
                </td>
                <td class="py-3 text-right">
                    <button onclick="deleteTransaction(${transaction.id})" class="text-red-400 hover:text-red-300 p-1 rounded-full transition tooltip">
                        <i data-feather="trash-2" class="w-4 h-4"></i>
                        <span class="tooltip-text">Excluir</span>
                    </button>
                </td>
            `;
            
            transactionsList.appendChild(transactionElement);
        });
        
        feather.replace();
    }
    
    // Format date to dd/mm/yyyy
    function formatDate(dateString) {
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`;
    }
    
    // Make deleteTransaction available globally
    window.deleteTransaction = deleteTransaction;
    
    // Initialize the app
    init();
});
