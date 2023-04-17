(() => {
  const dialog = document.querySelector('dialog')!;
  dialog.addEventListener('click', (e) => {
    const outside = (x:number, y: number) => {
      const {top, right, bottom, left} = dialog.getBoundingClientRect();
      return y < top || y > bottom || x < left || x > right;
    }
    if (outside(e.clientX, e.clientY)) dialog.close();
  });
  dialog.querySelector('.closer')!.addEventListener('click', () => dialog.close());
  document.querySelector(".indicator")?.addEventListener('click', () => {
    dialog.querySelector('.image-pop-alt')!.textContent = dialog.querySelector('img')?.alt ?? '';
    dialog.showModal();
  });
})();