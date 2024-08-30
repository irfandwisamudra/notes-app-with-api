class LoadingIndicator extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    const wrapper = document.createElement('div');
    wrapper.setAttribute('class', 'loading-wrapper');
    wrapper.innerHTML = `
      <style>
        .loading-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          z-index: 1000;
        }
        .spinner {
        border: 8px solid #f3f3f3;
        border-radius: 50%;
        border-top: 8px solid var(--primary-color);
        width: 60px;
        height: 60px;
        animation: spin 2s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
      <div class="spinner"></div>
    `;
    shadow.appendChild(wrapper);
  }
}

customElements.define('loading-indicator', LoadingIndicator);
