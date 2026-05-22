import React, { useState } from "react";
import ToolBar from "../components/ToolBar";
import "../styles/AddExpense.css";

function AddExpense() {
  const [member, setMember] = useState("");
  const [category, setCategory] = useState("");
  const [cost, setCost] = useState("");
  const items = [
    "🛒Products",
    "🚌Transport",
    "⚽Entertainment",
    "👗Clothing and shoes",
    "🏥Medicine",
    "📰Utilities and Internet",
    "📨Other",
  ];
  const addExpense = () => {
    if (member && category && cost) {
      const expense = {
        member,
        category,
        cost: parseFloat(cost),
      };

      const existing = JSON.parse(localStorage.getItem("expenses")) || [];
      const updated = [...existing, expense];
      localStorage.setItem("expenses", JSON.stringify(updated));

      setMember("");
      setCategory("");
      setCost("");
    }
  };
  return (
    <>
      <div className="addExpense-container">
        <h2 className="addExpense-header">Add Expense</h2>
        <p className="addExpense-text">Family member</p>
        <input
          type="text"
          className="addExpense-input"
          id="memb"
          value={member}
          onChange={(e) => setMember(e.target.value)}
        />
        <p className="addExpense-text">Category</p>
        <select
          className="addExpense-select"
          id="categ"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="" disabled>
            Select category
          </option>
          {items.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <p className="addExpense-text">Cost</p>
        <input
          type="text"
          className="addExpense-input"
          id="cost"
          value={cost}
          onChange={(e) => setCost(e.target.value)}
        />
        <button className="addExpense-button" onClick={addExpense}>
          Add
        </button>
      </div>
      <ToolBar />
    </>
  );
}

export default AddExpense;
