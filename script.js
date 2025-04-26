document.addEventListener('DOMContentLoaded', () => {
    const calculatorCard = document.querySelector('.container.calculator-card');
    const thingNameInput = document.getElementById('thingName');
    const thingCostInput = document.getElementById('thingCost');
    const itemCostInput = document.getElementById('itemCost');
    const itemNameInput = document.getElementById('itemName');
    const outputSection = document.getElementById('outputSection');
    // Removed references to visual bar elements: fillBar, visualRepresentation, visualValueText
    const resetButton = document.getElementById('resetButton');

    const allInputs = [thingNameInput, thingCostInput, itemCostInput, itemNameInput];

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

    // Function to animate the number counting up
    function animateNumber(element, targetValue, duration = 500) {
        const startValue = 0;
        const startTime = performance.now();

        function updateNumber(currentTime) {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            const currentValue = startValue + (targetValue - startValue) * progress;

            // Format the number to one decimal place
            element.textContent = currentValue.toFixed(1);

            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            }
        }

        requestAnimationFrame(updateNumber);
    }


    // Function to perform the calculation and update the output
    function updateCalculation() {
        const thingName = thingNameInput.value.trim() || 'That Thing';
        const thingCost = parseFloat(thingCostInput.value);
        const itemCost = parseFloat(itemCostInput.value);
        const itemName = itemNameInput.value.trim() || 'Everyday Item';

        // Clear previous output and hide with a slight delay
        outputSection.classList.remove('visible');
        outputSection.innerHTML = '';

        // Removed calls to updateVisualFill

        if (isNaN(thingCost) || isNaN(itemCost) || itemCost <= 0 || thingCost < 0 || !isAnyInputFilled()) {
             outputSection.innerHTML = '<p class="placeholder">Enter details above to see the magic!</p>';
             setTimeout(() => { outputSection.classList.add('visible'); }, 50);
            return;
        }

        const equivalentItems = (thingCost / itemCost);


        // --- Create and Add Output Elements with Value Box ---
        const resultText1 = document.createElement('p');
        resultText1.classList.add('result-text');
        resultText1.textContent = `Getting ${thingName} is equivalent to:`;

        // Create the value box container
        const valueBox = document.createElement('div');
        valueBox.classList.add('value-box');

        // Create the number element inside the value box
        const resultNumberSpan = document.createElement('span');
        resultNumberSpan.classList.add('result-number');
         // Set initial text to 0 for animation
        resultNumberSpan.textContent = '0.0';


         const resultText2 = document.createElement('p');
        resultText2.classList.add('result-text');
        const itemText = `${itemName}${parseFloat(equivalentItems.toFixed(1)) !== 1 ? 's' : ''}`;
        resultText2.textContent = itemText;


        // Append elements to the output section
        outputSection.appendChild(resultText1);
        valueBox.appendChild(resultNumberSpan); // Append number span to the box
        outputSection.appendChild(valueBox); // Append the box to the output section
        outputSection.appendChild(resultText2);


        // --- Engaging Element: Dynamic Message Based on Result ---
        let engagingMessage = '';
        const numberOfItems = equivalentItems;

        if (numberOfItems >= 100) {
            engagingMessage = 'Wow, that\'s a lot!';
        } else if (numberOfItems >= 50) {
             engagingMessage = 'Quite a few!';
        } else if (numberOfItems > 0 && numberOfItems < 1) {
             engagingMessage = 'Less than one whole one!';
        }

        // Add the engaging message if it exists
        if (engagingMessage) {
            const messageElement = document.createElement('p');
            messageElement.classList.add('result-text', 'engaging-message');
            messageElement.textContent = engagingMessage;
            outputSection.appendChild(messageElement);
        }


        // Make output visible with animation
         setTimeout(() => {
             outputSection.classList.add('visible');
             // --- Trigger Number Animation ---
             animateNumber(resultNumberSpan, equivalentItems); // Animate the number in the box
         }, 50);
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

         // Removed call to updateVisualFill
    }


    // Add event listeners for real-time updates
    allInputs.forEach(input => {
        input.addEventListener('input', () => {
            updateCardActiveState();
            updateItemCostPlaceholder();
            updateCalculation();
        });
    });


    // Add event listener for the reset button
    resetButton.addEventListener('click', resetCalculator);


    // Initial updates
    updateItemCostPlaceholder();
    updateCardActiveState();
    // Removed initial call to updateVisualFill
});
document.addEventListener('DOMContentLoaded', () => {
    // Keep your existing code and add the following
    
    const addComparisonButton = document.getElementById('addComparisonButton');
    const comparisonItemsContainer = document.getElementById('comparisonItems');
    let comparisonCount = 1;
    
    // Function to add a new comparison item
    function addComparisonItem() {
        comparisonCount++;
        const newItem = document.createElement('div');
        newItem.classList.add('comparison-item');
        newItem.innerHTML = `
            <div class="input-group">
                <label for="compareItemName${comparisonCount}">Comparison Item ${comparisonCount}:</label>
                <input type="text" id="compareItemName${comparisonCount}" placeholder="e.g., Bus Ticket">
            </div>
            <div class="input-group">
                <label for="compareItemCost${comparisonCount}">Cost ($):</label>
                <input type="number" id="compareItemCost${comparisonCount}" placeholder="e.g., 2.50" min="0">
            </div>
            <button class="remove-button">×</button>
        `;
        
        comparisonItemsContainer.appendChild(newItem);
        
        // Add event listener to the remove button
        const removeButton = newItem.querySelector('.remove-button');
        removeButton.addEventListener('click', () => {
            comparisonItemsContainer.removeChild(newItem);
            updateCalculation();
        });
        
        // Add event listeners to new inputs
        const newInputs = newItem.querySelectorAll('input');
        newInputs.forEach(input => {
            input.addEventListener('input', updateCalculation);
        });
    }
    
    // Add event listener to the add comparison button
    addComparisonButton.addEventListener('click', addComparisonItem);
    
    // Modify the updateCalculation function to handle multiple comparisons
    function updateCalculation() {
        const thingName = thingNameInput.value.trim() || 'That Thing';
        const thingCost = parseFloat(thingCostInput.value);
        
        // Clear previous output and hide with a slight delay
        outputSection.classList.remove('visible');
        outputSection.innerHTML = '';
        
        if (isNaN(thingCost) || thingCost < 0 || !isAnyInputFilled()) {
            outputSection.innerHTML = '<p class="placeholder">Enter details above to see the magic!</p>';
            setTimeout(() => { outputSection.classList.add('visible'); }, 50);
            return;
        }
        
        // Add the main result text
        const resultText1 = document.createElement('p');
        resultText1.classList.add('result-text');
        resultText1.textContent = `${thingName} ($${thingCost.toFixed(2)}) is equivalent to:`;
        outputSection.appendChild(resultText1);
        
        // Create comparison results container
        const comparisonResults = document.createElement('div');
        comparisonResults.classList.add('comparison-results');
        
        // Process the primary comparison (if filled)
        const itemName = itemNameInput.value.trim();
        const itemCost = parseFloat(itemCostInput.value);
        
        if (itemName && !isNaN(itemCost) && itemCost > 0) {
            const equivalentItems = thingCost / itemCost;
            const resultCard = createComparisonCard(itemName, equivalentItems);
            comparisonResults.appendChild(resultCard);
        }
        
        // Process additional comparisons
        const comparisonItems = document.querySelectorAll('.comparison-item');
        comparisonItems.forEach((item, index) => {
            if (index === 0 && comparisonCount === 1) return; // Skip the template item if it's the only one
            
            const nameInput = item.querySelector('input[type="text"]');
            const costInput = item.querySelector('input[type="number"]');
            
            if (nameInput && costInput) {
                const name = nameInput.value.trim();
                const cost = parseFloat(costInput.value);
                
                if (name && !isNaN(cost) && cost > 0) {
                    const equivalentItems = thingCost / cost;
                    const resultCard = createComparisonCard(name, equivalentItems);
                    comparisonResults.appendChild(resultCard);
                }
            }
        });
        
        // Add comparison results to output section
        if (comparisonResults.children.length > 0) {
            outputSection.appendChild(comparisonResults);
        } else {
            const placeholder = document.createElement('p');
            placeholder.classList.add('placeholder');
            placeholder.textContent = 'Add comparison items to see equivalents';
            outputSection.appendChild(placeholder);
        }
        
        // Make output visible with animation
        setTimeout(() => {
            outputSection.classList.add('visible');
        }, 50);
    }
    
    // Helper function to create comparison result cards
    function createComparisonCard(itemName, count) {
        const card = document.createElement('div');
        card.classList.add('comparison-result-card');
        
        const nameElement = document.createElement('div');
        nameElement.classList.add('item-name');
        nameElement.textContent = itemName;
        
        const countElement = document.createElement('div');
        countElement.classList.add('item-count');
        countElement.textContent = count.toFixed(1);
        
        const unitText = document.createElement('div');
        unitText.textContent = parseFloat(count.toFixed(1)) !== 1 ? `${itemName}s` : itemName;
        
        card.appendChild(nameElement);
        card.appendChild(countElement);
        card.appendChild(unitText);
        
        return card;
    }
    
    // Add the first comparison item's inputs to the allInputs array
    const firstComparisonInputs = document.querySelectorAll('#comparisonItems .comparison-item:first-child input');
    firstComparisonInputs.forEach(input => {
        allInputs.push(input);
        input.addEventListener('input', updateCalculation);
    });
});
function resetCalculator() {
    thingNameInput.value = '';
    thingCostInput.value = '';
    itemNameInput.value = '';
    itemCostInput.value = '';
    
    // Reset comparison items
    const comparisonItems = document.querySelectorAll('.comparison-item');
    comparisonItems.forEach((item, index) => {
        // Keep the first item but clear its values
        if (index === 0) {
            const inputs = item.querySelectorAll('input');
            inputs.forEach(input => {
                input.value = '';
            });
        } else {
            // Remove additional items
            comparisonItemsContainer.removeChild(item);
        }
    });
    comparisonCount = 1;
    
    // Update card active state after resetting inputs
    updateCardActiveState();
    
    // Reset placeholder and output
    updateItemCostPlaceholder();
    outputSection.classList.remove('visible');
    outputSection.innerHTML = '<p class="placeholder">Enter details above to see the magic!</p>';
}
