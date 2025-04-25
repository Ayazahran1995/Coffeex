document.addEventListener('DOMContentLoaded', () => {
    const calculatorCard = document.querySelector('.calculator-card'); // Get the calculator card
    const thingNameInput = document.getElementById('thingName');
    const thingCostInput = document.getElementById('thingCost');
    const itemCostInput = document.getElementById('itemCost');
    const itemNameInput = document.getElementById('itemName');
    const outputSection = document.getElementById('outputSection');
    const resetButton = document.getElementById('resetButton');

    const allInputs = [thingNameInput, thingCostInput, itemCostInput, itemNameInput]; // Group inputs

    // Function to update the item cost input placeholder
    function updateItemCostPlaceholder() {
        const itemName = itemNameInput.value.trim() || 'Item';
        itemCostInput.placeholder = `e.g., 3.50 (Cost of one ${itemName})`;
    }

    // Function to check if any input has content
    function isAnyInputFilled() {
        return allInputs.some(input => input.value.trim() !== '');
    }

    // Function to update the calculator card's active state (for glow)
    function updateCardActiveState() {
        if (isAnyInputFilled()) {
            calculatorCard.classList.add('active');
        } else {
            calculatorCard.classList.remove('active');
        }
    }


    // Function to perform the calculation and update the output
    function updateCalculation() {
        const thingName = thingNameInput.value.trim() || 'That Thing';
        const thingCost = parseFloat(thingCostInput.value);
        const itemCost = parseFloat(itemCostInput.value);
        const itemName = itemNameInput.value.trim() || 'Everyday Item';

        // Clear previous output and hide with a slight delay for re-triggering animation
        outputSection.classList.remove('visible');
        outputSection.innerHTML = ''; // Clear content immediately

        if (isNaN(thingCost) || isNaN(itemCost) || itemCost <= 0 || thingCost < 0 || !isAnyInputFilled()) {
            // Display a placeholder if inputs are invalid or none are filled
             outputSection.innerHTML = '<p class="placeholder">Enter details above to see the magic!</p>';
             setTimeout(() => { outputSection.classList.add('visible'); }, 50);
            return;
        }

        const equivalentItems = (thingCost / itemCost).toFixed(1);

        // --- Engaging Element: Dynamic Message Based on Result ---
        let engagingMessage = '';
        const numberOfItems = parseFloat(equivalentItems);

        if (numberOfItems >= 100) {
            engagingMessage = 'Wow, that\'s a lot!';
        } else if (numberOfItems >= 50) {
             engagingMessage = 'Quite a few!';
        } else if (numberOfItems > 0 && numberOfItems < 1) {
             engagingMessage = 'Less than one whole one!';
        }


        // Create and add the output elements
        const resultText1 = document.createElement('p');
        resultText1.classList.add('result-text');
        resultText1.textContent = `Getting ${thingName} is equivalent to:`;

        const resultNumber = document.createElement('span');
        resultNumber.classList.add('result-number');
        resultNumber.textContent = equivalentItems;

         const resultText2 = document.createElement('p');
        resultText2.classList.add('result-text');
        const itemText = `${itemName}${parseFloat(equivalentItems) !== 1 ? 's' : ''}`;
        resultText2.textContent = itemText;

        // Add the engaging message if it exists
        if (engagingMessage) {
            const messageElement = document.createElement('p');
            messageElement.classList.add('result-text', 'engaging-message');
            messageElement.textContent = engagingMessage;
            outputSection.appendChild(messageElement);
        }

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

        // Update card active state after resetting inputs
        updateCardActiveState();

        // Reset placeholder and output
        updateItemCostPlaceholder();
        outputSection.classList.remove('visible');
         outputSection.innerHTML = '<p class="placeholder">Enter details above to see the magic!</p>';
    }


    // Add event listeners for real-time updates
    allInputs.forEach(input => {
        input.addEventListener('input', () => {
            updateCardActiveState(); // Update card state on any input
            updateItemCostPlaceholder(); // Only needed for itemCost input, but safe here
            updateCalculation();
        });
    });


    // Add event listener for the reset button
    resetButton.addEventListener('click', resetCalculator);


    // Initial updates
    updateItemCostPlaceholder();
    updateCardActiveState(); // Set initial card state based on empty inputs
    // updateCalculation(); // Start with placeholder, calculation runs on input
});
