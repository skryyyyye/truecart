export const FALLBACK_PRODUCT_IMAGE =
  "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400' fill='%23f8fafc'><rect width='400' height='400' fill='%23f1f5f9'/><path d='M140 160h120l15 150H125z' fill='%23cbd5e1'/><path d='M160 160a40 40 0 0 1 80 0' fill='none' stroke='%2394a3b8' stroke-width='12' stroke-linecap='round'/><circle cx='200' cy='235' r='18' fill='%230284c7'/><text x='200' y='350' font-family='sans-serif' font-size='14' font-weight='600' fill='%2364748b' text-anchor='middle'>TrueCart Verified Item</text></svg>";

export const handleImageError = (e) => {
  if (e.target.src !== FALLBACK_PRODUCT_IMAGE) {
    e.target.src = FALLBACK_PRODUCT_IMAGE;
  }
};

