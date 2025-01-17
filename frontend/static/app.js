// Base URL untuk API
const API_BASE_URL = "http://localhost:8080/todos";

// Ambil elemen ul untuk daftar todo
const todoList = document.getElementById("todoList");
const completedList = document.getElementById("tes");
const todoForm = document.getElementById("todoForm");
const titleInput = document.getElementById("title");
const descriptionInput = document.getElementById("description");

// Fungsi untuk menampilkan semua data todo
async function fetchTodos() {
  try {
    const response = await fetch(API_BASE_URL); // Panggil API GET todos
    if (response.ok) {
      const todos = await response.json(); // Parse data JSON dari respons
      renderTodos(todos); // Tampilkan data ke dalam UI
    } else {
      alert("Gagal mengambil data todo!");
    }
  } catch (err) {
    alert("Error saat mengambil data: " + err.message);
  }
}

// Fungsi untuk menampilkan todo di dalam daftar
function renderTodos(todos) {
  todoList.innerHTML = ""; // Bersihkan daftar aktif
  completedList.innerHTML = ""; // Bersihkan daftar selesai

  todos.forEach((todo) => {
    const li = document.createElement("li");
    li.className = "bg-gray-100 shadow-md rounded-lg p-4 mb-4";
    li.dataset.id = todo.id;
    li.innerHTML = `
      <div>
        <h3 class="text-lg font-bold text-gray-700">${todo.title}</h3>
        <p class="text-sm text-gray-500 mb-2">${todo.description}</p>
        <div class="flex space-x-2">
          ${
            !todo.completed
              ? `<button class="completeBtn bg-green-500 text-white font-bold py-1 px-4 rounded hover:bg-green-700">Complete</button>`
              : `<button class="uncompleteBtn bg-gray-500 text-white font-bold py-1 px-4 rounded hover:bg-gray-700">Uncompleted</button>`
          }
          <button class="updateBtn bg-yellow-500 text-white font-bold py-1 px-4 rounded hover:bg-yellow-700">
            Edit
          </button>
          <button class="deleteBtn bg-red-500 text-white font-bold py-1 px-4 rounded hover:bg-red-700">Delete</button>
        </div>
      </div>
    `;

    // Event listener untuk tombol Complete
    if (!todo.completed) {
      const completeBtn = li.querySelector(".completeBtn");
      completeBtn.addEventListener("click", () => {
        markTodoAsComplete(todo.id);
      });
    } else {
      // Event listener untuk tombol Uncomplete
      const uncompleteBtn = li.querySelector(".uncompleteBtn");
      uncompleteBtn.addEventListener("click", () => {
        markTodoAsUncomplete(todo.id);
      });
    }

     // Event listener untuk tombol update
     const updateBtn = li.querySelector(".updateBtn");
     updateBtn.addEventListener("click", () => {
       showEditForm(todo, li);
     });

    // Event listener untuk tombol Delete
    const deleteBtn = li.querySelector(".deleteBtn");
    deleteBtn.addEventListener("click", () => {
      deleteTodoById(todo.id, li);
    });

    // Tambahkan elemen ke daftar aktif atau selesai
    if (todo.completed) {
      completedList.appendChild(li);
    } else {
      todoList.appendChild(li);
    }
  });
}

// Fungsi untuk menandai todo sebagai selesai
async function markTodoAsComplete(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ completed: true }),
    });

    if (response.ok) {
      // Pindahkan elemen ke daftar selesai
      const todoItem = document.querySelector(`li[data-id='${id}']`);
      completedList.appendChild(todoItem);
      todoItem.querySelector(".completeBtn")?.remove(); // Hapus tombol Complete
      const uncompleteButton = document.createElement("button");
      uncompleteButton.className =
        "uncompleteBtn bg-gray-500 text-white font-bold py-1 px-4 rounded hover:bg-gray-700";
      uncompleteButton.textContent = "Uncompleted";
      uncompleteButton.addEventListener("click", () => {
        markTodoAsUncomplete(id);
      });
      todoItem.querySelector(".flex").prepend(uncompleteButton);
      alert("Todo berhasil ditandai sebagai selesai!");
    } else {
      alert("Gagal menandai todo sebagai selesai!");
    }
  } catch (err) {
    alert("Error marking todo as complete: " + err.message);
  }
}

