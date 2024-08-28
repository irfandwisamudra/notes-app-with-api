class HeaderBar extends HTMLElement {
  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: "open" });
    this._style = document.createElement("style");
  }

  _updateStyle() {
    this._style.textContent = `
      .header-inner {
        position: relative;
      }

      .carousel {
        width: 100%;
        height: 300px;
        overflow: hidden;
      }

      .slide {
        display: none;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .jumbotron {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 100%;
        height: 100%;
        display: grid;
        align-items: center;
        text-align: center;
        backdrop-filter: blur(10px);
        background-color: rgba(255, 255, 255, 0.5);
      }

      .jumbotron img {
        height: 150px;
      }

      .jumbotron h1 {
        margin: 10px 0;
        font-size: 2em;
        color: var(--primary-color);
      }

      .jumbotron h2 {
        margin: 10px 0;
        font-size: 1.2em;
        color: var(--secondary-color);
      }
    `;
  }

  connectedCallback() {
    this.render();
    this.startCarousel();
  }

  render() {
    this._shadowRoot.innerHTML = `
      <div class="header-inner">
        <div class="carousel">
          <img
            class="slide"
            src="images/man-taking-notes.jpg"
            alt="Slide 1"
          />
          <img
            class="slide"
            src="images/note-taking.jpg"
            alt="Slide 2"
          />
          <img
            class="slide"
            src="images/pen-writing-notes.jpg"
            alt="Slide 3"
          />
        </div>
        <div class="jumbotron">
          <div class="container">
            <a href="/">
              <img src="images/logo.png" alt="Notes Apps" />
            </a>
            <h1>Notes App</h1>
            <h2>Tulis dan simpan catatanmu disini.</h2>
          </div>
        </div>
      </div>
    `;

    this._shadowRoot.appendChild(this._style);
    this._updateStyle();
  }

  startCarousel() {
    const slides = this._shadowRoot.querySelectorAll(".slide");
    let currentSlide = 0;

    const showSlide = (index) => {
      slides.forEach((slide) => {
        slide.style.display = "none";
      });

      slides[index].style.display = "block";
    };

    const nextSlide = () => {
      currentSlide++;
      if (currentSlide >= slides.length) {
        currentSlide = 0;
      }
      showSlide(currentSlide);
    };

    showSlide(currentSlide);
    setInterval(nextSlide, 3000);
  }
}

customElements.define("header-bar", HeaderBar);
