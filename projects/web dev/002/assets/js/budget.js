const BudgetModule = (() => {

    const STORAGE_KEY = 'student_organizer_budget';
    let transactions = [];


    const elements = {
        transactionForm: null,
        transactionList: null,
        totalIncome: null,
        totalExpenses: null,
        remainingBalance: null,
        budgetPercentage: null,
        budgetProgressBar: null
    };


    const CATEGORY_COLORS = {
        education: 'primary',
        food: 'success',
        transport: 'info',
        housing: 'warning',
        entertainment: 'danger',
        other: 'secondary'
    };

    function init() {

        elements.transactionForm = document.getElementById('transactionForm');
        elements.transactionList = document.getElementById('transactionList');
        elements.totalIncome = document.getElementById('totalIncome');
        elements.totalExpenses = document.getElementById('totalExpenses');
        elements.remainingBalance = document.getElementById('remainingBalance');
        elements.budgetPercentage = document.getElementById('budgetPercentage');
        elements.budgetProgressBar = document.getElementById('budgetProgressBar');

      
        loadTransactions();

 
        attachEventListeners();

       
        renderTransactions();
        updateBudgetSummary();
    }


    function attachEventListeners() {
        
        elements.transactionForm.addEventListener('submit', handleAddTransaction);
    }

    function loadTransactions() {
        const storedTransactions = Storage.get(STORAGE_KEY);
        transactions = storedTransactions || [];
    }

    function saveTransactions() {
        Storage.set(STORAGE_KEY, transactions);
    }

    function handleAddTransaction(e) {
        e.preventDefault();

    
        const type = document.querySelector('input[name="transactionType"]:checked').value;
        const description = document.getElementById('transactionDescription').value.trim();
        const amount = parseFloat(document.getElementById('transactionAmount').value);
        const category = document.getElementById('transactionCategory').value;

      
        if (Validators.isEmpty(description)) {
            alert('Please enter a description');
            return;
        }

        if (!Validators.isValidNumber(amount) || amount <= 0) {
            alert('Please enter a valid amount');
            return;
        }

        if (!category) {
            alert('Please select a category');
            return;
        }

        
        const newTransaction = {
            id: IDGenerator.generate('transaction'),
            type: type,
            description: description,
            amount: amount,
            category: category,
            createdAt: DateUtils.getTimestamp()
        };

   
        transactions.unshift(newTransaction);

    
        saveTransactions();
        renderTransactions();
        updateBudgetSummary();
        
 
        if (window.StudentOrganizer && window.StudentOrganizer.updateOverview) {
            setTimeout(() => {
                window.StudentOrganizer.updateOverview();
            }, 100);
        }

       
        elements.transactionForm.reset();
        
       
        document.getElementById('incomeType').checked = true;

     
        AnimationUtils.pulseElement(elements.totalIncome);
        AnimationUtils.pulseElement(elements.totalExpenses);
        AnimationUtils.pulseElement(elements.remainingBalance);
    }

    function handleDeleteTransaction(transactionId) {
        if (!confirm('Are you sure you want to delete this transaction?')) {
            return;
        }

        const transactionElement = document.querySelector(`[data-transaction-id="${transactionId}"]`);
        
        if (transactionElement) {
       
            transactionElement.style.opacity = '0';
            transactionElement.style.transform = 'translateX(-20px)';
            
            setTimeout(() => {
                transactions = transactions.filter(t => t.id !== transactionId);
                saveTransactions();
                renderTransactions();
                updateBudgetSummary();
                
           
                if (window.StudentOrganizer && window.StudentOrganizer.updateOverview) {
                    window.StudentOrganizer.updateOverview();
                }
            }, 300);
        }
    }

    function calculateTotals() {
        const income = transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const expenses = transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        const balance = income - expenses;

        return { income, expenses, balance };
    }

    function updateBudgetSummary() {
        const { income, expenses, balance } = calculateTotals();

      
        const currentIncome = NumberUtils.parseCurrency(elements.totalIncome.textContent);
        const currentExpenses = NumberUtils.parseCurrency(elements.totalExpenses.textContent);
        const currentBalance = NumberUtils.parseCurrency(elements.remainingBalance.textContent);

        AnimationUtils.animateCounter(elements.totalIncome, currentIncome, income, 800);
        AnimationUtils.animateCounter(elements.totalExpenses, currentExpenses, expenses, 800);
        AnimationUtils.animateCounter(elements.remainingBalance, currentBalance, balance, 800);

      
        if (balance < 0) {
            elements.remainingBalance.classList.add('negative');
        } else {
            elements.remainingBalance.classList.remove('negative');
        }

     
        let percentage = 0;
        if (income > 0) {
            percentage = (expenses / income) * 100;
        }
        
        elements.budgetPercentage.textContent = NumberUtils.formatPercentage(expenses, income);
        AnimationUtils.animateProgressBar(elements.budgetProgressBar, percentage);
        
       
        if (percentage >= 90) {
            elements.budgetProgressBar.style.background = 'var(--danger)';
        } else if (percentage >= 70) {
            elements.budgetProgressBar.style.background = 'linear-gradient(90deg, var(--success) 0%, var(--warning) 50%, var(--danger) 100%)';
        } else {
            elements.budgetProgressBar.style.background = 'linear-gradient(90deg, var(--success) 0%, var(--warning) 50%, var(--danger) 100%)';
        }
    }

  
    function renderTransactions() {
      
        DOM.clearElement(elements.transactionList);

    
        if (transactions.length === 0) {
            const emptyMessage = DOM.createElement('p', ['text-muted', 'text-center', 'py-4']);
            emptyMessage.textContent = 'No transactions yet';
            elements.transactionList.appendChild(emptyMessage);
            return;
        }

        const recentTransactions = transactions.slice(0, 10);
        
        recentTransactions.forEach(transaction => {
            const transactionElement = createTransactionElement(transaction);
            elements.transactionList.appendChild(transactionElement);
        });
    }

    function createTransactionElement(transaction) {
        
        const transactionItem = DOM.createElement('div', ['transaction-item', transaction.type], {
            'data-transaction-id': transaction.id
        });

    
        const headerDiv = DOM.createElement('div', ['transaction-header']);

        const descDiv = DOM.createElement('div', ['transaction-desc']);
        descDiv.textContent = transaction.description;

      
        const amountDiv = DOM.createElement('div', ['transaction-amount', transaction.type]);
        const sign = transaction.type === 'income' ? '+' : '-';
        amountDiv.textContent = `${sign}${NumberUtils.formatCurrency(transaction.amount)}`;

        headerDiv.appendChild(descDiv);
        headerDiv.appendChild(amountDiv);

       
        const footerDiv = DOM.createElement('div', ['transaction-footer']);

    
        const categoryBadge = DOM.createElement('span', ['transaction-category']);
        categoryBadge.textContent = transaction.category;

       
        const deleteBtn = DOM.createElement('button', ['transaction-delete'], {
            'aria-label': 'Delete transaction'
        });
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        deleteBtn.addEventListener('click', () => handleDeleteTransaction(transaction.id));

        footerDiv.appendChild(categoryBadge);
        footerDiv.appendChild(deleteBtn);

   
        transactionItem.appendChild(headerDiv);
        transactionItem.appendChild(footerDiv);

        return transactionItem;
    }

    
    function getTransactions() {
        return transactions;
    }

    function getStats() {
        const { income, expenses, balance } = calculateTotals();
        
  
        const byCategory = {};
        transactions
            .filter(t => t.type === 'expense')
            .forEach(t => {
                if (!byCategory[t.category]) {
                    byCategory[t.category] = 0;
                }
                byCategory[t.category] += t.amount;
            });

        return {
            income,
            expenses,
            balance,
            transactionCount: transactions.length,
            byCategory
        };
    }

    
    function exportToCSV() {
        if (transactions.length === 0) {
            alert('No transactions to export');
            return;
        }

     
        let csvContent = 'Type,Description,Amount,Category,Date\n';
        
        transactions.forEach(t => {
            const date = DateUtils.formatDate(t.createdAt);
            csvContent += `${t.type},${t.description},${t.amount},${t.category},${date}\n`;
        });


        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `budget_transactions_${Date.now()}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    }

   
    return {
        init,
        getTransactions,
        getStats,
        exportToCSV
    };
})();


if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', BudgetModule.init);
} else {
    BudgetModule.init();
}


window.BudgetModule = BudgetModule;