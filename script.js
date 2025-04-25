document.addEventListener('DOMContentLoaded', () => {
    const calculatorCard = document.querySelector('.calculator-card');
    const thingNameInput = document.getElementById('thingName');
    const thingCostInput = document.getElementById('thingCost');
    const itemCostInput = document.getElementById('itemCost');
    const itemNameInput = document.getElementById('itemName');
    const outputSection = document.getElementById('outputSection');
    const equivalentStackContainer = document.getElementById('equivalentStackContainer'); // Get the stack container
    const resetButton = document.getElementById('resetButton');

    const allInputs = [thingNameInput, thingCostInput, itemCostInput, itemNameInput];

    const MAX_STACK_ITEMS = 50; // Define the maximum number of items to show in the visual stack

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

    // Function to build and display the equivalent stack
    function displayEquivalentStack(numberOfItems, itemName) {
        // Clear previous stack
        equivalentStackContainer.innerHTML = '';

        if (numberOfItems <= 0) {
            return; // Don't display stack for zero or negative items
        }

        const itemsToDisplay = Math.min(numberOfItems, MAX_STACK_ITEMS);
        const remainingItems = numberOfItems - itemsToDisplay;

        // Create and append stack items
        for (let i = 0; i < itemsToDisplay; i++) {
            const stackItem = document.createElement('div');
            stackItem.classList.add('stack-item');
            // Add animation delay for staggered appearance
            stackItem.style.animationDelay = `${i * 0.03}s`; // Adjust delay for desired effect
            equivalentStackContainer.appendChild(stackItem);
        }

        // Add "plus more" text if there are remaining items
        if (remainingItems > 0) {
            const moreText = document.createElement('p');
            moreText.classList.add('stack-more-text');
            moreText.textContent = `+ ${remainingItems.toFixed(0)} more ${itemName}${remainingItems !== 1 ? 's' : ''}`;
            equivalentStackContainer.appendChild(moreText);
        }
    }


    // Function to perform the calculation and update the output
    function updateCalculation() {
        const thingName = thingNameInput.value.trim() || 'That Thing';
        const thingCost = parseFloat(thingCostInput.value);
        const itemCost = parseFloat(itemCostInput.value);
        const itemName = itemNameInput.value.trim() || 'Everyday Item';

        // Clear previous output and stack, hide with a slight delay
        outputSection.classList.remove('visible');
        outputSection.innerHTML = '';
        equivalentStackContainer.innerHTML = ''; // Clear the stack container

        if (isNaN(thingCost) || isNaN(itemCost) || itemCost <= 0 || thingCost < 0 || !isAnyInputFilled()) {
             outputSection.innerHTML = '<p class="placeholder">Enter details above to see the magic!</p>';
             setTimeout(() => { outputSection.classList.add('visible'); }, 50);
            return;
        }

        const equivalentItems = (thingCost / itemCost); // Calculate without toFixed initially for comparison

        // --- Engaging Element: Dynamic Message Based on Result ---
        let engagingMessage = '';
        const numberOfItems = equivalentItems; // Use the non-fixed number for comparisons

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
         resultNumber.textContent = equivalentItems.toFixed(1); // Display with one decimal


         const resultText2 = document.createElement('p');
        resultText2.classList.add('result-text');
        const itemText = `${itemName}${parseFloat(equivalentItems.toFixed(1)) !== 1 ? 's' : ''}`; // Pluralize based on displayed number
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

        // --- Display the Equivalent Stack ---
        displayEquivalentStack(Math.floor(numberOfItems), itemName); // Pass the floor to stack whole items


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
         equivalentStackContainer.innerHTML = ''; // Clear the stack container on reset
    }


    // Add event listeners for real-time updates
    allInputs.forEach(input => {
        input.addEventListener('input', () => {
            updateCardActiveState();
            updateItemCostPlaceholder(); // Only updates placeholder for itemCost
            updateCalculation();
        });
    });


    // Add event listener for the reset button
    resetButton.addEventListener('click', resetCalculator);


    // Initial updates
    updateItemCostPlaceholder();
    updateCardActiveState();
});
