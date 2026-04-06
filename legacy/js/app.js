document.addEventListener('DOMContentLoaded', () => {
    // UI Elements
    const dynamicArea = document.getElementById('dynamic-area');
    const typeCards = document.querySelectorAll('.type-card');
    const actionTabs = document.querySelectorAll('.action-tab');
    const toastContainer = document.getElementById('toast-container');
    
    // Application State Object (ES9 standard object)
    let state = {
        type: 'LENGTH',
        action: 'comparison'
    };

    // Dictionary mappings for Unit Types matching Backend Enums
    const unitsMap = {
        'LENGTH': ['INCH', 'FEET', 'YARDS', 'CENTIMETERS'],
        'WEIGHT': ['GRAM', 'KILOGRAM', 'POUND'],
        'TEMPERATURE': ['CELSIUS', 'FAHRENHEIT'],
        'VOLUME': ['LITRE', 'MILLILITRE', 'GALLON']
    };

    document.getElementById('logoutBtn')?.addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    });

    // Initialize UI
    renderDynamicView();
    populateUnits();
    loadMyHistory();

    // Event Listeners for Cards (Event Delegation & Objects)
    typeCards.forEach(card => card.addEventListener('click', (e) => {
        typeCards.forEach(c => c.classList.remove('selected'));
        e.currentTarget.classList.add('selected');
        state.type = e.currentTarget.dataset.type;
        populateUnits(); 
    }));

    // Event Listeners for Tabs
    actionTabs.forEach(tab => tab.addEventListener('click', (e) => {
        actionTabs.forEach(t => t.classList.remove('selected'));
        e.currentTarget.classList.add('selected');
        state.action = e.currentTarget.dataset.action;
        renderDynamicView();
        populateUnits();
    }));

    function showToast(message, isError = false) {
        const toast = document.createElement('div');
        toast.className = `toast ${isError ? 'error' : ''}`;
        toast.textContent = message;
        toastContainer.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    // Dynamic UI Rendering Function (DOM Manipulation & Templates)
    function renderDynamicView() {
        dynamicArea.innerHTML = '';
        const template = document.getElementById(`${state.action}-template`);
        if (template) {
            const clone = template.content.cloneNode(true);
            dynamicArea.appendChild(clone);
            bindDynamicListeners();
        }
    }

    function populateUnits() {
        const availableUnits = unitsMap[state.type] || [];
        const unitSelects = dynamicArea.querySelectorAll('select:not(#operator-select)');
        
        unitSelects.forEach(select => {
            const previousValue = select.value;
            select.innerHTML = '';
            
            availableUnits.forEach(unit => {
                const option = document.createElement('option');
                option.value = unit;
                option.textContent = unit.charAt(0) + unit.slice(1).toLowerCase();
                select.appendChild(option);
            });

            // Restore previous choice if valid
            if (availableUnits.includes(previousValue)) {
                select.value = previousValue;
            }
        });
    }

    function bindDynamicListeners() {
        // Bind explicit calculation buttons to prevent auto-saving
        const convertBtn = document.getElementById('convert-btn');
        if (convertBtn) convertBtn.addEventListener('click', runCalculation);

        const compareBtn = document.getElementById('compare-btn');
        if (compareBtn) compareBtn.addEventListener('click', runCalculation);

        const calcBtn = document.getElementById('calculate-btn');
        if (calcBtn) calcBtn.addEventListener('click', runCalculation);

        const opSelect = document.getElementById('operator-select');
        const rUEl = document.getElementById('arith-result-unit');
        if (opSelect && rUEl) {
            opSelect.addEventListener('change', () => {
                rUEl.style.display = opSelect.value === '/' ? 'none' : 'block';
            });
            rUEl.style.display = opSelect.value === '/' ? 'none' : 'block';
        }

        // Bind Clear Buttons
        const clearBtns = document.querySelectorAll('.clear-btn');
        clearBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const inputs = document.querySelectorAll('.dynamic-area input[type="number"]');
                inputs.forEach(input => input.value = '');
                
                // Clear any results displayed
                const compResult = document.getElementById('comp-final-result');
                if (compResult) compResult.textContent = '---';
                
                const convertResult = document.getElementById('convert-final-result');
                if (convertResult) convertResult.textContent = '---';
                
                const arithResult = document.getElementById('arith-final-result');
                if (arithResult) arithResult.textContent = '---';

                const compIcon = document.getElementById('compare-result-icon');
                if (compIcon) compIcon.textContent = '?';
            });
        });
    }

    // Async Fetch Execution for History
    async function loadMyHistory() {
        const historySection = document.getElementById('history-section');
        const historyList = document.getElementById('history-list');
        
        try {
            const history = await ApiService.getMyHistory();
            if (history && history.length > 0) {
                historyList.innerHTML = '';
                history.forEach(item => {
                    const row = document.createElement('div');
                    row.style.background = '#F6F9FF';
                    row.style.padding = '10px 15px';
                    row.style.borderRadius = '8px';
                    row.style.fontSize = '14px';
                    row.style.color = '#333';
                    row.style.display = 'flex';
                    row.style.justifyContent = 'space-between';
                    row.style.borderLeft = '4px solid var(--primary-blue)';

                    let text = '';
                    if (item.operation === 'COMPARE') {
                        text = `Compared ${item.thisUnit} and ${item.thatUnit} ➔ ${item.resultString === 'True' ? 'Equal' : 'Not Equal'}`;
                    } else if (item.operation === 'CONVERT') {
                        text = `Converted ${item.thisUnit} to ${item.resultUnit} ➔ ${item.resultString}`;
                    } else if (item.operation === 'DIVIDE') {
                        text = `Divided ${item.thisUnit} by ${item.thatUnit} ➔ Ratio: ${item.resultString}`;
                    } else {
                        text = `${item.operation} ${item.thisUnit} and ${item.thatUnit} ➔ ${item.resultString} ${item.resultUnit}`;
                    }

                    if (item.isError) {
                        row.style.borderLeftColor = 'var(--error)';
                        text = `[Error] ${item.operation}: ${item.errorMessage}`;
                    }

                    row.innerHTML = `<span style="font-weight: 500;">${text}</span><span style="font-size: 12px; color: #888;">${item.thisMeasurementType}</span>`;
                    historyList.appendChild(row);
                });
            } else {
                historyList.innerHTML = '<div style="font-size: 13px; color: #7CA1F3; text-align: center;">No history available yet.</div>';
            }
            historySection.style.display = 'block';
        } catch (error) {
            console.error("Could not load history", error);
            historySection.style.display = 'none';
        }
    }

    // Async Fetch Execution with Promise Resolving
    async function runCalculation() {
        let activeBtn = null;
        if (state.action === 'conversion') activeBtn = document.getElementById('convert-btn');
        else if (state.action === 'comparison') activeBtn = document.getElementById('compare-btn');
        else if (state.action === 'arithmetic') activeBtn = document.getElementById('calculate-btn');

        let originalText = '';
        if (activeBtn) {
            if (activeBtn.disabled) return; // Prevent double clicks
            originalText = activeBtn.textContent;
            activeBtn.disabled = true;
            activeBtn.style.opacity = '0.7';
            activeBtn.textContent = 'Processing...';
        }

        try {
            if (state.action === 'conversion') {
                const val = parseFloat(document.getElementById('from-value').value);
                const fromU = document.getElementById('from-unit').value;
                const toU = document.getElementById('to-unit').value;
                
                if (isNaN(val)) return;
                
                // Using ApiService (AJAX Callbacks)
                const resp = await ApiService.convert(val, fromU, toU, state.type);
                document.getElementById('to-value').value = resp.resultValue;

            } else if (state.action === 'comparison') {
                const v1 = parseFloat(document.getElementById('comp-value1').value);
                const u1 = document.getElementById('comp-unit1').value;
                const v2 = parseFloat(document.getElementById('comp-value2').value);
                const u2 = document.getElementById('comp-unit2').value;

                if (isNaN(v1) || isNaN(v2)) return;

                const resp = await ApiService.compare(v1, u1, v2, u2, state.type);
                const isEq = resp.resultString.toLowerCase() === 'true';
                
                document.getElementById('compare-result-icon').textContent = isEq ? '=' : '≠';
                document.getElementById('comp-final-result').textContent = isEq ? 'Equal' : 'Not Equal';
                document.getElementById('comp-final-result').style.color = isEq ? 'var(--success)' : '#e74c3c';

            } else if (state.action === 'arithmetic') {
                const v1 = parseFloat(document.getElementById('arith-value1').value);
                const u1 = document.getElementById('arith-unit1').value;
                const v2 = parseFloat(document.getElementById('arith-value2').value);
                const u2 = document.getElementById('arith-unit2').value;
                const op = document.getElementById('operator-select').value;
                const rUEl = document.getElementById('arith-result-unit');
                const rU = rUEl.value;

                if (isNaN(v1) || isNaN(v2)) return;

                if (op === '/') {
                    rUEl.style.display = 'none';
                } else {
                    rUEl.style.display = 'block';
                }

                const resp = await ApiService.arithmetic(v1, u1, v2, u2, state.type, rU, op);
                document.getElementById('arith-final-result').textContent = resp.resultValue;
            }
        } catch (error) {
            showToast(error.message, true);
        } finally {
            if (activeBtn) {
                activeBtn.disabled = false;
                activeBtn.style.opacity = '1';
                activeBtn.textContent = originalText;
            }
            loadMyHistory();
        }
    }
});
