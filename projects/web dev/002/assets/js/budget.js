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

    const CATEGORY_EMOJIS = {
        Education: '📚',
        Food: '🍔',
        Transport: '🚌',
        Housing: '🏠',
        Entertainment: '🎮',
        Other: '📦'
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
       
        if (elements.transactionForm) {
            elements.transactionForm.addEventListener('submit', handleAddTransaction);
        }
    }

    function loadTransactions() {
        const storedTransactions = Storage.get(STORAGE_KEY);
        transactions = storedTransactions || [];
    }

    function saveTransactions() {
        return Storage.set(STORAGE_KEY, transactions);
    }

    function handleAddTransaction(e) {
        e.preventDefault();

     
        if (!FormValidator.validate(elements.transactionForm)) {
            showToast('Please fill in all required fields', 'warning');
            return;
        }

        const type = document.querySelector('input[name="transactionType"]:checked').value;
        const description = document.getElementById('transactionDescription').value.trim();
        const amount = parseFloat(document.getElementById('transactionAmount').value);
        const category = document.getElementById('transactionCategory').value;

       
        if (!Validators.isValidNumber(amount) || amount <= 0) {
            showToast('Please enter a valid amount', 'error');
            return;
        }

        const submitBtn = elements.transactionForm.querySelector('button[type="submit"]');
        LoadingState.show(submitBtn);

        setTimeout(() => {
            const newTransaction = {
                id: IDGenerator.generate('transaction'),
                type: type,
                description: description,
                amount: amount,
                category: category,
                createdAt: DateUtils.getTimestamp()
            };

            transactions.unshift(newTransaction);

            if (saveTransactions()) {
                renderTransactions();
                updateBudgetSummary();
                updateOverview();

              
                elements.transactionForm.reset();
                FormValidator.clearValidation(elements.transactionForm);
                document.getElementById('incomeType').checked = true;

                const transactionType = type === 'income' ? 'Income' : 'Expense';
                showToast(`${transactionType} added: ${NumberUtils.formatCurrency(amount)}`, 'success');

                
                AnimationUtils.pulseElement(elements.totalIncome);
                AnimationUtils.pulseElement(elements.totalExpenses);
                AnimationUtils.pulseElement(elements.remainingBalance);
            }

            LoadingState.hide(submitBtn);
        }, 300);
    }

    function handleDeleteTransaction(transactionId) {
        const transaction = transactions.find(t => t.id === transactionId);
        if (!transaction) return;

        if (confirm(`Delete this transaction?\n${transaction.description} - ${NumberUtils.formatCurrency(transaction.amount)}`)) {
            const transactionElement = document.querySelector(`[data-transaction-id="${transactionId}"]`);

            if (transactionElement) {
                transactionElement.style.opacity = '0';
                transactionElement.style.transform = 'translateX(-20px)';

                setTimeout(() => {
                    transactions = transactions.filter(t => t.id !== transactionId);

                    if (saveTransactions()) {
                        renderTransactions();
                        updateBudgetSummary();
                        updateOverview();
                        showToast('Transaction deleted', 'info');
                    }
                }, 300);
            }
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
            if (percentage >= 100) {
                showToast('Warning: You have exceeded your budget!', 'warning', 5000);
            }
        } else if (percentage >= 70) {
            elements.budgetProgressBar.style.background = 'linear-gradient(90deg, var(--success) 0%, var(--warning) 50%, var(--danger) 100%)';
        } else {
            elements.budgetProgressBar.style.background = 'linear-gradient(90deg, var(--success) 0%, var(--warning) 50%, var(--danger) 100%)';
        }
    }

    function renderTransactions() {
        DOM.clearElement(elements.transactionList);

        if (transactions.length === 0) {
            const emptyState = DOM.createElement('div', ['empty-state']);
            emptyState.innerHTML = `
                <div class="empty-state-icon">
                    <i class="fas fa-receipt"></i>
                </div>
                <h4 class="empty-state-title">No transactions yet</h4>
                <p class="empty-state-description">Add your first transaction to start tracking</p>
            `;
            elements.transactionList.appendChild(emptyState);
            return;
        }

        const recentTransactions = transactions.slice(0, 20);

        recentTransactions.forEach((transaction, index) => {
            const transactionElement = createTransactionElement(transaction);
            transactionElement.style.animationDelay = `${index * 0.03}s`;
            transactionElement.classList.add('fade-in');
            elements.transactionList.appendChild(transactionElement);
        });

        if (transactions.length > 20) {
            const moreInfo = DOM.createElement('p', ['text-muted', 'text-center', 'mt-3']);
            moreInfo.innerHTML = `<small>Showing 20 of ${transactions.length} transactions</small>`;
            elements.transactionList.appendChild(moreInfo);
        }
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
        const emoji = CATEGORY_EMOJIS[transaction.category] || '📦';
        categoryBadge.textContent = `${emoji} ${transaction.category}`;

        const metaDiv = DOM.createElement('div', ['d-flex', 'align-items-center', 'gap-2']);
        const dateSpan = DOM.createElement('small', ['text-muted']);
        dateSpan.innerHTML = `<i class="fas fa-clock me-1"></i>${DateUtils.formatDate(transaction.createdAt)}`;

        const deleteBtn = DOM.createElement('button', ['transaction-delete'], {
            'aria-label': 'Delete transaction',
            'title': 'Delete transaction'
        });
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        deleteBtn.addEventListener('click', () => handleDeleteTransaction(transaction.id));

        metaDiv.appendChild(dateSpan);
        metaDiv.appendChild(deleteBtn);

        footerDiv.appendChild(categoryBadge);
        footerDiv.appendChild(metaDiv);

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
            showToast('No transactions to export', 'warning');
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

        showToast('Transactions exported successfully!', 'success');
    }

    function updateOverview() {
        if (window.StudentOrganizer && window.StudentOrganizer.updateOverview) {
            setTimeout(() => {
                window.StudentOrganizer.updateOverview();
            }, 100);
        }
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