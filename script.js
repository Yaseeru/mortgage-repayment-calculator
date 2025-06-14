const submitBtn = document.getElementById("submit-btn");
const mortgageAmount = document.getElementById("mortgage-amount");
const mortgageTerm = document.getElementById("mortgage-term");
const interestRate = document.getElementById("interest-rate");
const mortgageType = document.getElementsByName("mortgage-type");
const resultContainer = document.getElementById("results");
const clearBtn = document.getElementById("clear-btn");

// Clear button functionality
clearBtn.addEventListener("click", (e) => {
     e.preventDefault();
     window.location.reload(); // refresh to reset the form
});

submitBtn.addEventListener("click", (e) => {
     e.preventDefault();

     let selectedMortgageType = "";
     mortgageType.forEach((type) => {
          if (type.checked) selectedMortgageType = type.value;
     });

     checkErrors(mortgageAmount, mortgageTerm, interestRate, selectedMortgageType);
});

// Function to check for errors in the form inputs
function checkErrors(amount, term, rate, type) {
     // Remove previous error messages
     document.querySelectorAll(".error-message").forEach(el => el.remove());

     let hasError = false;

     const showError = (input, message) => {
          const error = document.createElement("p");
          error.className = "error-message";
          error.textContent = message;
          input.parentElement.appendChild(error);
     };

     if (!amount.value || isNaN(amount.value) || +amount.value <= 0) {
          showError(amount, "This field is required.");
          hasError = true;
     }

     if (!term.value || isNaN(term.value) || +term.value <= 0) {
          showError(term, "This field is required.");
          hasError = true;
     }

     if (!rate.value || isNaN(rate.value) || +rate.value <= 0) {
          showError(rate, "This field is required.");
          hasError = true;
     }

     if (!type) {
          const typeGroup = document.querySelector("input[name='mortgage-type']").closest(".radio-option")
               || document.querySelector("input[name='mortgage-type']").parentElement;
          showError(typeGroup, "This field is required.");
          hasError = true;
     }

     if (!hasError) {
          handleFormSubmission(amount, term, rate, type);
     }
}

// Function to format numbers with commas and 2 decimal places
function formatCurrency(num) {
     return num.toLocaleString("en-UK", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
     });
}

// Function to handle form submission
function handleFormSubmission(amount, term, rate, type) {
     const principal = +amount.value;
     const years = +term.value;
     const annualRate = +rate.value;
     const monthlyRate = annualRate / 100 / 12;

     if (type === "repayment") {
          const monthlyPayment = (principal * monthlyRate) /
               (1 - Math.pow(1 + monthlyRate, -years * 12));
          const totalPayment = monthlyPayment * years * 12;

          resultContainer.innerHTML = `
               <h2>Your results</h2>
               <p>Your results are shown below based on the information you provided. To adjust the results, edit the form and click “calculate repayments” again.</p>
               <div class="result-card">
                    <p>Your monthly repayments</p>
                    <h1>£${formatCurrency(monthlyPayment)}</h1>
                    <p>Total you'll repay over the term</p>
                    <h3>£${formatCurrency(totalPayment)}</h3>
               </div>
          `;
     } else if (type === "interest-only") {
          const monthlyInterest = principal * monthlyRate;
          const totalInterest = monthlyInterest * years * 12;

          resultContainer.innerHTML = `
               <h2>Your results</h2>
               <p>Your results are shown below based on the information you provided. To adjust the results, edit the form and click “calculate repayments” again.</p>
               <div class="result-card">
                    <p>Your monthly repayments</p>
                    <h1>£${formatCurrency(monthlyInterest)}</h1>
                    <p>Total you'll repay over the term</p>
                    <h3>£${formatCurrency(totalInterest)}</h3>
               </div>
          `;
     } else {
          console.error("Invalid mortgage type selected.");
     }
}
