import Notes from "../data/local/notes.js";

class ListNote extends HTMLElement {
  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: "open" });
    this._style = document.createElement("style");
    this._notes = Notes.getAllNotes();
    this._title = this.getAttribute("title") || "NEED SECTION TITLE";
  }

  static get observedAttributes() {
    return ["title"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "title") {
      this._title = newValue;
      this.render();
    }
  }

  _updateStyle() {
    this._style.textContent = `
      .list-note h4 {
        margin: 0 0 10px 0;
        font-size: 1.5em;
        color: var(--primary-color);
      }

      #listNote {
        display: grid;
        gap: 1.5rem;
        grid-template-columns: 1fr 1fr;
      }

      .note-item {
        padding: 1rem;
        border-radius: 5px;
        background-color: var(--light-color);
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        position: relative;
      }

      .note-item h5 {
        margin: 0 0 10px 0;
        font-size: 1.2em;
        color: var(--secondary-color);
      }

      .note-item p {
        margin: 0 0 10px 0;
        font-size: 1em;
        color: var(--dark-color);
      }

      .note-item small {
        font-size: 0.8em;
        color: var(--dark-color);
      }

      .note-item .delete-button {
        position: absolute;
        top: -10px;
        right: -10px;
        background: red;
        color: white;
        border: none;
        border-radius: 50%;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      }

      .note-item .delete-button:hover {
        background: darkred;
      }

      @media (max-width: 1200px) {
        #listNote {
          grid-template-columns: 1fr;
        }
      }
    `;
  }

  _emptyContent() {
    this._shadowRoot.innerHTML = "";
  }

  connectedCallback() {
    this.render();
    this._registerEvents();
  }

  render() {
    this._emptyContent();
    this._updateStyle();
    this._shadowRoot.appendChild(this._style);

    this._shadowRoot.innerHTML += `
      <div class="list-note">
        <section>
          <h4>${this._title}</h4>
          <div id="listNote"></div>
        </section>
      </div>
    `;
    this._renderNotes(this._notes);
  }

  _renderNotes(notes) {
    const listNote = this._shadowRoot.getElementById("listNote");
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
      `;
      listNote.appendChild(noteItem);
    });
  }

  _registerEvents() {
    this._shadowRoot.addEventListener("click", async (event) => {
      if (event.target.classList.contains("delete-button")) {
        const noteId = event.target.getAttribute("data-id");
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
          this._deleteNote(noteId);
        }
      }
    });

    document.addEventListener("notes-updated", (event) => {
      this._notes = event.detail.notes;
      this._renderNotes(this._notes);
    });
  }

  async _deleteNote(noteId) {
    const noteIndex = this._notes.findIndex((note) => note.id === noteId);
    if (noteIndex !== -1) {
      const result = await Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Catatan berhasil dihapus!",
        showConfirmButton: false,
        timer: 1500,
      });
      this._notes.splice(noteIndex, 1);
      document.dispatchEvent(
        new CustomEvent("notes-updated", { detail: { notes: this._notes } })
      );
      this._renderNotes(this._notes);
    }
  }
}

customElements.define("list-note", ListNote);
