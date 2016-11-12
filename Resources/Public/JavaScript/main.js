"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Gallery = function () {
    function Gallery() {
        _classCallCheck(this, Gallery);

        this.imgTags = [];
        this.imgWrappers = [];

        this.state = {
            "currentIndex": 0,
            "imagesNumber": galleryData.images.length
        };

        this.images = galleryData.images;
        this.thumbnails = galleryData.thumbnails;

        this.canvas = document.querySelector('.gallery .canvas');

        this.rightArrow = document.querySelector('.gallery .right-arrow');
        this.leftArrow = document.querySelector('.gallery .left-arrow');

        this.slideRight = this.slideRight.bind(this);
        this.slideLeft = this.slideLeft.bind(this);
        this.slideWithKeyboard = this.slideWithKeyboard.bind(this);

        this.appendThumbnails();

        this.addEventListeners();
        this.reset();
        this.addImages();
    }

    _createClass(Gallery, [{
        key: "reset",
        value: function reset() {
            if (this.state.currentIndex == this.state.imagesNumber - 1) {
                this.rightArrow.classList.add('disabled');
            } else if (this.rightArrow.classList.item('disabled')) {
                this.rightArrow.classList.remove('disabled');
            }
            if (this.state.currentIndex == 0) {
                this.leftArrow.classList.add('disabled');
            } else if (this.leftArrow.classList.item('disabled')) {
                this.leftArrow.classList.remove('disabled');
            }
        }
    }, {
        key: "updateMainImage",
        value: function updateMainImage(newIndex) {
            this.imgWrappers[this.state.currentIndex].classList.remove('img-main');
            this.state.currentIndex = newIndex;
            this.imgWrappers[this.state.currentIndex].classList.add('img-main');
        }
    }, {
        key: "addImages",
        value: function addImages() {
            for (var index in this.images) {
                if (this.images.hasOwnProperty(index)) {
                    var image = new Image();
                    image.src = this.images[index];
                    image.setAttribute('data-gallery-index', index);
                    // TODO bilder serriell laden
                    image.addEventListener('load', this.imageWasloaded.bind(this));
                }
            }
        }
    }, {
        key: "appendThumbnails",
        value: function appendThumbnails() {
            for (var index in this.thumbnails) {
                if (this.thumbnails.hasOwnProperty(index)) {
                    var imgTag = this.crateImageElement(this.thumbnails[index]);
                    imgTag.setAttribute('style', 'left:' + index * 100 + '%;');
                    if (index == 0) {
                        imgTag.classList.add('img-main');
                    }
                    this.canvas.appendChild(imgTag);
                }
            }
        }
    }, {
        key: "imageWasloaded",
        value: function imageWasloaded(e) {
            var index = e.target.dataset.galleryIndex;
            this.imgTags[index].src = e.target.getAttribute('src');
            this.imgTags[index].classList.remove('thumbnail');
        }
    }, {
        key: "updateTransform",
        value: function updateTransform(index) {
            return 'transform:translateX(-' + this.state.currentIndex * 100 + '%)';
        }
    }, {
        key: "crateImageElement",
        value: function crateImageElement(src, index) {
            var imgTag = document.createElement('img');
            imgTag.setAttribute('src', src);
            imgTag.classList.add('thumbnail');

            this.imgTags.push(imgTag);

            var imgWrapper = document.createElement('div');
            imgWrapper.setAttribute('class', 'img-wrapper');
            imgWrapper.setAttribute('style', 'left:0%');
            imgWrapper.appendChild(imgTag);

            this.imgWrappers.push(imgWrapper);

            return imgWrapper;
        }
    }, {
        key: "addEventListeners",
        value: function addEventListeners() {
            this.rightArrow.addEventListener('click', this.slideRight);
            this.leftArrow.addEventListener('click', this.slideLeft);
            window.addEventListener('keydown', this.slideWithKeyboard);
        }
    }, {
        key: "slideRight",
        value: function slideRight() {
            if (this.state.currentIndex != this.state.imagesNumber - 1) {
                this.updateMainImage(this.state.currentIndex + 1);
                this.canvas.setAttribute('style', this.updateTransform(this.state.currentIndex));
                this.reset();
            }
        }
    }, {
        key: "slideLeft",
        value: function slideLeft() {
            if (this.state.currentIndex != 0) {
                this.updateMainImage(this.state.currentIndex - 1);
                this.canvas.setAttribute('style', this.updateTransform(this.state.currentIndex));
                this.reset();
            }
        }
    }, {
        key: "slideWithKeyboard",
        value: function slideWithKeyboard(e) {
            switch (e.keyCode) {
                case 39:
                    this.slideRight();
                    break;
                case 37:
                    this.slideLeft();
                    break;
                default:
                    return;
            }
        }
    }]);

    return Gallery;
}();

var gallery = new Gallery();
