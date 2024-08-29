import Swal from "sweetalert2";

function main() {
  const baseUrl = "https://notes-api.dicoding.dev/v2";

  const createNote = async (note) => {
    try {
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(note),
      };

      const response = await fetch(`${baseUrl}/notes`, options);
      const responseJson = await response.json();
      showResponseMessage(responseJson.status, responseJson.message);
      getNotesNonArchived();
    } catch (error) {
      showResponseMessage("error", error.message);
    }
  };

  const getNotesNonArchived = async () => {
    try {
      const response = await fetch(`${baseUrl}/notes`);
      const responseJson = await response.json();
      if (responseJson.error) {
        showResponseMessage(responseJson.status, responseJson.message);
      } else {
        renderAllNotes(responseJson.data);
      }
    } catch (error) {
      showResponseMessage("error", error.message);
    }
  };

  const getArchivedNotes = async () => {
    try {
      const response = await fetch(`${baseUrl}/notes/archived`);
      const responseJson = await response.json();
      if (responseJson.error) {
        showResponseMessage(responseJson.status, responseJson.message);
      } else {
        renderAllNotes(responseJson.data);
      }
    } catch (error) {
      showResponseMessage("error", error.message);
    }
  };

  const getSingleNote = async (noteId) => {
    try {
      const response = await fetch(`${baseUrl}/notes/${noteId}`);
      const responseJson = await response.json();
      if (responseJson.error) {
        showResponseMessage(responseJson.status, responseJson.message);
      } else {
        renderSingleNote(responseJson.note);
      }
    } catch (error) {
      showResponseMessage("error", error.message);
    }
  };

  const archiveNote = async (noteId) => {
    try {
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      };

      const response = await fetch(
        `${baseUrl}/notes/${noteId}/archive`,
        options
      );
      const responseJson = await response.json();
      showResponseMessage(responseJson.status, responseJson.message);
      getNotesNonArchived();
    } catch (error) {
      showResponseMessage("error", error.message);
    }
  };

  const unarchiveNote = async (noteId) => {
    try {
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      };

      const response = await fetch(
        `${baseUrl}/notes/${noteId}/unarchive`,
        options
      );
      const responseJson = await response.json();
      showResponseMessage(responseJson.status, responseJson.message);
      getArchivedNotes();
    } catch (error) {
      showResponseMessage("error", error.message);
    }
  };

  const deleteNote = async (noteId) => {
    try {
      const options = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      };

      const response = await fetch(`${baseUrl}/notes/${noteId}`, options);
      const responseJson = await response.json();
      showResponseMessage(responseJson.status, responseJson.message);
      getNotesNonArchived();
    } catch (error) {
      showResponseMessage("error", error.message);
    }
  };

  const showResponseMessage = (status, message) => {
    Swal.fire({
      position: "top-end",
      icon: status,
      title: message,
      showConfirmButton: false,
      timer: 1500,
    });
  };

  const renderAllNotes = (notes) => {
    const listNote = document.getElementById("listNote");
    listNote.innerHTML = "";

    const sortedNotes = notes.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    sortedNotes.forEach((note) => {
      const noteItem = document.createElement("div");
      noteItem.className = "note-item";
      noteItem.innerHTML = `
        <button class="delete-button" data-id="${note.id}">&times;</button>
        <h5>${note.title}</h5>
        <p>${note.body}</p>
        <small>${new Date(note.createdAt).toLocaleString()}</small>
        <button class="archive-button" data-id="${note.id}">Arsipkan</button>
      `;
      listNote.appendChild(noteItem);

      noteItem
        .querySelector(".delete-button")
        .addEventListener("click", async () => {
          const result = await Swal.fire({
            title: "Konfirmasi Hapus",
            text: "Apakah Anda yakin ingin menghapus catatan ini?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Ya, hapus!",
            cancelButtonText: "Batal",
          });
          if (result.isConfirmed) {
            deleteNote(note.id);
          }
        });

      noteItem
        .querySelector(".archive-button")
        .addEventListener("click", async () => {
          const result = await Swal.fire({
            title: "Konfirmasi Arsip",
            text: "Apakah Anda yakin ingin mengarsipkan catatan ini?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Ya, arsipkan!",
            cancelButtonText: "Batal",
          });
          if (result.isConfirmed) {
            archiveNote(note.id);
          }
        });
    });
  };

  getNotesNonArchived();

  const form = document.querySelector("#addNote");
  const titleInput = document.querySelector("#inputNoteTitle");
  const descriptionInput = document.querySelector("#inputNoteDescription");
  const titleError = document.querySelector("#titleError");
  const descriptionError = document.querySelector("#descriptionError");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (validateForm()) {
      addNote();
    }
  });

  titleInput.addEventListener("input", () => {
    validateTitle(titleInput, titleError);
  });

  titleInput.addEventListener("focus", () => {
    validateTitle(titleInput, titleError);
  });

  descriptionInput.addEventListener("input", () => {
    validateDescription(descriptionInput, descriptionError);
  });

  descriptionInput.addEventListener("focus", () => {
    validateDescription(descriptionInput, descriptionError);
  });

  function validateForm() {
    const isTitleValid = validateTitle(titleInput, titleError);
    const isDescriptionValid = validateDescription(
      descriptionInput,
      descriptionError
    );

    return isTitleValid && isDescriptionValid;
  }

  function validateTitle(input, errorElement) {
    if (input.value === "") {
      errorElement.innerText = "Judul tidak boleh kosong.";
      return false;
    }

    errorElement.innerText = "";
    return true;
  }

  function validateDescription(input, errorElement) {
    if (input.value === "") {
      errorElement.innerText = "Deskripsi tidak boleh kosong.";
      return false;
    }

    errorElement.innerText = "";
    return true;
  }

  function addNote() {
    const title = titleInput.value;
    const description = descriptionInput.value;

    if (title && description) {
      const note = {
        title: title,
        body: description,
      };

      createNote(note);

      titleInput.value = "";
      descriptionInput.value = "";
    }
  }
}

export default main;
