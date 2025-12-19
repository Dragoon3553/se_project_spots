import "./index.css";
import {
  enableValidation,
  settings,
  resetValidation,
  disabledBtn,
} from "../scripts/validation.js";
import Api from "../utils/Api.js";
import { renderLoading, handleSubmit } from "../utils/helpers.js";

// Api
const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "e804bb37-0140-4fc9-a9c2-b227c76ecbad",
    "Content-Type": "application/json",
  },
});

api
  .getAppInfo()
  .then(([cards, users]) => {
    cards.forEach((item) => {
      const cardElement = getCardElement(item);
      cardsList.append(cardElement);
    });
    profileAvatarEl.src = users.avatar;
    profileNameEl.textContent = users.name;
    profileDescriptionEl.textContent = users.about;
  })
  .catch(console.error);

// Profile
const profileNameEl = document.querySelector(".profile__name");
const profileDescriptionEl = document.querySelector(".profile__description");
const profileAvatarEl = document.querySelector(".profile__avatar");

// Modals
const editProfileModal = document.querySelector("#edit-profile-modal");
const newPostModal = document.querySelector("#new-post-modal");
const previewModal = document.querySelector("#preview-modal");

// Avatar form elements
const avatarContainer = document.querySelector(".profile__avatar-container");
const avatarModal = document.querySelector("#avatar-modal");
const avatarInput = avatarModal.querySelector("#profile-avatar-input");
const avatarForm = avatarModal.querySelector(".modal__form");

// Delete form elements
const deleteModal = document.querySelector("#delete-modal");
const deleteForm = deleteModal.querySelector(".modal__form");
const deleteCloseBtn = deleteModal.querySelector(".modal__close-btn");

// Forms / Inputs
const editProfileForm = editProfileModal.querySelector(".modal__form");
const editProfileNameInput = editProfileModal.querySelector(
  "#profile-name-input"
);
const editProfileDescriptionInput = editProfileModal.querySelector(
  "#profile-description-input"
);

const newPostForm = newPostModal.querySelector(".modal__form");
const postLinkInput = newPostModal.querySelector("#card-image-input");
const postNameInput = newPostModal.querySelector("#card-caption-input");

// Preview modal Elements
const modalImgEl = previewModal.querySelector(".modal__img");
const modalCaptionEl = previewModal.querySelector(".modal__caption");

// Card List
const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");
let selectedCard, selectedCardId;

const editProfileBtn = document.querySelector(".profile__edit-btn");

const newPostBtn = document.querySelector(".profile__add-btn");
const cardSubmitBtn = newPostModal.querySelector(".modal__btn");

const closeButtons = document.querySelectorAll(".modal__close-btn");

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);
  const cardTitleEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");
  const cardLikeBtn = cardElement.querySelector(".card__like-btn");
  const cardDeleteBtn = cardElement.querySelector(".card__delete-btn");

  if (data.isLiked) {
    cardLikeBtn.classList.add("card__like-btn_active");
  }

  cardTitleEl.textContent = data.name;
  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;

  cardImageEl.addEventListener("click", () => handleImageClick(data));
  cardLikeBtn.addEventListener("click", (evt) => handleLike(evt, data._id));
  cardDeleteBtn.addEventListener("click", () =>
    handleDeleteCard(cardElement, data._id)
  );

  return cardElement;
}

// Functions
function addEscapeListener(e) {
  if (e.key === "Escape") {
    const modalEl = document.querySelector(".modal_is-opened");
    closeModal(modalEl);
  }
}

function handleLike(evt, id) {
  const isLiked = evt.target.classList.contains("card__like-btn_active");
  api
    .changeLikeStatus(id, isLiked)
    .then(() => {
      evt.target.classList.toggle("card__like-btn_active");
    })
    .catch(console.error);
}

function handleDeleteCard(cardElement, cardId) {
  selectedCard = cardElement;
  selectedCardId = cardId;
  openModal(deleteModal);
}

function handleImageClick({ link, name }) {
  modalImgEl.src = link;
  modalImgEl.alt = name;
  modalCaptionEl.textContent = name;
  openModal(previewModal);
}

function openModal(modal) {
  modal.classList.add("modal_is-opened");
  document.addEventListener("keydown", addEscapeListener);
}

function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
  document.removeEventListener("keydown", addEscapeListener);
}

closeButtons.forEach((button) => {
  const popup = button.closest(".modal");
  button.addEventListener("click", () => closeModal(popup));
});

function closeOnOverlay() {
  const modals = document.querySelectorAll(".modal");
  modals.forEach((modal) => {
    modal.addEventListener("click", function (e) {
      if (e.target === modal) {
        closeModal(e.target);
      }
    });
  });
}

editProfileBtn.addEventListener("click", () => {
  openModal(editProfileModal);
  editProfileNameInput.value = profileNameEl.textContent;
  editProfileDescriptionInput.value = profileDescriptionEl.textContent;
  resetValidation(
    editProfileForm,
    [editProfileNameInput, editProfileDescriptionInput],
    settings
  );
});

newPostBtn.addEventListener("click", () => {
  openModal(newPostModal);
});

// Avatar EventListeners
avatarContainer.addEventListener("click", () => {
  openModal(avatarModal);
});

avatarForm.addEventListener("submit", handleAvatarSubmit);
editProfileForm.addEventListener("submit", handleEditProfileSubmit);
deleteForm.addEventListener("submit", handleDeleteSubmit);

function handleEditProfileSubmit(evt) {
  function makeRequest() {
    api
      .editUserInfo({
        name: editProfileNameInput.value,
        about: editProfileDescriptionInput.value,
      })
      .then((data) => {
        profileNameEl.textContent = data.name;
        profileDescriptionEl.textContent = data.about;
        closeModal(editProfileModal);
      });
  }
  handleSubmit(makeRequest, evt);
}

function handleAvatarSubmit(evt) {
  function makeRequest() {
    return api.editAvatarInfo({ avatar: avatarInput.value }).then((data) => {
      profileAvatarEl.src = data.avatar;
      closeModal(avatarModal);
    });
  }
  handleSubmit(makeRequest, evt);
}

function handleDeleteSubmit(evt) {
  function makeRequest() {
    return api.deleteCard(selectedCardId).then(() => {
      selectedCard.remove();
      closeModal(deleteModal);
    });
  }
  handleSubmit(makeRequest, evt, "Deleting...");
}

function handleAddCardSubmit(evt) {
  const inputValues = {
    name: postNameInput.value,
    link: postLinkInput.value,
  };
  function makeRequest() {
    return api.postUserCards(inputValues).then((data) => {
      const cardElement = getCardElement(data);
      cardsList.prepend(cardElement);

      newPostForm.reset();
      disabledBtn(cardSubmitBtn, settings);
      closeModal(newPostModal);
    });
  }
  handleSubmit(makeRequest, evt);
}

newPostForm.addEventListener("submit", handleAddCardSubmit);

closeOnOverlay();
enableValidation(settings);
