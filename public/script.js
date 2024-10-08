document.addEventListener('DOMContentLoaded', function() {
    // Tax rates
    const FEDERAL_TAX_RATE = 0.0710;
    const STATE_TAX_RATE = 0.0084;
    const CITY_TAX_RATE = 0.0246;
    const SOCIAL_SECURITY_TAX_RATE = 0.0620;
    const MEDICARE_TAX_RATE = 0.0145;

    // DOM elements
    const payTypeRadios = document.getElementsByName('pay-type');
    const payInput = document.getElementById('payInput');
    const hoursWorked = document.getElementById('hoursWorked');
    const overtimeHours = document.getElementById('overtimeHours');
    const overtimeRate = document.getElementById('overtimeRate');
    const payFrequency = document.getElementById('payFrequency');
    const calculateBtn = document.getElementById('calculateBtn');
    const hourlyInputs = document.getElementById('hourlyInputs');
    const netPayFrequency = document.getElementById('netPayFrequency');
    const resultsSection = document.getElementById("results");
    let payType = document.querySelector('input[name="pay-type"]:checked').value;
    

    // Results elements
    const grossPayElement = document.getElementById('grossPay');
    const federalTaxElement = document.getElementById('federalTax');
    const socialSecurityTaxElement = document.getElementById('socialSecurityTax');
    const medicareTaxElement = document.getElementById('medicareTax');
    const stateTaxElement = document.getElementById('stateTax');
    const localTaxElement = document.getElementById('localTax');
    const netPayElement = document.getElementById('netPay');

    // Event listeners
    payTypeRadios.forEach(radio => {
        radio.addEventListener('change', toggleInputs);
    });

    calculateBtn.addEventListener('click', calculateNetPay);

    // Add input validation listeners
    payInput.addEventListener('input', validatePositiveNumber);
    hoursWorked.addEventListener('input', validatePositiveNumber);
    overtimeHours.addEventListener('input', validateOvertimeInput);

    // Functions
    function toggleInputs() {
        payType = document.querySelector('input[name="pay-type"]:checked').value;
        
        payInput.value = "";
        const gif = document.getElementById("gif");
       
        if (payType === 'hourly') {
            hourlyInputs.style.display = 'flex';
            payInput.placeholder = 'Enter hourly rate';

            gif.style.scale = 1.0;
        } else {
            hourlyInputs.style.display = 'none';
            payInput.placeholder = 'Enter annual gross pay';
            
            gif.setAttribute("style", "align-items: end; scale: 0.8;");
        }  
    }

    function validatePositiveNumber(event) {
        const input = event.target;
        const value = input.value;
        
        const targetParent = input.parentElement;
        const error_message_p = targetParent.querySelector(".error-message");
        

        if (value === '' || isNaN(value) || parseFloat(value) <= 0) {
            input.style.borderColor = 'red';
            error_message_p.classList.remove("hidden");
        } else {
            input.style.borderColor = '';
            error_message_p.classList.add("hidden");
            
            
        }
    }

    function validateOvertimeInput(event) {
        const input = event.target;
        const value = input.value;
        
        const targetParent = input.parentElement;
        const error_message_p = targetParent.querySelector(".error-message");

        if (isNaN(value) || parseFloat(value) < 0) {
            input.style.borderColor = 'red';
            error_message_p.classList.remove("hidden");
        } else {
            input.style.borderColor = '';
            error_message_p.classList.add("hidden");
        }
    }

    function isInputValid() {
        const inputs = [payInput, hoursWorked];

        if (payType === "annual") {
            return payInput.value !== ""? true: false;
        }
        else {
            if (overtimeHours.style.borderColor == "red") {
                return false;
            }
    
            return inputs.every(input => input.style.borderColor !== 'red' && input.value !== '');
        }
    
    }

    function calculateNetPay() {
        if (!isInputValid()) {
            alert('Please correct the invalid inputs before calculating.');
            return;
        }
        
        const payType = document.querySelector('input[name="pay-type"]:checked').value;
        let grossPay = 0;
        const frequency = payFrequency.value;

        try {
            if (payType === 'hourly') {
                const hourlyRate = parseFloat(payInput.value) || 0;
                const regularHours = parseFloat(hoursWorked.value) || 0;
                const overtimeHoursWorked = parseFloat(overtimeHours.value) || 0;
                const overtimeMultiplier = parseFloat(overtimeRate.value);
                
                
                if (frequency === 'Weekly') {
                    grossPay = (hourlyRate * regularHours) + (hourlyRate * overtimeHoursWorked * overtimeMultiplier);
                } else if (frequency === 'Bi-weekly') {
                    grossPay = (hourlyRate * (regularHours * 2)) + (hourlyRate * overtimeHoursWorked * overtimeMultiplier);
                }
                
            } else {
                const annualPay = parseFloat(payInput.value) || 0;  

                if (frequency === 'Weekly') {
                    grossPay = annualPay / 52;
                } else if (frequency === 'Bi-weekly') {
                    grossPay = annualPay / 26;
                }
            }
            

            

            const federalTax = grossPay * FEDERAL_TAX_RATE;
            const stateTax = grossPay * STATE_TAX_RATE;
            const localTax = grossPay * CITY_TAX_RATE;
            const socialSecurityTax = grossPay * SOCIAL_SECURITY_TAX_RATE;
            const medicareTax = grossPay * MEDICARE_TAX_RATE;

            const totalTaxes = federalTax + stateTax + localTax + socialSecurityTax + medicareTax;
            const netPay = grossPay - totalTaxes;

            // Update results
            grossPayElement.textContent = formatCurrency(grossPay);
            federalTaxElement.textContent = formatCurrency(federalTax);
            socialSecurityTaxElement.textContent = formatCurrency(socialSecurityTax);
            medicareTaxElement.textContent = formatCurrency(medicareTax);
            stateTaxElement.textContent = formatCurrency(stateTax);
            localTaxElement.textContent = formatCurrency(localTax);
            netPayFrequency.textContent = frequency + " pay";
            netPayElement.textContent = formatCurrency(netPay);
        } catch (error) {
            console.error('Error in calculation:', error);
            alert('An error occurred during calculation. Please check your inputs and try again.');
        }
        resultsSection.scrollIntoView({behavior: "smooth"});
    }

    function formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    }

    // Initialize the input display
    toggleInputs();
    
});