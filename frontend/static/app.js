// Base URL untuk API
const API_BASE_URL = "http://localhost:8080/todos";

// Ambil elemen ul untuk daftar todo
const todoList = document.getElementById("todoList");
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
      alert('Gagal mengambil data todo!');
    }
  } catch (err) {
    alert('Error saat mengambil data: ' + err.message);
  }
}

// Fungsi untuk menampilkan todo di dalam daftar
function renderTodos(todos) {
  todoList.innerHTML = ''; // Bersihkan daftar sebelumnya untuk menghindari duplikasi

  todos.forEach((todo) => {
    const li = document.createElement('li');
    li.className = 'bg-gray-100 shadow-md rounded-lg p-4 mb-4'; // Tambahkan gaya Tailwind CSS
    li.dataset.id = todo.id; // Simpan id pada elemen li
    li.innerHTML = `
      <div>
        <h3 class="text-lg font-bold text-gray-700">${todo.title}</h3>
        <p class="text-sm text-gray-500 mb-4">${todo.description}</p>
        <div class="flex space-x-2">
          <button class="updateBtn bg-yellow-500 text-white font-bold py-1 px-4 rounded hover:bg-yellow-700">
            Update
          </button>
          <button class="deleteBtn bg-red-500 text-white font-bold py-1 px-4 rounded hover:bg-red-700">
            Delete
          </button>
        </div>
      </div>
    `;

    // Event listener untuk tombol update
    const updateBtn = li.querySelector('.updateBtn');
    updateBtn.addEventListener('click', () => {
      showUpdateForm(todo);
    });

    // Event listener untuk tombol delete
    const deleteBtn = li.querySelector('.deleteBtn');
    deleteBtn.addEventListener('click', () => {
      deleteTodoById(todo.id, li);
    });

    todoList.appendChild(li); // Tambahkan elemen ke dalam ul
  });
}

// Fungsi untuk menampilkan form update
function showUpdateForm(todo) {
  titleInput.value = todo.title;
  descriptionInput.value = todo.description;

  const submitButton = todoForm.querySelector('button[type="submit"]');
  submitButton.textContent = 'Update Todo';
  submitButton.className = 'bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded';

  todoForm.onsubmit = async (event) => {
    event.preventDefault();
    const updatedTitle = titleInput.value.trim();
    const updatedDescription = descriptionInput.value.trim();

    if (!updatedTitle) {
      alert('Title is required!');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/${todo.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: updatedTitle, description: updatedDescription }),
      });

      if (response.ok) {
        alert('Todo berhasil diperbarui!');
        await fetchTodos(); // Refresh data
        todoForm.reset(); // Reset form
        submitButton.textContent = 'Add Todo'; // Kembali ke mode tambah
        submitButton.className = 'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded';
      } else {
        const error = await response.json();
        alert(`Failed to update todo: ${error.message}`);
      }
    } catch (err) {
      alert('Error updating todo: ' + err.message);
    }
  };
}

// Fungsi untuk menghapus todo berdasarkan ID
async function deleteTodoById(id, li) {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
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
todoForm.addEventListener('submit', async (event) => {
  event.preventDefault(); // Mencegah submit form default
  const title = titleInput.value.trim();
  const description = descriptionInput.value.trim();

  if (!title) {
    alert("Title is required!");
    return;
  }

  const submitButton = todoForm.querySelector('button[type="submit"]');

  if (submitButton.textContent === 'Update Todo') {
    const todoId = todoForm.dataset.id;
    try {
      const response = await fetch(`${API_BASE_URL}/${todoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description }),
      });

      if (response.ok) {
        alert('Todo berhasil diperbarui!');
        await fetchTodos(); // Refresh data
        todoForm.reset(); // Reset form
        submitButton.textContent = 'Add Todo'; // Kembali ke mode tambah
        submitButton.className = 'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded';
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
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description }),
      });

      if (response.ok) {
        alert('Todo berhasil ditambahkan!');
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
