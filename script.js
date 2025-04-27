document.addEventListener('DOMContentLoaded', () => {
    // --- Original Calculator Elements ---
    const calculatorCard = document.querySelector('.container.calculator-card');
    const thingNameInput = document.getElementById('thingName');
    const thingCostInput = document.getElementById('thingCost');
    const itemNameInput = document.getElementById('itemName');
    const itemCostInput = document.getElementById('itemCost');
    const outputSection = document.getElementById('outputSection');
    const resetButton = document.getElementById('resetButton');

    // --- New Comparison Elements ---
    const comparisonSection = document.querySelector('.comparison-section'); // Use class selector
    const addComparisonButton = document.getElementById('addComparisonButton');
    const comparisonItemsContainer = document.getElementById('comparisonItemsContainer'); // Corrected ID
    const comparisonResults = document.getElementById('comparisonResults');

    // --- Keep track of all relevant inputs for active state and calculations ---
    const allInputs = [thingNameInput, thingCostInput, itemCostInput, itemNameInput];

    // --- Keep track of dynamically added comparison input pairs ---
    const comparisonInputs = [];
    let comparisonCounter = 0; // To give unique IDs to new comparison items

    // --- Constants ---
    const NUMBER_ANIMATION_DURATION = 500; // Duration for the number counting animation

    // --- Helper Functions ---

    // Function to update the item cost input placeholder
    function updateItemCostPlaceholder() {
        const itemName = itemNameInput.value.trim() || 'Item';
        itemCostInput.placeholder = `e.g., 3.50 (Cost of one ${itemName})`;
    }

    // Function to check if any tracked input has content
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
    function animateNumber(element, targetValue, duration = NUMBER_ANIMATION_DURATION) {
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

    // Function to create a comparison result card
    function createComparisonCard(itemName, count) {
        const card = document.createElement('div');
        card.classList.add('comparison-result-card'); // Use a class for styling

        // Use a helper function to choose an emoji (optional engaging element)
        const emoji = chooseEmoji(itemName.toLowerCase());

        const iconDiv = document.createElement('div');
        iconDiv.className = 'item-icon';
        iconDiv.textContent = emoji;

        const nameDiv = document.createElement('div');
        nameDiv.className = 'item-name';
        nameDiv.textContent = itemName;

        const valueDiv = document.createElement('div');
        valueDiv.className = 'item-value';
        valueDiv.textContent = count.toFixed(1); // Display count with one decimal

        const unitText = document.createElement('div');
        unitText.className = 'item-unit'; // Add a class for styling
        const plural = parseFloat(count.toFixed(1)) !== 1 ? 's' : '';
        unitText.textContent = `${itemName}${plural}`;

        card.appendChild(iconDiv);
        card.appendChild(nameDiv);
        card.appendChild(valueDiv);
        card.appendChild(unitText); // Append the unit text

        return card;
    }

     // Function to choose an appropriate emoji based on the item name (from your previous code)
    function chooseEmoji(name) {
        // Simple lookup for common items
        const emojiMap = {
            'coffee': '☕',
            'latte': '☕',
            'espresso': '☕',
            'movie': '🎬',
            'ticket': '🎟️',
            'burger': '🍔',
            'pizza': '🍕',
            'sandwich': '🥪',
            'lunch': '🍽️',
            'dinner': '🍽️',
            'meal': '🍽️',
            'drink': '🥤',
            'beer': '🍺',
            'wine': '🍷',
            'book': '📚',
            'game': '🎮',
            'bus': '🚌',
            'train': '🚆',
            'ride': '🚕',
            'gas': '⛽',
            'music': '🎵',
            'subscription': '📱',
            'gym': '💪',
            'workout': '💪',
            'snack': '🍿',
            'chocolate': '🍫',
            'ice cream': '🍦',
            'donut': '🍩',
            'haircut': '💇',
            'shirt': '👕',
            'shoes': '👟'
        };

        // Look for matches in our map
        for (const key in emojiMap) {
            if (name.includes(key)) {
                return emojiMap[key];
            }
        }

        // Default emojis if no match
        const defaultEmojis = ['📊', '💰', '🛒', '🏷️', '💸'];
        return defaultEmojis[Math.floor(Math.random() * defaultEmojis.length)];
    }


    // --- Core Calculation and Display Function (handles main result and comparisons) ---
    function updateCalculation() {
        const thingName = thingNameInput.value.trim() || 'That Thing';
        const thingCost = parseFloat(thingCostInput.value);

        // Clear previous output and hide with a slight delay
        outputSection.classList.remove('visible');
        outputSection.innerHTML = '';
        comparisonResults.innerHTML = ''; // Clear comparison results

        // --- Handle Main Result ---
        const mainItemName = itemNameInput.value.trim();
        const mainItemCost = parseFloat(itemCostInput.value);

        if (isNaN(thingCost) || thingCost < 0 || !isAnyInputFilled() || (mainItemName && (isNaN(mainItemCost) || mainItemCost <= 0))) {
            // Display placeholder if inputs are invalid or main comparison is invalid when name is present
            outputSection.innerHTML = '<p class="placeholder">Enter details above to see the magic!</p>';
            // Hide comparison section if main item data is invalid
            comparisonSection.classList.remove('visible');
             // Clear comparison results again just in case
            comparisonResults.innerHTML = '';
             // Reset visual fill if it were still here - commented out
             // updateVisualFill(0, ''); // Removed visual fill
            setTimeout(() => { outputSection.classList.add('visible'); }, 50);
            return;
        }

         // If main thing cost is valid, show comparison section
        comparisonSection.classList.add('visible');

        // --- Display Main Result in Value Box ---
         const resultText1 = document.createElement('p');
        resultText1.classList.add('result-text');
        resultText1.textContent = `Getting ${thingName} ($${thingCost.toFixed(2)}) is equivalent to:`; // Include thing cost
        outputSection.appendChild(resultText1);

        // Create the value box container for the main result
        if (mainItemName && !isNaN(mainItemCost) && mainItemCost > 0) {
             const mainEquivalentItems = thingCost / mainItemCost;

             const valueBox = document.createElement('div');
             valueBox.classList.add('value-box');

             const resultNumberSpan = document.createElement('span');
             resultNumberSpan.classList.add('result-number');
             resultNumberSpan.textContent = '0.0'; // Start animation from 0

             const unitText = document.createElement('div');
             unitText.classList.add('item-unit', 'main-unit'); // Added class for main unit styling
             const plural = parseFloat(mainEquivalentItems.toFixed(1)) !== 1 ? 's' : '';
             unitText.textContent = `${mainItemName}${plural}`;


             valueBox.appendChild(resultNumberSpan);
             outputSection.appendChild(valueBox);
             outputSection.appendChild(unitText); // Add unit text below the box

              // Trigger Number Animation for the main result
             setTimeout(() => {
                 animateNumber(resultNumberSpan, mainEquivalentItems);
             }, 100); // Small delay after output appears
        }


        // --- Handle Multiple Comparisons ---
        const validComparisonsExist = comparisonInputs.some(item => {
             const name = item.nameInput.value.trim();
             const cost = parseFloat(item.costInput.value);
             return name && !isNaN(cost) && cost > 0;
        });

        if (mainItemName && !isNaN(mainItemCost) && mainItemCost > 0 || validComparisonsExist) {
            // Display a title for comparison results if there are any
             const comparisonTitle = document.createElement('h4'); // Smaller heading for results
             comparisonTitle.classList.add('comparison-results-title');
             comparisonTitle.textContent = 'Compared to Other Items:';
             comparisonResults.appendChild(comparisonTitle);


            // Process the primary comparison if it was not used in the main value box display
             if (!(mainItemName && !isNaN(mainItemCost) && mainItemCost > 0)) {
                 // If main item data is valid but not used in the value box, add it to comparisons
                 if (mainItemName && !isNaN(mainItemCost) && mainItemCost > 0) {
                     addComparisonCard(mainItemName, mainItemCost, thingCost);
                 }
             }


            // Process additional comparisons
            comparisonInputs.forEach(item => {
                const name = item.nameInput.value.trim();
                const cost = parseFloat(item.costInput.value);

                if (name && !isNaN(cost) && cost > 0) {
                    addComparisonCard(name, cost, thingCost);
                }
            });

             // Add an insight message if we have any comparison results
            if (comparisonResults.children.length > 1) { // Check if there's more than just the title
                 const messages = [
                    "These comparisons are just one way to think about value - your priorities are what truly matter.",
                    "Everyone values things differently. These equivalents are simply another perspective to consider.",
                    "These numbers can provide context, but only you know what's most meaningful in your life.",
                    "Remember, these are just different ways of looking at the same value - there's no right or wrong choice."
                 ];

                 const insightMessage = document.createElement('p');
                 insightMessage.className = 'insight-message';
                 insightMessage.textContent = messages[Math.floor(Math.random() * messages.length)];
                 comparisonResults.appendChild(insightMessage);
            }

        } else {
            // If no valid main item or comparisons, show a message in the comparison results area
             const noComparisonsMessage = document.createElement('p');
             noComparisonsMessage.classList.add('placeholder', 'no-comparisons');
             noComparisonsMessage.textContent = 'Add items below to compare!';
             comparisonResults.appendChild(noComparisonsMessage);
        }


        // Make output visible with animation
         setTimeout(() => {
             outputSection.classList.add('visible');
         }, 50);
    }


    // --- Functions for Managing Comparison Inputs ---

    // Function to add a new comparison item input group
    function addComparisonItem() {
        comparisonCounter++;

        // Create the comparison item container
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('comparison-item-group', 'input-group'); // Use both classes
        itemDiv.dataset.id = comparisonCounter; // Use data attribute for ID

        // Create name input group
        const nameLabel = document.createElement('label');
        nameLabel.setAttribute('for', `compareItemName-${comparisonCounter}`);
        nameLabel.textContent = `Comparison Item ${comparisonCounter}:`;

        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.id = `compareItemName-${comparisonCounter}`;
        nameInput.placeholder = 'e.g., Movie Ticket';
        nameInput.dataset.type = 'name';
        nameInput.dataset.id = comparisonCounter;

        // Create cost input group
        const costLabel = document.createElement('label');
        costLabel.setAttribute('for', `compareItemCost-${comparisonCounter}`);
        costLabel.textContent = 'Cost ($):';

        const costInput = document.createElement('input');
        costInput.type = 'number';
        costInput.id = `compareItemCost-${comparisonCounter}`;
        costInput.placeholder = 'e.g., 12.00';
        costInput.min = '0';
        costInput.dataset.type = 'cost';
        costInput.dataset.id = comparisonCounter;

        // Create remove button
        const removeButton = document.createElement('button');
        removeButton.className = 'remove-button'; // Use a class for styling
        removeButton.type = 'button'; // Prevent form submission
        removeButton.innerHTML = '×';
        removeButton.addEventListener('click', () => {
            itemDiv.remove(); // Remove the input group from the DOM
            removeInputFromTracking(nameInput); // Remove individual inputs from allInputs
            removeInputFromTracking(costInput);
            removeComparisonInputFromTracking(comparisonCounter); // Remove from comparisonInputs
            updateCardActiveState(); // Update glow state
            updateCalculation(); // Recalculate after removing
        });

        // Assemble the item div
        itemDiv.appendChild(nameLabel);
        itemDiv.appendChild(nameInput);
        itemDiv.appendChild(costLabel);
        itemDiv.appendChild(costInput);
        itemDiv.appendChild(removeButton); // Add the remove button

        // Add the item div to the container
        comparisonItemsContainer.appendChild(itemDiv);

        // Store the input references for tracking
        comparisonInputs.push({
            id: comparisonCounter,
            nameInput: nameInput,
            costInput: costInput
        });

        // Add new inputs to allInputs array for active state tracking
        allInputs.push(nameInput, costInput);

        // Add event listeners for updates on the new inputs
        nameInput.addEventListener('input', updateCalculation);
        costInput.addEventListener('input', updateCalculation);

        updateCardActiveState(); // Update glow state after adding input
        updateCalculation(); // Trigger calculation with new input fields
    }

     // Helper function to remove an input element from the allInputs tracking array
    function removeInputFromTracking(inputElement) {
        const index = allInputs.indexOf(inputElement);
        if (index !== -1) {
            allInputs.splice(index, 1);
        }
    }

    // Function to remove a comparison input pair from tracking
    function removeComparisonInputFromTracking(id) {
        const index = comparisonInputs.findIndex(item => item.id === id);
        if (index !== -1) {
            comparisonInputs.splice(index, 1);
        }
    }


    // --- Reset Function ---
    function resetCalculator() {
        // Reset main inputs
        thingNameInput.value = '';
        thingCostInput.value = '';
        itemNameInput.value = '';
        itemCostInput.value = '';

        // Remove all dynamically added comparison input groups
        comparisonItemsContainer.innerHTML = '';

        // Reset comparison tracking arrays and counter
        comparisonInputs.length = 0;
        comparisonCounter = 0;

        // Clear comparison results
        comparisonResults.innerHTML = '';

        // Hide comparison section
        comparisonSection.classList.remove('visible');

        // Update card active state after resetting inputs
        // Rebuild allInputs array with only the original inputs after removing dynamic ones
        allInputs.length = 0;
        allInputs.push(thingNameInput, thingCostInput, itemCostInput, itemNameInput);
        updateCardActiveState();


        // Reset placeholder and main output
        updateItemCostPlaceholder();
        outputSection.classList.remove('visible');
        outputSection.innerHTML = '<p class="placeholder">Enter details above to see the magic!</p>';

        // No need to call updateCalculation here, as clearing inputs will handle the state
    }


    // --- Event Listeners ---

    // Add event listeners to original input fields for real-time updates
    [thingNameInput, thingCostInput, itemNameInput, itemCostInput].forEach(input => {
        input.addEventListener('input', () => {
            updateCardActiveState();
            updateItemCostPlaceholder(); // Only relevant for itemCost
            updateCalculation();
        });
    });


    // Add event listener for the reset button
    resetButton.addEventListener('click', resetCalculator);

    // Add event listener for the "Add Comparison" button
    addComparisonButton.addEventListener('click', addComparisonItem);


    // --- Initial Setup ---
    updateItemCostPlaceholder();
    updateCardActiveState();
    // Initially hide the comparison section
    comparisonSection.classList.remove('visible');
    // Perform initial calculation (will show placeholder)
    updateCalculation();


});
