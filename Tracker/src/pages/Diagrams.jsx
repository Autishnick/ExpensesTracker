import ToolBar from "../components/ToolBar";
import "../styles/Diagrams.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Rectangle,
  ResponsiveContainer,
} from "recharts";

function Diagrams() {
  let expenses = [];
  try {
    const stored = localStorage.getItem("expenses");
    expenses = stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("Error parsing expenses from localStorage:", e);
    expenses = [];
  }

  const categoryExpenses = expenses.reduce((acc, expense) => {
    if (!expense.category || isNaN(parseFloat(expense.cost))) return acc;
    const category = expense.category;
    acc[category] = (acc[category] || 0) + parseFloat(expense.cost);
    return acc;
  }, {});

  const data = Object.keys(categoryExpenses).map((category) => ({
    name: category,
    cost: categoryExpenses[category],
  }));

  console.log("Chart data:", data);

  const memberExpenses = expenses.reduce((acc, expense) => {
    if (!expense.member || isNaN(parseFloat(expense.cost))) return acc;
    const member = expense.member;
    acc[member] = (acc[member] || 0) + parseFloat(expense.cost);
    return acc;
  }, {});

  const memberData = Object.keys(memberExpenses).map((member) => ({
    name: member,
    cost: memberExpenses[member],
  }));

  return (
    <div style={{ width: "100%", height: "100vh", padding: "20px" }}>
      {data.length > 0 ? (
        <div style={{ width: "100%", height: 400, marginBottom: 40 }}>
          <h3 className="header3">Витрати по категоріях</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="cost"
                fill="#8884d8"
                activeBar={<Rectangle fill="black" stroke="purple" />}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p></p>
      )}

      {memberData.length > 0 ? (
        <div style={{ width: "100%", height: 400, marginBottom: 40 }}>
          <h3 className="header3">Витрати по членах сім'ї</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={memberData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="cost"
                fill="#82ca9d"
                activeBar={<Rectangle fill="black" stroke="blue" />}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : null}

      {localStorage.getItem("expenses") === null ? (
        <p>Витрати не знайдено. Додайте витрати, щоб побачити діаграму.</p>
      ) : (
        <>
          <p className="total-expenses">
            Загальна сума витрат:{" "}
            {data.reduce((sum, item) => sum + item.cost, 0).toFixed(2)}
          </p>
          <button
            onClick={() => {
              localStorage.removeItem("expenses");
              window.location.reload();
            }}
            className="clear-expenses-button"
          >
            Очистити витрати
            <span className="clear-expenses-icon">🗑️</span>
          </button>
        </>
      )}
      <ToolBar />
    </div>
  );
}

export default Diagrams;
