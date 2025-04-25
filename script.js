document.addEventListener('DOMContentLoaded', () => {
    const thingCostInput = document.getElementById('thingCost');
    const itemCostInput = document.getElementById('itemCost');
    const itemNameInput = document.getElementById('itemName');
    const outputSection = document.getElementById('outputSection');

    // Function to perform the calculation and update the output
    function updateCalculation() {
        const thingCost = parseFloat(thingCostInput.value);
        const itemCost = parseFloat(itemCostInput.value);
        const itemName = itemNameInput.value.trim() || 'Everyday Item'; // Use default if empty

        // Clear previous output and hide
        outputSection.innerHTML = '';
        outputSection.classList.remove('visible');


        if (isNaN(thingCost) || isNaN(itemCost) || itemCost <= 0 || thingCost < 0) {
            // Display a placeholder or error message if inputs are invalid
             outputSection.innerHTML = '<p class="placeholder">Enter valid numbers for costs.</p>';
             // Add a slight delay before making visible to avoid jarring updates
             setTimeout(() => { outputSection.classList.add('visible'); }, 50);
            return; // Stop if inputs are not valid
        }

        const equivalentItems = (thingCost / itemCost).toFixed(1); // Keep one decimal for clarity

        // Create and add the output elements
        const resultText1 = document.createElement('p');
        resultText1.classList.add('result-text');
        resultText1.textContent = 'Getting that Thing is equivalent to:';

        const resultNumber = document.createElement('span'); // Use span for inline number
        resultNumber.classList.add('result-number');
        resultNumber.textContent = equivalentItems;

         const resultText2 = document.createElement('p');
        resultText2.classList.add('result-text');
        // Handle pluralization simply (you could make this more robust)
        resultText2.textContent = `${itemName}${parseFloat(equivalentItems) !== 1 ? 's' : ''}`;


        outputSection.appendChild(resultText1);
        outputSection.appendChild(resultNumber);
        outputSection.appendChild(resultText2);


        // Make output visible with animation
         setTimeout(() => { outputSection.classList.add('visible'); }, 50); // Small delay for CSS transition


    }

    // Add event listeners to input fields for real-time updates
    thingCostInput.addEventListener('input', updateCalculation);
    itemCostInput.addEventListener('input', updateCalculation);
    itemNameInput.addEventListener('input', updateCalculation);

    // Initial calculation on page load if there are pre-filled values (unlikely here)
    updateCalculation();
});
