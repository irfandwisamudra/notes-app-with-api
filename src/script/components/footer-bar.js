class FooterBar extends HTMLElement {
  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: "open" });
    this._style = document.createElement("style");
  }

  _updateStyle() {
    this._style.textContent = `
      .footer-inner {
        display: grid;
        grid-template-columns: 1fr min-content;
        align-items: center;
        padding: 1rem 0;
      }

      .footer-inner .copyright a {
        display: grid;
        grid-template-columns: min-content 1fr;
        align-items: center;
        color: var(--primary-color);
        text-decoration: none;
        width: fit-content;
      }

      .footer-inner .copyright a:hover {
        color: blue;
        text-decoration: underline;
      }

      .footer-inner .copyright img {
        height: 30px;
      }

      .footer-inner .social-media {
        display: grid;
        grid-template-columns: repeat(4, min-content);
        gap: 1rem;
      }

      .footer-inner .social-media li {
        list-style: none;
      }

      .footer-inner .social-media li a {
        color: var(--primary-color);

      }

      .footer-inner .social-media li a:hover {
        color: blue;
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

      <div class="footer-inner">
        <div class="copyright">
          <a href="/">
            <img src="images/logo.png" alt="Notes App" />
            <span>&copy; Notes App</span>
          </a>
        </div>

        <ul class="social-media">
          <li>
            <a href="https://github.com/irfandwisamudra" target="_blank">
              <i class="fab fa-github fa-lg"></i>
            </a>
          </li>
          <li>
            <a href="https://www.linkedin.com/in/irfandwisamudra" target="_blank">
              <i class="fab fa-linkedin fa-lg"></i>
            </a>
          </li>
          <li>
            <a href="https://www.instagram.com/irfandw.s" target="_blank">
              <i class="fab fa-instagram fa-lg"></i>
            </a>
          </li>
          <li>
            <a href="https://twitter.com/IrfanDwiSamudra" target="_blank">
              <i class="fab fa-twitter fa-lg"></i>
            </a>
          </li>
        </ul>
      </div>
    `;
  }
}

customElements.define("footer-bar", FooterBar);
