import { signOut } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js';
import { initSignOut, initUserInfo } from './common.js';
import { app, auth } from './firebase-init.js';
import config from './config.js';

const stars = document.querySelectorAll(".star");
const emoji = document.querySelector(".emoji");
const rating = document.querySelector(".rating");
const defaultRatingIndex = 0;
let currentRatingIndex = 0;
let currentUser = '';
let currentData = [];
let currentSourceId = '';

const ratings = [
  { emoji: "😐", status: "Rating" },
  { emoji: "😡", status: "Bad" },
  { emoji: "😔", status: "Average" },
  { emoji: "😊", status: "Good" },
  { emoji: "😃", status: "Very Good" },
  { emoji: "🤩", status: "Excellent" }
];

function setRating(index) {
  stars.forEach((star) => {
    star.classList.remove("selected");
  });

  if (index > 0 && index <= stars.length) {
    document.querySelector(`[data-rate="${index}"]`).classList.add("selected");
  }
  emoji.innerHTML = ratings[index].emoji;
  rating.innerHTML = ratings[index].status;
}

function checkRating(star) {
  if (parseInt(star.getAttribute("data-rate")) === currentRatingIndex) {
    return true;
  } else {
    return false;
  }
}

function resetRating() {
  $(".save-btn").prop( "disabled", true);
  currentRatingIndex = defaultRatingIndex;
  setRating(defaultRatingIndex);
}

function renderStars() {
  stars.forEach((star) => {
    star.addEventListener("click", () => {
      if (checkRating(star)) {
        resetRating();
        return;
      }
      const index = parseInt(star.getAttribute("data-rate"));
      currentRatingIndex = index;
      const currentSlideIndex = $('.slider').slick('slickCurrentSlide');
      currentSourceId = currentData && currentData[currentSlideIndex] ? currentData[currentSlideIndex].source_id : '';
      $(".save-btn").prop( "disabled", false);
      setRating(index);
    });
  
    star.addEventListener("mouseover", () => {
      const index = parseInt(star.getAttribute("data-rate"));
      setRating(index);
    });
  
    star.addEventListener("mouseout", () => {
      setRating(currentRatingIndex);
    });
  });
}

function initData() {
  $('.lds-ring').show();
  $('.info').hide();
  axios.get(`${config.API_ENDPOINT}/rating_ui/${currentUser}`)
  .then(function (response) {
    $('.info').show();
    const { data = [] } = response?.data;
    currentData = data;
    let htmlContent = '';
    data.forEach(item => {
      htmlContent += `
      <div data-source="${item.source_id}">
        <p class="prompt">${item.promt ? '"' + item.promt + '"' : ''}</p>
        <a href="${item.url}" target="_blank">
          <img src="${item.url}" alt="${item.promt}">
        </a>
      </div>
      `
    });
    $('#slider').html(htmlContent);
    renderSlide();
  })
  .catch(function (error) {
    $('#slider').html('<p class="error">Data load failed. Something was wrong!!!</p>');
    console.log(error);
  })
  .finally(function () {
    $('.lds-ring').hide();
  });
}

function renderSlide() {
  $(".slider").slick({
    infinite: true,
    autoplaySpeed: 2000,
  });
}

function initFeedBackEvent() {
  $(".feedback-question").click(function() {
    $(".feedback-input").toggle();
  });
}

function initSaveEvent() {
  $(".save-btn").click(function(e) {
    e.preventDefault();
    $('.save').html('<p>Saving...</p>');
    axios.post(`${config.API_ENDPOINT}/saving_ui/`, {
      "source_id": currentSourceId,
      "username": currentUser,
      "rating": currentRatingIndex,
      "comment": $('.feedback-textarea').val()
    })
    .then(function (response) {
      $('.save').html('<p class="success">Your rating was saved successfully!</p>');
      setTimeout(() => {
        const currentSlideIndex = $('.slider').slick('slickCurrentSlide');
        $('.slider').slick('slickRemove', currentSlideIndex);
        // $(".slider").slick("slickNext");
        $('.save').html('<button class="save-btn">SAVE</button>');
        resetRating();
        initSaveEvent();
      }, 1000);
    })
    .catch(function (error) {
      $('.save').html('<p class="error">Your rating was failed!!!</p>');
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  currentUser = initUserInfo();
  initSignOut();
  initData();
  renderStars();
  setRating(defaultRatingIndex);
  initFeedBackEvent();
  initSaveEvent();
});

