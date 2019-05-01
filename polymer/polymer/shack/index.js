import './elements/shack-app.js';

(async function() {
  const categories = {
    'mens_outerwear': {
      title: 'Men\'s Outerwear',
    },
    'ladies_outerwear': {
      title: 'Ladies Outerwear',
    },
    'mens_tshirts': {
      title: 'Men\'s T-Shirts',
    },
    'ladies_tshirts': {
      title: 'Ladies T-Shirts',
    },
  };

  const promises = [];
  for (const c in categories) {
    promises.push((async () => {
      const resp = await fetch(`./${c}.json`);
      categories[c].items = await resp.json();
      categories[c].slug = c;
    })());
  }
  await Promise.all(promises);

  const app = document.createElement('shack-app');
  app.page = 'mens_tshirts';
  app.categories = categories;
  document.body.appendChild(app);
})();
