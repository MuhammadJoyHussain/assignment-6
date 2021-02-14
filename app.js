const imagesArea = document.querySelector('.images');
const gallery = document.querySelector('.gallery');
const galleryHeader = document.querySelector('.gallery-header');
const searchBtn = document.getElementById('search-btn');
const sliderBtn = document.getElementById('create-slider');
const sliderContainer = document.getElementById('sliders');
// selected image 
let sliders = [];


// If this key doesn't work
// Find the name in the url and go to their website
// to create your own api key
const KEY = '20265275-0e041e1a32005f9080894766a';


// show images 
const showImages = (images) => {
    imagesArea.style.display = 'block';
    gallery.innerHTML = '';
    // show gallery title
    galleryHeader.style.display = 'flex';
    images.forEach(image => {
        let div = document.createElement('div');
        div.className = 'col-lg-3 col-md-4 col-xs-6 img-item mb-2';
        div.innerHTML = ` <img class="img-fluid img-thumbnail"
        ondblclick=viewImage() onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">`;
        gallery.appendChild(div);
        toggleSpinner();

    })

}

const getImages = () => {
    toggleSpinner();
    const search = document.getElementById('search').value;
    fetch(`https://pixabay.com/api/?key=${KEY}&q=${search}`)
        .then(response => response.json())
        .then(data => showImages(data.hits))
        .catch(err => console.log(err))
}

let slideIndex = 0;
const selectItem = (event, img) => {
    let element = event.target;
    let item = sliders.indexOf(img);
    if (item === -1) {
        element.classList.add('added');
        sliders.push(img);
    } else {
        element.classList.remove('added');
        sliders.pop(img);
    }
}
var timer
const createSlider = () => {
    // check slider image length
    if (sliders.length < 2) {
        alert('Select at least 2 image.')
        return;
    }
    // crate slider previous next area
    sliderContainer.innerHTML = '';
    const prevNext = document.createElement('div');
    prevNext.className = "prev-next d-flex w-100 justify-content-between align-items-center";
    prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

    sliderContainer.appendChild(prevNext)
    document.querySelector('.main').style.display = 'block';
    // hide image aria
    imagesArea.style.display = 'none';
    const duration = document.getElementById('duration').value;
    if (duration < 0) {
        document.getElementById('duration').value = +1;
    } else {
        sliders.forEach(slide => {
            let item = document.createElement('div')
            item.className = "slider-item";
            item.innerHTML = `<img class="w-100"
        src="${slide}"
        alt="">`;
            sliderContainer.appendChild(item)
            toggleSpinner()

        })

    }

    changeSlide(0)
    timer = setInterval(function() {
        slideIndex++;
        changeSlide(slideIndex);
    }, duration);
}

// change slider index 
const changeItem = index => {
    changeSlide(slideIndex += index);
}

// change slide item
const changeSlide = (index) => {

    const items = document.querySelectorAll('.slider-item');
    if (index < 0) {
        slideIndex = items.length - 1
        index = slideIndex;
    };

    if (index >= items.length) {
        index = 0;
        slideIndex = 0;
    }

    items.forEach(item => {
        item.style.display = "none"
    })

    items[index].style.display = "block"
}

searchBtn.addEventListener('click', function() {
    document.querySelector('.main').style.display = 'none';
    clearInterval(timer);
    const search = document.getElementById('search');
    getImages(search.value)
    sliders.length = 0;
})

sliderBtn.addEventListener('click', function() {
    toggleSpinner();
    createSlider();
})


document.getElementById('search').addEventListener('keypress', function(event) {
    if (event.key == 'Enter') {
        document.getElementById('search-btn').click();
    }
});

const toggleSpinner = () => {
    const spinner = document.getElementById('loading-spinner');
    spinner.classList.toggle('d-none');


}

function viewImage() {
    fetch(`https://pixabay.com/api/?key=${KEY}`)
        .then(response => response.json())
        .then(data => findDetail(data.hits));
}
const find = document.getElementById('find');
const findDetail = (image) => {
    let html = `
    <div class = "image-img">
    <img src = "${image.pageURL}" alt = "">
    </div>
    <div class = "image-instruct">
    <h3>Details:</h3>
    <p>${image.comment}</p>
    <p>${image.like}</p>
    </div>
    `;
    find.innerHTML = html;
    find.classList.add('show-img');
}