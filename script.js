const titleInput = document.getElementById("title");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const dateInput = document.getElementById("date");
const addExpenseBtn = document.getElementById("addExpenseBtn");
const expenseContainer = document.getElementById("expenseContainer");
const totalAmount = document.getElementById("totalAmount");
const searchExpense = document.getElementById("searchExpense");

let expenses =
  JSON.parse(
    localStorage.getItem("expenses")
  ) || [];
  let editId = null;

addExpenseBtn.addEventListener("click", () => {

  const title = titleInput.value.trim();
  const amount = amountInput.value.trim();
  const category = categoryInput.value;
  const date = dateInput.value;

 if (
  title === "" ||
  amount === "" ||
  category === "" ||
  date === ""
){
  alert("Please fill all the fields");
  return;
}

if (Number(amount) <= 0){
  alert("Amount must be greater than 0");
  return;
}
  const expense = {
    id: Date.now(),
    title,
    amount,
    category,
    date
  };

 if (editId) {

  expenses =
    expenses.map(item => {

      if (item.id === editId) {

        return {
          ...item,
          title,
          amount,
          category,
          date
        };

      }

      return item;

    });

  editId = null;

  addExpenseBtn.textContent =
    "Add Expense";

} else {

  const expense = {
    id: Date.now(),
    title,
    amount,
    category,
    date
  };

  expenses.push(expense);

}
  saveExpenses();
  displayExpenses();

  titleInput.value = "";
  amountInput.value = "";
  categoryInput.value = "";
  dateInput.value = "";

});
function saveExpenses() {

  localStorage.setItem(
    "expenses",
    JSON.stringify(expenses)
  );

}

function displayExpenses( list = expenses) {

  expenseContainer.innerHTML = "";
  if (list.length === 0) {

  expenseContainer.innerHTML = `
  
    <div class="empty-state">

      <h3>No Expenses Found</h3>

      <p>
        Start tracking your expenses!
      </p>

    </div>

  `;

  updateTotal();

  return;

}

  list.forEach(expense => {
    const formattedDate =
new Date(expense.date)
.toLocaleDateString(
  "en-IN",
  {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }
);

    expenseContainer.innerHTML += `
    
      <div class="expense-card">

        <h3>${expense.title}</h3>

       <p class="amount">
  ₹${expense.amount}
</p>

        <p class="category ${expense.category}">
  ${expense.category}
</p>

        <p>${formattedDate}</p>
        <button
  class="edit-btn"
  onclick="editExpense(${expense.id})"
>
  Edit
</button>
          <button
      class="delete-btn"
      onclick="deleteExpense(${expense.id})"
    >
      Delete
    </button>

      </div>

    `;

  });
  updateTotal();

}

function updateTotal() {

  const total =
    expenses.reduce(
      (sum, expense) =>
        sum + Number(expense.amount),
      0
    );

  totalAmount.textContent =
    `₹${total}`;

}

function deleteExpense(id) {

  expenses =
    expenses.filter(
      expense =>
        expense.id !== id
    );
  saveExpenses();

  displayExpenses();

}

displayExpenses();
function editExpense(id) {

  const expense =
    expenses.find(
      expense =>
        expense.id === id
    );

  titleInput.value =
    expense.title;

  amountInput.value =
    expense.amount;

  categoryInput.value =
    expense.category;

  dateInput.value =
    expense.date;

  editId = id;

  addExpenseBtn.textContent =
    "Update Expense";

}
searchExpense.addEventListener(
  "input",
  () => {

    const value =
      searchExpense.value
        .toLowerCase()
        .trim();

    const filtered =
      expenses.filter(
        expense =>

          expense.title
            .toLowerCase()
            .includes(value)

          ||

          expense.category
            .toLowerCase()
            .includes(value)
      );

    displayExpenses(filtered);

  }
);