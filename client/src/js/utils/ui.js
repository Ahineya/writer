export const createButton = (className, content, onClick) => {
  const btn = document.createElement('button');
  btn.innerHTML = content;
  btn.className = className;
  btn.addEventListener('click', onClick);
  return btn;
};

export const hide = (...elems) => elems.forEach(e => e.classList.add('hidden'));
export const show = (...elems) => elems.forEach(e => e.classList.remove('hidden'));
