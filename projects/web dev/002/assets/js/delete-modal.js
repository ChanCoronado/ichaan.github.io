(function() {
    'use strict';
    
    let deleteTransactionModal;
    let pendingDeleteTransactionId = null;
    
    function initDeleteTransactionModal() {
        const modalElement = document.getElementById('deleteTransactionModal');
        if (modalElement) {
            deleteTransactionModal = new bootstrap.Modal(modalElement);
            
            const confirmBtn = document.getElementById('confirmDeleteTransaction');
            if (confirmBtn) {
                confirmBtn.addEventListener('click', handleConfirmDeleteTransaction);
            }
            
            modalElement.addEventListener('hidden.bs.modal', () => {
                pendingDeleteTransactionId = null;
            });
        }
    }
    
    function showDeleteTransactionModal(transactionId, transactionText) {
        pendingDeleteTransactionId = transactionId;
        const itemTextElement = document.getElementById('deleteTransactionItemText');
        if (itemTextElement) {
            itemTextElement.textContent = transactionText;
        }
        if (deleteTransactionModal) {
            deleteTransactionModal.show();
        }
    }
    
    function handleConfirmDeleteTransaction() {
        if (!pendingDeleteTransactionId) return;
        
        const transactionElement = document.querySelector(`[data-transaction-id="${pendingDeleteTransactionId}"]`);
        
        if (transactionElement) {
            transactionElement.style.opacity = '0';
            transactionElement.style.transform = 'translateX(-20px)';
            
            setTimeout(() => {
                let transactions = Storage.get('student_organizer_budget') || [];
                transactions = transactions.filter(t => t.id !== pendingDeleteTransactionId);
                
                if (Storage.set('student_organizer_budget', transactions)) {
                    if (window.BudgetModule && window.BudgetModule.init) {
                        setTimeout(() => {
                            window.BudgetModule.init();
                            if (window.StudentOrganizer && window.StudentOrganizer.updateOverview) {
                                window.StudentOrganizer.updateOverview();
                            }
                        }, 100);
                    }
                    showToast('Transaction deleted successfully', 'info');
                }
                
                pendingDeleteTransactionId = null;
            }, 300);
        }
        
        if (deleteTransactionModal) {
            deleteTransactionModal.hide();
        }
    }
    
    window.showDeleteTransactionModal = showDeleteTransactionModal;
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initDeleteTransactionModal);
    } else {
        initDeleteTransactionModal();
    }
})();