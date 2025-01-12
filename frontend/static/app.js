const apiUrl = "http://localhost:8080/todos";

document.getElementById("todoForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, description, completed: false }),
  });

  if (response.ok) {
    loadTodos();
    document.getElementById("todoForm").reset();
  }
});

async function loadTodos() {
  const response = await fetch(apiUrl);
  const todos = await response.json();

  const todoList = document.getElementById("todoList");
  todoList.innerHTML = "";
  todos.forEach((todo) => {
    const li = document.createElement("li");
    li.textContent = `${todo.id}: ${todo.title} - ${todo.description} (${todo.completed ? "Completed" : "Not Completed"})`;
    todoList.appendChild(li);
  });
}

loadTodos();
