document.addEventListener('DOMContentLoaded', function () {
    const descriptionInput = document.getElementById('description');
    const amountInput = document.getElementById('amount');
    const transactionTypeInput = document.getElementById('transaction-type');
    const addButton = document.getElementById('add-button');
    const transactionsList = document.getElementById('transactions');
    const totalIncomeElement = document.getElementById('total-income');
    const totalExpensesElement = document.getElementById('total-expenses');
    const balanceElement = document.getElementById('balance');
    const chartCanvas = document.getElementById('chart');
    const suggestedBadExpensesList = document.getElementById('bad-expenses');

    let totalIncome = 0;
    let totalExpenses = 0;
    let chart;

    addButton.addEventListener('click', addTransaction);

    function addTransaction() {
        const description = descriptionInput.value;
        const amount = parseFloat(amountInput.value);
        const transactionType = transactionTypeInput.value;

        if (description.trim() === '' || isNaN(amount)) {
            alert('Please enter valid data.');
            return;
        }

        // Create a new transaction item
        const transactionItem = createTransactionItem(description, amount, transactionType);

        // Add the transaction to the appropriate section
        transactionsList.appendChild(transactionItem);

        // Update analytics
        updateAnalytics(transactionType, amount);

        // Update pie chart
        updateChart();

        // Suggest bad expenses
        suggestBadExpenses(description);

        // Clear input fields
        clearInputFields();
    }

    function createTransactionItem(description, amount, transactionType) {
        const transactionItem = document.createElement('li');
        transactionItem.textContent = `${description} ($${amount.toFixed(2)})`;

        if (transactionType === 'income') {
            transactionItem.classList.add('income');
        } else {
            transactionItem.classList.add('expense');
        }

        return transactionItem;
    }

    function updateAnalytics(transactionType, amount) {
        if (transactionType === 'income') {
            totalIncome += amount;
        } else {
            totalExpenses += amount;
        }

        totalIncomeElement.textContent = totalIncome.toFixed(2);
        totalExpensesElement.textContent = totalExpenses.toFixed(2);

        const balance = totalIncome - totalExpenses;
        balanceElement.textContent = balance.toFixed(2);
    }

    function clearInputFields() {
        descriptionInput.value = '';
        amountInput.value = '';
    }

    function updateChart() {
        if (chart) {
            chart.destroy();
        }

        chart = new Chart(chartCanvas.getContext('2d'), {
            type: 'pie',
            data: {
                labels: ['Income', 'Expenses'],
                datasets: [{
                    data: [totalIncome, totalExpenses],
                    backgroundColor: ['#36A2EB', '#FF6384'],
                }],
            },
            options: {
                responsive: false,
            },
        });
    }

    function suggestBadExpenses(description) {
        const badKeywords = ['house', 'school', 'health', 'clothes', 'groceries'];
        const lowerCaseDescription = description.toLowerCase();

        const isBadExpense = badKeywords.some(keyword => lowerCaseDescription.includes(keyword));

        if (!isBadExpense) {
            const listItem = document.createElement('li');
            listItem.textContent = description;
            suggestedBadExpensesList.appendChild(listItem);
        }
    }

    // Initialize the pie chart
    updateChart();
});
