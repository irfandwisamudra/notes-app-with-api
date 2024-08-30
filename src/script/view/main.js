import Swal from 'sweetalert2';
import { gsap } from 'gsap';

function main() {
  const baseUrl = 'https://notes-api.dicoding.dev/v2';

  const createNote = async (note) => {
    const loadingIndicator = document.createElement('loading-indicator');
    document.body.appendChild(loadingIndicator);

    try {
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(note),
      };

      const response = await fetch(`${baseUrl}/notes`, options);
      const responseJson = await response.json();

      setTimeout(() => {
        showResponseMessage(responseJson.status, responseJson.message);
        getNotesNonArchived();
      }, 1000);
    } catch (error) {
      setTimeout(() => {
        showResponseMessage('error', error.message);
      }, 1000);
    } finally {
      document.body.removeChild(loadingIndicator);
    }
  };

  const getNotesNonArchived = async () => {
    try {
      const response = await fetch(`${baseUrl}/notes`);
      const responseJson = await response.json();
      if (responseJson.error) {
        showResponseMessage(responseJson.status, responseJson.message);
      } else {
        renderNonArchivedNotes(responseJson.data);
      }
    } catch (error) {
      showResponseMessage('error', error.message);
    }
  };

  const getArchivedNotes = async () => {
    try {
      const response = await fetch(`${baseUrl}/notes/archived`);
      const responseJson = await response.json();
      if (responseJson.error) {
        showResponseMessage(responseJson.status, responseJson.message);
      } else {
        renderArchivedNotes(responseJson.data);
      }
    } catch (error) {
      showResponseMessage('error', error.message);
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
      showResponseMessage('error', error.message);
    }
  };

  const archiveNote = async (noteId) => {
    const loadingIndicator = document.createElement('loading-indicator');
    document.body.appendChild(loadingIndicator);

    try {
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const response = await fetch(
        `${baseUrl}/notes/${noteId}/archive`,
        options
      );
      const responseJson = await response.json();

      showResponseMessage(responseJson.status, responseJson.message);
      getNotesNonArchived();
      getArchivedNotes();
    } catch (error) {
      showResponseMessage('error', error.message);
    } finally {
      document.body.removeChild(loadingIndicator);
    }
  };

  const unarchiveNote = async (noteId) => {
    const loadingIndicator = document.createElement('loading-indicator');
    document.body.appendChild(loadingIndicator);

    try {
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const response = await fetch(
        `${baseUrl}/notes/${noteId}/unarchive`,
        options
      );
      const responseJson = await response.json();

      showResponseMessage(responseJson.status, responseJson.message);
      getNotesNonArchived();
      getArchivedNotes();
    } catch (error) {
      showResponseMessage('error', error.message);
    } finally {
      document.body.removeChild(loadingIndicator);
    }
  };

  const deleteNote = async (noteId) => {
    const loadingIndicator = document.createElement('loading-indicator');
    document.body.appendChild(loadingIndicator);

    try {
      const options = {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const response = await fetch(`${baseUrl}/notes/${noteId}`, options);
      const responseJson = await response.json();

      showResponseMessage(responseJson.status, responseJson.message);
      getNotesNonArchived();
      getArchivedNotes();
    } catch (error) {
      showResponseMessage('error', error.message);
    } finally {
      document.body.removeChild(loadingIndicator);
    }
  };

  const showResponseMessage = (status, message) => {
    Swal.fire({
      position: 'top-end',
      icon: status,
      title: message,
      showConfirmButton: false,
      timer: 1500,
    });
  };

  const renderNonArchivedNotes = (notes) => {
    const listNote = document.getElementById('listNote');
    listNote.innerHTML = '';

    if (notes.length === 0) {
      listNote.innerHTML = '<p>Tidak ada catatan yang tersedia.</p>';
      return;
    }

    const sortedNotes = notes.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    sortedNotes.forEach((note, index) => {
      const noteItem = document.createElement('div');
      noteItem.className = 'note-item';
      noteItem.innerHTML = `
        <button class="delete-button" data-id="${note.id}">&times;</button>
        <h5>${note.title}</h5>
        <p>${note.body}</p>
        <small>${new Date(note.createdAt).toLocaleString()}</small>
        <button class="archive-button" data-id="${note.id}">Arsipkan</button>
      `;
      listNote.appendChild(noteItem);

      gsap.from(noteItem, {
        opacity: 0,
        y: 50,
        scale: 0.8,
        rotation: 10,
        duration: 0.6,
        delay: index * 0.1,
        ease: 'back.out(1.7)',
      });

      noteItem
        .querySelector('.delete-button')
        .addEventListener('click', async () => {
          const result = await Swal.fire({
            title: 'Konfirmasi Hapus',
            text: 'Apakah Anda yakin ingin menghapus catatan ini?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal',
          });
          if (result.isConfirmed) {
            deleteNote(note.id);
          }
        });

      noteItem
        .querySelector('.archive-button')
        .addEventListener('click', async () => {
          archiveNote(note.id);
        });
    });
  };

  getNotesNonArchived();
  getArchivedNotes();

  const form = document.querySelector('#addNote');
  const titleInput = document.querySelector('#inputNoteTitle');
  const descriptionInput = document.querySelector('#inputNoteDescription');
  const titleError = document.querySelector('#titleError');
  const descriptionError = document.querySelector('#descriptionError');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (validateForm()) {
      addNote();
    }
  });

  titleInput.addEventListener('input', () => {
    validateTitle(titleInput, titleError);
  });

  titleInput.addEventListener('focus', () => {
    validateTitle(titleInput, titleError);
  });

  descriptionInput.addEventListener('input', () => {
    validateDescription(descriptionInput, descriptionError);
  });

  descriptionInput.addEventListener('focus', () => {
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
    if (input.value === '') {
      errorElement.innerText = 'Judul tidak boleh kosong.';
      return false;
    }

    errorElement.innerText = '';
    return true;
  }

  function validateDescription(input, errorElement) {
    if (input.value === '') {
      errorElement.innerText = 'Deskripsi tidak boleh kosong.';
      return false;
    }

    errorElement.innerText = '';
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

      titleInput.value = '';
      descriptionInput.value = '';
    }
  }

  function openModal() {
    document.getElementById('archivedModal').style.display = 'block';
  }

  function closeModal() {
    document.getElementById('archivedModal').style.display = 'none';
  }

  document
    .getElementById('archivedButton')
    .addEventListener('click', openModal);
  document.querySelector('.close').addEventListener('click', closeModal);

  function renderArchivedNotes(notes) {
    const listArchivedNote = document.getElementById('listArchivedNote');
    listArchivedNote.innerHTML = '';

    if (notes.length === 0) {
      listArchivedNote.innerHTML = '<p>Tidak ada catatan yang diarsipkan.</p>';
      return;
    }

    const sortedNotes = notes.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    sortedNotes.forEach((note, index) => {
      const noteItem = document.createElement('div');
      noteItem.className = 'note-item';
      noteItem.innerHTML = `
        <button class="delete-button" data-id="${note.id}">&times;</button>
        <h5>${note.title}</h5>
        <p>${note.body}</p>
        <small>${new Date(note.createdAt).toLocaleString()}</small>
        <button class="unarchive-button" data-id="${note.id}">Unarchive</button>
      `;
      listArchivedNote.appendChild(noteItem);

      gsap.from(noteItem, {
        opacity: 0,
        y: 50,
        scale: 0.8,
        rotation: 10,
        duration: 0.6,
        delay: index * 0.1,
        ease: 'back.out(1.7)',
      });

      noteItem
        .querySelector('.delete-button')
        .addEventListener('click', async () => {
          const result = await Swal.fire({
            title: 'Konfirmasi Hapus',
            text: 'Apakah Anda yakin ingin menghapus catatan ini?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal',
          });
          if (result.isConfirmed) {
            deleteNote(note.id);
          }
        });

      noteItem
        .querySelector('.unarchive-button')
        .addEventListener('click', async () => {
          unarchiveNote(note.id);
        });
    });
  }
}

export default main;
