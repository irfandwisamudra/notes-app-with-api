import Notes from "../data/local/notes.js";

class SearchNote extends HTMLElement {
  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: "open" });
    this._style = document.createElement("style");
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
      .search-note h4 {
        margin: 0 0 10px 0;
        font-size: 1.5em;
        color: var(--primary-color);
      }

      .search-note .form-label {
        display: block;
        margin: 0 0 5px 0;
        font-size: 1em;
        color: var(--dark-color);
        width: fit-content;
      }

      .search-note .input-group {
        display: grid;
        grid-template-columns: 1fr min-content;
      }

      .search-note .form-control {
        border-radius: 5px 0 0 5px;
        padding: 10px;
        background-color: var(--light-color);
        color: var(--dark-color);
        border: 1px solid var(--tertiary-color);
        box-sizing: border-box;
        outline: none;
      }

      .search-note .form-control:focus {
        border: 1px solid var(--tertiary-color);
        box-shadow: 0 0 0 0.25rem rgba(0, 74, 173, 0.25);
      }

      .search-button {
        padding: 10px;
        border-radius: 0 5px 5px 0;
        background-color: var(--primary-color);
        color: var(--light-color);
        cursor: pointer;
        border: none;
      }

      .search-button:hover {
        background-color: blue;
      }

      .search-button:focus {
        box-shadow: 0 0 0 0.25rem rgba(0, 74, 173, 0.25);
      }
    `;
  }

  _emptyContent() {
    this._shadowRoot.innerHTML = "";
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this._emptyContent();
    this._updateStyle();
    this._shadowRoot.appendChild(this._style);

    this._shadowRoot.innerHTML += `
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
      />

      <section class="search-note">
        <h4>${this._title}</h4>
        <form id="searchNote" novalidate>
          <label class="form-label" for="searchNoteTitle">Judul</label>
          <div class="input-group">
            <input
              class="form-control"
              id="searchNoteTitle"
              type="text"
              name="keyword"
              enterkeyhint="search"
              autocomplete="off"
            />
            <button class="search-button" type="submit">
              <i class="fa-solid fa-magnifying-glass"></i>
            </button>
          </div>
        </form>
      </section>
    `;

    this._shadowRoot
      .querySelector("#searchNote")
      .addEventListener("submit", (event) => {
        event.preventDefault();
        this.searchNotes();
      });
  }

  searchNotes() {
    const query = this._shadowRoot.querySelector("#searchNoteTitle").value;
    const results = Notes.searchNotes(query);
    this.renderResults(results);
  }

  renderResults(notes) {
    const event = new CustomEvent("notes-updated", { detail: { notes } });
    document.dispatchEvent(event);
  }
}

customElements.define("search-note", SearchNote);
