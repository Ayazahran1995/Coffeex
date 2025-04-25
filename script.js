document.addEventListener('DOMContentLoaded', () => {
    const thingNameInput = document.getElementById('thingName'); // New input
    const thingCostInput = document.getElementById('thingCost');
    const itemCostInput = document.getElementById('itemCost');
    const itemNameInput = document.getElementById('itemName');
    const outputSection = document.getElementById('outputSection');
    const resetButton = document.getElementById('resetButton'); // New button

    // Function to update the item cost input placeholder
    function updateItemCostPlaceholder() {
        const itemName = itemNameInput.value.trim() || 'Item';
        itemCostInput.placeholder = `e.g., 3.50 (Cost of one ${itemName})`;
    }

    // Function to perform the calculation and update the output
    function updateCalculation() {
        const thingName = thingNameInput.value.trim() || 'That Thing'; // Get thing name
        const thingCost = parseFloat(thingCostInput.value);
        const itemCost = parseFloat(itemCostInput.value);
        const itemName = itemNameInput.value.trim() || 'Everyday Item';

        // Clear previous output and hide
        outputSection.innerHTML = '';
        outputSection.classList.remove('visible');


        if (isNaN(thingCost) || isNaN(itemCost) || itemCost <= 0 || thingCost < 0) {
            // Display a placeholder or error message if inputs are invalid
             outputSection.innerHTML = '<p class="placeholder">Enter valid numbers for costs.</p>';
             setTimeout(() => { outputSection.classList.add('visible'); }, 50);
            return;
        }

        const equivalentItems = (thingCost / itemCost).toFixed(1);

        // Create and add the output elements
        const resultText1 = document.createElement('p');
        resultText1.classList.add('result-text');
        // Incorporate the thing name into the text
        resultText1.textContent = `Getting ${thingName} is equivalent to:`;

        const resultNumber = document.createElement('span');
        resultNumber.classList.add('result-number');
        resultNumber.textContent = equivalentItems;

         const resultText2 = document.createElement('p');
        resultText2.classList.add('result-text');
        // Handle pluralization
        const itemText = `${itemName}${parseFloat(equivalentItems) !== 1 ? 's' : ''}`;
        resultText2.textContent = itemText;


        outputSection.appendChild(resultText1);
        outputSection.appendChild(resultNumber);
        outputSection.appendChild(resultText2);


        // Make output visible with animation
         setTimeout(() => { outputSection.classList.add('visible'); }, 50);
    }

    // Function to reset all inputs and output
    function resetCalculator() {
        thingNameInput.value = '';
        thingCostInput.value = '';
        itemCostInput.value = '';
        itemNameInput.value = '';

        // Reset placeholder and output
        updateItemCostPlaceholder();
        outputSection.innerHTML = '<p class="placeholder">Enter details above to see the magic!</p>';
        outputSection.classList.remove('visible'); // Hide output after reset

        // Optionally, recalculate after reset (will show placeholder)
        updateCalculation();
    }


    // Add event listeners for real-time updates
    thingNameInput.addEventListener('input', updateCalculation); // Listen to thing name changes
    thingCostInput.addEventListener('input', updateCalculation);
    itemCostInput.addEventListener('input', updateCalculation);
    itemNameInput.addEventListener('input', () => {
        updateItemCostPlaceholder();
        updateCalculation();
    });

    // Add event listener for the reset button
    resetButton.addEventListener('click', resetCalculator);


    // Initial updates
    updateItemCostPlaceholder();
    updateCalculation(); // Perform initial calculation (will show placeholder if inputs are empty)
});
