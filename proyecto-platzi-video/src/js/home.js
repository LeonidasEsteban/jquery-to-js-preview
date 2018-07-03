$.ajax('https://randomuser.me/api/', {
  method: 'GET',
  success: function(data) {
    console.log(data);
  },
  error: function(err) {
    console.log('error', err)
  }
})

const getUser = new Promise(function(todoBien, todoMal) {
  // setTimeout()
  // todoBien();
  // todoMal('todo mal');
})

getUser
  .then(() => {
    console.log('todo está bien');
  })
  .catch((mensaje) => {
    console.log(mensaje);
  })
fetch('https://randomuser.me/api/')
  .then((response) => {
    // debugger
    return response.json();
  })
  .then((data) => {
    datosDelUsuario(data);
  })
  .catch((err) =>{
    console.log(err)
  })
function datosDelUsuario(data) {
  console.log(data.results[0].name.first);
}


(async function load() {


  // async function getRandomUser(url) {
  //   console.log(`%c pidiendo user ${url}`, 'background: green; color: white' );
  //   try {
  //     const response = await fetch('https://randomuser.me/api', {
  //       mode: 'no-cors'
  //     });
  //     debugger
  //     const data = await response.json();
  //     return data.results[0];
  //   } catch (err) {
  //     debugger
  //   }
  // }
  // const users = await Promise.all([
  //   getRandomUser(),
  //   getRandomUser(),
  //   getRandomUser(),
  //   getRandomUser(),
  //   getRandomUser(),
  //   getRandomUser(),
  // ])
  // const user = getRandomUser();
  // debugger
  async function getData(url) {
    console.log(`%c pidiendo datos ${url}`, 'background: red; color: white' );
    const response = await fetch(url);
    const data = await response.json();
    if (data.data.movie_count > 0) {
      return data;
    }
    throw new Error('No se encontró ningun resultado');
  }
  // async function getMovieList() {
  //   const response = await fetch('https://yts.am/api/v2/list_movies.json?genre=action');
  //   const data = await response.json();
  //   return data;
  // }
  //



  function createTemplate(HTMLString) {
    const html = document.implementation.createHTMLDocument();
    html.body.innerHTML = HTMLString;
    return html.body.children[0];
  }

  function videoItemTemplate(data, category) {
    return (`
      <div class="primaryPlaylistItem" data-category=${category} data-id=${data.id}>
        <div class="primaryPlaylistItem-image">
          <img src="${data.medium_cover_image}">
        </div>
        <h4 class="primaryPlaylistItem-title">
          ${data.title}
        </h4>
      </div>
    `)
  }

  // const $actionContainer = document.querySelector('#action')


  // actionList.movies.forEach(movie => {
  //   const HTMLString = videoItemTemplate(movie);
  //   const movieElement = createTemplate(HTMLString);
  //   $actionContainer.appendChild(movieElement);
  // })
  //
  function renderMovieList(list, $container, category) {
    $container.children[0].remove();
    list.forEach(movie => {
      const HTMLString = videoItemTemplate(movie, category);
      const movieElement = createTemplate(HTMLString);
      $container.appendChild(movieElement);
      // debugger
      const image = movieElement.querySelector('img');
      image.addEventListener('load', function(event){
        event.srcElement.classList.add('fadeIn');
      })
      // movieElement.classList.add('fadeIn')
    })
  }
  const $actionContainer = document.querySelector('#action');
  const $dramaContainer = document.querySelector('#drama');
  const $animationContainer = document.querySelector('#animation');

  async function cacheExist(category) {
    const listName = `${category}List`;
    const cacheList = localStorage.getItem(listName);
    if (cacheList) {
      return JSON.parse(cacheList);
    }
    // return false
    // hacer peticiones
    const { data: { movies: data } } = await getData(`https://yts.am/api/v2/list_movies.json?genre=${category}`)
    localStorage.setItem(listName, JSON.stringify(data));

    return data
  }

  // const { data: { movies: actionList } } = await getData('https://yts.am/api/v2/list_movies.json?genre=action');
  const actionList = await cacheExist('action');
  renderMovieList(actionList, $actionContainer, 'action')

  // const { data: { movies: dramaList } } = await getData('https://yts.am/api/v2/list_movies.json?genre=drama');
  const dramaList = await cacheExist('drama');
  renderMovieList(dramaList, $dramaContainer, 'drama')

  // const { data: { movies: animationList } } = await getData('https://yts.am/api/v2/list_movies.json?genre=animation');
  const animationList = await cacheExist('animation');
  renderMovieList(animationList, $animationContainer, 'animation')


  const $movieList = document.querySelectorAll('.primaryPlaylistItem');
  $movieList.forEach((element) => {
    // element.addEventListener('click', () => {
    //   alert(element.querySelector('.primaryPlaylistItem-title').textContent)
    // })

    element.addEventListener('click', () => {
      showModal(element);
    });

  })

  function findMovie(id, category) {
    function find(list, id) {
      return list.find(item => item.id === parseInt(id, 10))
    }
    switch(category) {
      case 'action' : {
        return find(actionList, id)
      }
      case 'drama': {
        return find(dramaList, id)
      }
      default: {
        return find(animationList, id)
      }
    }
  }

  const $featuring = document.querySelector('#featuring');

  function featuringTemplate(data) {
    return (`
      <div class="featuring">
        <div class="featuring-image">
          <img src="${data.medium_cover_image}" width="70" height="100" alt="">
        </div>
        <div class="featuring-content">
          <p class="featuring-title">Pelicula encontrada</p>
          <p class="featuring-album">${data.title}</p>
        </div>
      </div>
    `)
  }
  const BASE_API = 'https://yts.am/api/v2/'

  // async function getData(url) {
  //   const response = await fetch(url);
  //   const data = await response.json();
  //   return data;
  // }

  $form = document.querySelector('#form');

  function setAttributes($element, attributes) {

    // attributes.forEach((attribute, index) => {
    //   $element.setAttribute(attribute.attribute, attribute.value)
    // })

    // [
    //   {
    //     'attribute':  'src',
    //     'value': 'sdfsdfsd'
    //   },
    // ]

    for (const key in attributes) {
      $element.setAttribute(key, attributes[key])
    }

    // const data = {
    //   src: 'sfssd',
    //   height: 50
    // }


  }
  const $home = document.querySelector('#home');

  $form.addEventListener('submit', async (event) => {
    event.preventDefault();
    $home.classList.add('search-active');
    const $loader = document.createElement('img');
    // $loader.setAttribute('src', 'src/images/loader.gif');
    // $loader.setAttribute('height', 50);
    // $loader.setAttribute('width', 50);
    setAttributes($loader, {
      src: 'src/images/loader.gif',
      height: 50,
      width: 50
    })

    $featuring.append($loader)
    const data = new FormData($form);

    try {
      const { data: { movies: pelis } } = await getData(`${BASE_API}list_movies.json?limit=1&query_term=${data.get('name')}`);
      const HTMLString = featuringTemplate(pelis[0]);
      // const movieElement = createTemplate(HTMLString);
      $featuring.innerHTML = HTMLString;
    } catch (error) {
      alert(error.message)
      $loader.remove();
      $home.classList.remove('search-active');
    }

  });


  // Modal

  const $hideButton = document.getElementById('hide-modal');
  const $modal = document.getElementById('modal');
  const $overlay = document.getElementById('overlay');

  // modal content
  const $modalTitle = $modal.querySelector('h1');
  const $modalImage = $modal.querySelector('img');
  const $modalDescription = $modal.querySelector('p');

  $hideButton.addEventListener('click', hideModal);
  function showModal(element) {
    $modal.style.animation = 'modalIn .8s forwards';
    $overlay.classList.add('active');

    // agregar contenido
    // const id = element.getAttribute('data-id');
    const id = element.dataset.id;
    // const category = element.getAttribute('data-category');
    const category = element.dataset.category;
    const data = findMovie(id, category)
    $modalDescription.textContent = data.description_full;
    $modalTitle.textContent = data.title;
    $modalImage.setAttribute('src', data.medium_cover_image);
  }
  function hideModal() {
    $modal.style.animation = 'modalOut .8s forwards';
    $overlay.classList.remove('active');
  }




})();
// load();
