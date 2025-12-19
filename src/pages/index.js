import "./index.css";
import {
  enableValidation,
  settings,
  resetValidation,
  disabledBtn,
} from "../scripts/validation.js";
import Api from "../utils/Api.js";
import { setButtonText } from "../utils/helpers.js";

// const initialCards = [
//   {
//     name: "Val Thorens",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
//   },
//   {
//     name: "Restaurant terrace",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
//   },
//   {
//     name: "An outdoor cafe",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
//   },
//   {
//     name: "A very long bridge, over the forest and through the trees",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
//   },
//   {
//     name: "Tunnel with morning light",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
//   },
//   {
//     name: "Mountain house",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
//   },
//   {
//     name: "Golden Gate Bridge",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
//   },
// ];

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
const avatarCloseBtn = avatarModal.querySelector(".modal__close-btn");
const avatarSubmitBtn = avatarModal.querySelector(".modal__btn");
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
const editProfileCloseBtn = editProfileModal.querySelector(".modal__close-btn");

const newPostBtn = document.querySelector(".profile__add-btn");
const newPostCloseBtn = newPostModal.querySelector(".modal__close-btn");
const cardSubmitBtn = newPostModal.querySelector(".modal__btn");

const imgModalCloseBtn = previewModal.querySelector(
  ".modal__close-btn_type_preview"
);

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
  closeOnOverlay(deleteModal);
  closeOnEscape();
}

function handleImageClick({ link, name }) {
  modalImgEl.src = link;
  modalImgEl.alt = name;
  modalCaptionEl.textContent = name;
  openModal(previewModal);
  closeOnOverlay(previewModal);
  closeOnEscape();
}

function openModal(modal) {
  modal.classList.add("modal_is-opened");
  document.addEventListener("keydown", addEscapeListener);
}

function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
  document.removeEventListener("keydown", addEscapeListener);
}

function attachCloseBtn(btn, modal) {
  btn.addEventListener("click", () => closeModal(modal));
}

function closeOnOverlay(modal) {
  const modalBack = document.querySelectorAll(".modal");
  modalBack.forEach((input) => {
    input.addEventListener("click", function (e) {
      if (e.target === modal) {
        closeModal(e.target);
      }
    });
  });
}

function closeOnEscape() {
  document.addEventListener("keydown", addEscapeListener);
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
  closeOnOverlay(editProfileModal);
  closeOnEscape();
});

newPostBtn.addEventListener("click", () => {
  openModal(newPostModal);
  closeOnOverlay(newPostModal);
  closeOnEscape();
});

// Close Buttons
attachCloseBtn(editProfileCloseBtn, editProfileModal);
attachCloseBtn(newPostCloseBtn, newPostModal);
attachCloseBtn(imgModalCloseBtn, previewModal);
attachCloseBtn(deleteCloseBtn, deleteModal);
attachCloseBtn(avatarCloseBtn, avatarModal);

// Avatar EventListeners
avatarContainer.addEventListener("click", () => {
  openModal(avatarModal);
  closeOnOverlay(avatarModal);
  closeOnEscape();
});

avatarForm.addEventListener("submit", handleAvatarSubmit);
editProfileForm.addEventListener("submit", handleEditProfileSubmit);
deleteForm.addEventListener("submit", handleDeleteSubmit);

function handleEditProfileSubmit(evt) {
  evt.preventDefault();

  // change text content to "Saving..."
  const submitBtn = evt.submitter;
  // submitBtn.textContent = "Saving...";
  setButtonText(submitBtn, true);

  api
    .editUserInfo({
      name: editProfileNameInput.value,
      about: editProfileDescriptionInput.value,
    })
    .then((data) => {
      profileNameEl.textContent = data.name;
      profileDescriptionEl.textContent = data.about;
      closeModal(editProfileModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false);
    });
}

function handleAvatarSubmit(evt) {
  evt.preventDefault();

  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true);

  api
    .editAvatarInfo({ avatar: avatarInput.value })
    .then((data) => {
      profileAvatarEl.src = data.avatar;
      closeModal(avatarModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false);
    });
}

function handleDeleteSubmit(evt) {
  evt.preventDefault();

  const deleteBtn = evt.submitter;
  setButtonText(deleteBtn, true, "Delete", "Deleting...");

  api
    .deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(deleteBtn, false, "Delete", "Deleting...");
    });
}

function handleAddCardSubmit(evt) {
  evt.preventDefault();

  const inputValues = {
    name: postNameInput.value,
    link: postLinkInput.value,
  };

  api
    .postUserCards(inputValues)
    .then((data) => {
      const cardElement = getCardElement(data);
      cardsList.prepend(cardElement);

      newPostForm.reset();
      disabledBtn(cardSubmitBtn, settings);
      closeModal(newPostModal);
    })
    .catch(console.error);
}

newPostForm.addEventListener("submit", handleAddCardSubmit);

enableValidation(settings);
