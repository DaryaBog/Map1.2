function createModal(img, title, content) {
    const modalEl = document.createElement('div');
    modalEl.classList.add('modal')

    const html = `
    <div class="modal-img">${img}</div>
    <h1>${title}</h1>
    <div class="modal-content">${content}</div>
    `

    modalEl.innerHTML = html
    // show modal
    mui.overlay('on', modalEl);
}