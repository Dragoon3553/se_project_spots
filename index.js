const profileEditBtn = document.querySelector(".profile__edit-btn");
const profileModal = document.querySelector("#edit-profile-modal");
const profileCloseBtn = profileModal.querySelector(".modal__close-btn");
const profileAddBtn = document.querySelector(".profile__add-btn");
const postModal = document.querySelector("#new-post-modal");
const postCloseBtn = postModal.querySelector(".modal__close-btn");
const profileForm = profileModal.querySelector(".modal__form");
const postForm = postModal.querySelector(".modal__form");

const profileNameInput = profileModal.querySelector("#profile-name-input");
const profileDescriptionInput = profileModal.querySelector(
  "#profile-description-input"
);

const postNameInput = profileModal.querySelector("#card-image-input");
const postDescriptionInput = profileModal.querySelector("#card-caption-input");

profileEditBtn.addEventListener("click", function () {
  profileModal.classList.add("modal_is-opened");
});

profileCloseBtn.addEventListener("click", function () {
  profileModal.classList.remove("modal_is-opened");
});

profileAddBtn.addEventListener("click", function () {
  postModal.classList.add("modal_is-opened");
});

postCloseBtn.addEventListener("click", function () {
  postModal.classList.remove("modal_is-opened");
});
