import { initSignOut, initUserInfo } from './common.js';
import config from './config.js';
let currentUser = '';
let currentIdx = '';
let currentData = null;
let currentRate = 0;

function initRatingData(data) {
  data.forEach((item, index) => {
    $(".my-rating-"+index).starRating({
      useFullStars: true,
      starSize: 20,
      initialRating: item.rating || 0,
      callback: function(currentRating, $el){
        axios.put(`${config.API_ENDPOINT}/updating_ui/`, {
          rating_id: item.rating_id,
          rating: currentRating,
          comment: item.comment,
        }).then(() => {
          currentRate = currentRating;
        })
      }
    });
    $(".my-comment-"+index).click(() => {
      $("#feedback-form").modal({
        fadeDuration: 100
      });
      const comment = $(".my-comment-"+index).text() === 'Feedback?' ? '' : item.comment;
      $("#my-prompt").val(comment);
      currentIdx = index;
      currentData = item;
      return false;
    });
  });
}

function initData() {
  $('.lds-ring').show();
  $('#masonry').hide();
  axios.get(`${config.API_ENDPOINT}/rated_ui/${currentUser}`)
  .then(function (response) {
    $('#masonry').show();
    const { data = [] } = response?.data;
    let htmlContent = '';
    if (data.length === 0) {
      htmlContent = `<div class="empty-rated-list">You don't have rating data :(</div>`;
      $('#masonry').html(htmlContent);
      return;
    }
    data.forEach((item, index) => {
      htmlContent += `
      <div data-source="${item.source_id}" class="masonry-item">
        <div class="box">
          <a href="${item.url}" target="_blank">
            <img src="${item.url}" alt="${item.promt}">
            <div class="prompt-box">
              ${item.promt}
            </div>
          </a>
        </div>
        <div class="edit-box">
          <div class="my-rating-${index}"></div>
          <div class="my-comment my-comment-${index}">${item.comment || '<span>Feedback?<span/>'}</div>
        </div>
      </div>
      `
    });
    $('#masonry').html(htmlContent);
    initRatingData(data);
  })
  .catch(function (error) {
    $('#masonry').html('<p class="error">Data load failed. Something was wrong!!!</p>');
    console.log(error);
  })
  .finally(function () {
    $('.lds-ring').hide();
  });
}

function initSave() {
  $(".save-btn").click((e) => {
    e.preventDefault();
    $(".save-btn").prop( "disabled", true);
    axios.put(`${config.API_ENDPOINT}/updating_ui/`, {
      rating_id: currentData.rating_id,
      rating: currentData.rating || currentRating,
      comment: $("#my-prompt").val(),
    }).then(() => {
      const text = $("#my-prompt").val() || '<span>Feedback?<span/>';
      $(".my-comment-"+currentIdx).html(text);
    }).finally(() => {
      setTimeout(() => {
        $.modal.close();
        $(".save-btn").prop( "disabled", false);
      }, 1000);
    })
  });
}

$(document).ready(function() {
  currentUser = initUserInfo();
  initSignOut();
  initData();
  initSave();
});
