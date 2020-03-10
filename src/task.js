import $ from 'jquery';

//  https://farm{farm-id}.staticflickr.com/{server-id}/{id}_{secret}.jpg

const userId = '48600090482@N01';
let counter = 0;
let page = 0;
let switcher = 1;

function getData() {
  return $.ajax({
    url: `https://www.flickr.com/services/rest/?method=flickr.photosets.getList&api_key=f6146b5aea320305af01030c6fc04c59&user_id=${userId}&format=json&nojsoncallback=1`,
    type: 'GET',
    dataType: 'json',
  });
}

function getPhotos(photosetId) {
  return $.ajax({
    url: `https://www.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=f6146b5aea320305af01030c6fc04c59&photoset_id=${photosetId}&user_id=48600090482%40N01&format=json&nojsoncallback=1`,
    type: 'GET',
    dataType: 'json',
  });
}

$(document).ready(() => {
  getData().then(
    (data) => {
      $('.title__user').replaceWith(
        `<span class = "title__user">${data.photosets.photoset[0].username}</span>`,
      );
      data.photosets.photoset.forEach((element) => {
        if (counter % 5 === 0) {
          page += 1;
          $('.body__pages-list').append(
            `<span class = "pages-list__numeration" data-num = ${page}> ${page}</span>`,
          );
        }
        counter += 1;
        $('.body').append(
          `<span class = "photoset" data-item = ${page} data-id = ${element.id}>${element.title._content}</span>`,
        );
      });
      $('.photoset').css('display', 'none');
      $('.photoset[data-item=1]').css('display', 'flex');
      $('.pages-list__numeration[data-num=1]').addClass('active-button');
      $('.pages-list__numeration').click((e) => {
        $('.pages-list__numeration').removeClass('active-button');
        $(e.target).addClass('active-button');
        $('.photoset').css('display', 'none');
        $(`.photoset[data-item=${$(e.target).attr('data-num')}]`).css('display', 'block');
      });
      $('.photoset').click((e) => {
        getPhotos($(e.target).attr('data-id')).then(
          (photos) => {
            console.log(photos);
            $('.modal-window').removeClass('d-none');
            $('.block-close').removeClass('d-none');
            $('.modal-window__username').replaceWith(
              `<span class = "modal-window__username">Photoset: ${photos.photoset.title}</span`,
            );
            let index = 1;
            $('.photo-box').empty();
            photos.photoset.photo.forEach((elem) => {
              $('.photo-box').append(`
                <div class = "photo-box__item d-none" data-num = ${index}>
                <img class = "photo" src = "https://farm${elem.farm}.staticflickr.com/${elem.server}/${elem.id}_${elem.secret}.jpg"/>
                <span class = "photo-description"> ${elem.title}</span>
                </div>
                `);
              index += 1;
            });
            $('.photo-box__item[data-num=1]').removeClass('d-none');
            $('#next-photo').click(() => {
              switcher += 1;
              if (switcher >= parseInt($('.photo-box__item:last-child').attr('data-num'))) {
                switcher = 1;
              }
              $('.photo-box__item').addClass('d-none');
              $(`.photo-box__item[data-num=${switcher}]`).removeClass('d-none');
            });
            $('#prev-photo').click(() => {
              switcher -= 1;
              if (switcher <= 0) {
                switcher = parseInt($('.photo-box__item:last-child').attr('data-num'));
              }
              $('.photo-box__item').addClass('d-none');
              $(`.photo-box__item[data-num=${switcher}]`).removeClass('d-none');
            });
            $('.block-close').click(() => {
              $('.modal-window').addClass('d-none');
              $('.block-close').addClass('d-none');
            });
          },
          (errData) => {
            console.log(errData);
          },
        );
      });
    },
    (errData) => {
      console.log(errData);
    },
  );
});
