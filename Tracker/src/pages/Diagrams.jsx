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

  return (
    <div style={{ width: "100%", height: "100vh", padding: "20px" }}>
      {data.length > 0 ? (
        <div style={{ width: "100%", height: 400 }}>
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
        <p>Даних для побудови діаграми не знайдено.</p>
      )}
      <ToolBar />
    </div>
  );
}

export default Diagrams;