// Fungsi untuk menandai todo sebagai belum selesai
async function markTodoAsUncomplete(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ completed: false }),
    });

    if (response.ok) {
      // Pindahkan elemen ke daftar aktif
      const todoItem = document.querySelector(`li[data-id='${id}']`);
      todoList.appendChild(todoItem);
      todoItem.querySelector(".uncompleteBtn")?.remove(); // Hapus tombol Uncomplete
      const completeButton = document.createElement("button");
      completeButton.className =
        "completeBtn bg-green-500 text-white font-bold py-1 px-4 rounded hover:bg-green-700";
      completeButton.textContent = "Complete";
      completeButton.addEventListener("click", () => {
        markTodoAsComplete(id);
      });
      todoItem.querySelector(".flex").prepend(completeButton);
      alert("Todo berhasil ditandai sebagai belum selesai!");
    } else {
      alert("Gagal menandai todo sebagai belum selesai!");
    }
  } catch (err) {
    alert("Error marking todo as uncomplete: " + err.message);
  }
}

// Fungsi untuk menampilkan form update
function showEditForm(todo, li) {
  li.innerHTML = `
    <div>
      <input
        type="text"
        id="editTitle"
        value="${todo.title}"
        class="w-full mb-2 p-2 border rounded"
      />
      <textarea
        id="editDescription"
        class="w-full mb-2 p-2 border rounded"
        rows="2"
      >${todo.description}</textarea>
      <div class="flex space-x-2">
        <button class="saveBtn bg-green-500 text-white font-bold py-1 px-4 rounded hover:bg-green-700">
          Save
        </button>
        <button class="cancelBtn bg-gray-500 text-white font-bold py-1 px-4 rounded hover:bg-gray-700">
          Cancel
        </button>
      </div>
    </div>
  `;

  // Event listener untuk tombol save
  const saveBtn = li.querySelector(".saveBtn");
  saveBtn.addEventListener("click", async () => {
    const updatedTitle = li.querySelector("#editTitle").value.trim();
    const updatedDescription = li
      .querySelector("#editDescription")
      .value.trim();

    if (!updatedTitle) {
      alert("Title is required!");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/${todo.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: updatedTitle,
          description: updatedDescription,
        }),
      });

      if (response.ok) {
        alert("Todo berhasil diperbarui!");
        await fetchTodos(); // Refresh daftar todo
      } else {
        const error = await response.json();
        alert(`Failed to update todo: ${error.message}`);
      }
    } catch (err) {
      alert("Error updating todo: " + err.message);
    }
  });

  // Event listener untuk tombol cancel
  const cancelBtn = li.querySelector(".cancelBtn");
  cancelBtn.addEventListener("click", () => {
    fetchTodos(); // Render ulang elemen tanpa perubahan
  });
}

// Fungsi untuk menghapus todo berdasarkan ID
async function deleteTodoById(id, li) {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      await fetchTodos(); // Refresh data setelah menghapus
      li.remove(); // Hapus elemen dari DOM
    } else {
      const error = await response.json();
      alert(`Failed to delete: ${error.message}`);
    }
  } catch (err) {
    alert("Error deleting todo: " + err.message);
  }
}

// Event listener untuk tambah atau update todo
todoForm.addEventListener("submit", async (event) => {
  event.preventDefault(); // Mencegah submit form default
  const title = titleInput.value.trim();
  const description = descriptionInput.value.trim();

  if (!title) {
    alert("Title is required!");
    return;
  }

  const submitButton = todoForm.querySelector('button[type="submit"]');

  if (submitButton.textContent === "Update Todo") {
    const todoId = todoForm.dataset.id;
    try {
      const response = await fetch(`${API_BASE_URL}/${todoId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description }),
      });

      if (response.ok) {
        alert("Todo berhasil diperbarui!");
        await fetchTodos(); // Refresh data
        todoForm.reset(); // Reset form
        submitButton.textContent = "Add Todo"; // Kembali ke mode tambah
        submitButton.className =
          "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded";
        delete todoForm.dataset.id; // Hapus data id untuk menghindari kebingungannya
      } else {
        const error = await response.json();
        alert(`Failed to update todo: ${error.message}`);
      }
    } catch (err) {
      alert("Error updating todo: " + err.message);
    }
  } else {
    try {
      const response = await fetch(API_BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description }),
      });

      if (response.ok) {
        alert("Todo berhasil ditambahkan!");
        await fetchTodos(); // Refresh data
        todoForm.reset(); // Reset form
      } else {
        const error = await response.json();
        alert(`Failed to add todo: ${error.message}`);
      }
    } catch (err) {
      alert("Error adding todo: " + err.message);
    }
  }
});

// Panggil fungsi fetchTodos saat halaman dimuat
window.onload = async () => {
  await fetchTodos();
};
