import React, { useState, useEffect } from "react";

function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });
  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState("all");
  const [editId, setEditId] = useState(null);

  // Persist tasks in localStorage
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!newTask.trim()) return;
    if (editId) {
      setTasks(
        tasks.map((t) =>
          t.id === editId ? { ...t, text: newTask } : t
        )
      );
      setEditId(null);
    } else {
      setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
    }
    setNewTask("");
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const toggleComplete = (id) => {
    setTasks(
      tasks.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  };

  const editTask = (id, text) => {
    setNewTask(text);
    setEditId(id);
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  return (
    <div style={styles.app}>
      <h1 style={styles.title}>📝 To-Do List</h1>
      <div style={styles.inputSection}>
        <input
          type="text"
          value={newTask}
          placeholder="Enter task..."
          onChange={(e) => setNewTask(e.target.value)}
          style={styles.input}
        />
        <button onClick={addTask} style={styles.button}>
          {editId ? "Update" : "Add"}
        </button>
      </div>

      <div style={styles.filters}>
        <button
          onClick={() => setFilter("all")}
          style={filter === "all" ? styles.activeFilter : styles.filterBtn}
        >
          All
        </button>
        <button
          onClick={() => setFilter("active")}
          style={filter === "active" ? styles.activeFilter : styles.filterBtn}
        >
          Active
        </button>
        <button
          onClick={() => setFilter("completed")}
          style={filter === "completed" ? styles.activeFilter : styles.filterBtn}
        >
          Completed
        </button>
      </div>

      {filteredTasks.length === 0 ? (
        <p style={styles.noTasks}>No Tasks 🚀</p>
      ) : (
        <ul style={styles.list}>
          {filteredTasks.map((task) => (
            <li
              key={task.id}
              style={{
                ...styles.listItem,
                ...(task.completed ? styles.done : {}),
              }}
            >
              <span onClick={() => toggleComplete(task.id)}>{task.text}</span>
              <div>
                <button
                  onClick={() => editTask(task.id, task.text)}
                  style={styles.actionBtn}
                >
                  ✏️
                </button>
                <button
                  onClick={() => deleteTask(task.id)}
                  style={styles.actionBtn}
                >
                  🗑️
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// Inline CSS styles
const styles = {
  app: {
    maxWidth: "500px",
    margin: "40px auto",
    padding: "20px",
    background: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    fontFamily: "Arial, sans-serif",
  },
  title: { textAlign: "center" },
  inputSection: { display: "flex", gap: "10px" },
  input: {
    flex: 1,
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "4px",
  },
  button: {
    padding: "10px 15px",
    border: "none",
    background: "#007bff",
    color: "white",
    borderRadius: "4px",
    cursor: "pointer",
  },
  filters: {
    display: "flex",
    justifyContent: "center",
    margin: "15px 0",
    gap: "10px",
  },
  filterBtn: {
    background: "#e0e0e0",
    color: "black",
    border: "none",
    padding: "8px 12px",
    borderRadius: "4px",
    cursor: "pointer",
  },
  activeFilter: {
    background: "#007bff",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "4px",
    cursor: "pointer",
  },
  list: { listStyle: "none", padding: 0 },
  listItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#fff",
    margin: "8px 0",
    padding: "10px",
    borderRadius: "4px",
  },
  done: { textDecoration: "line-through", color: "gray" },
  actionBtn: {
    marginLeft: "5px",
    background: "transparent",
    fontSize: "18px",
    border: "none",
    cursor: "pointer",
  },
  noTasks: {
    textAlign: "center",
    color: "gray",
    fontStyle: "italic",
  },
};

export default App;