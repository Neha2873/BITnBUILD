// Fetch and display transactions
async function loadTransactions() {
  try {
    const response = await fetch("http://localhost:3000/api/transactions");
    const data = await response.json();

    const list = document.getElementById("transactionList");
    list.innerHTML = ""; // clear old content

    data.forEach(tx => {
      const div = document.createElement("div");
      div.className = "transaction-item";
      div.innerHTML = `
        <strong>${tx.department}</strong> - ${tx.type} - ₹${tx.amount} - ${tx.status}
      `;
      list.appendChild(div);
    });
  } catch (err) {
    console.error("Error loading transactions:", err);
  }
}

// Handle new transaction form
document.getElementById("transactionForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const department = document.getElementById("department").value;
  const type = document.getElementById("type").value;
  const amount = document.getElementById("amount").value;
  const date = document.getElementById("date").value;

  try {
    await fetch("http://localhost:3000/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ department, type, amount, status: "pending", date })
    });

    document.getElementById("transactionForm").reset();
    loadTransactions(); // reload list
  } catch (err) {
    console.error("Error adding transaction:", err);
  }
});

// Load transactions when page starts
loadTransactions();
