import users from "./../data/data.js";

const userList = document.getElementById("user-list");
const searchInput = document.getElementById("search-input");
const filtersContainer = document.querySelector(".filters");
const loadMoreBtn = document.getElementById("load-more-btn");

// Первоначальное количество отображаемых карточек
let displayedItems = 9;

// Подсчет количества карточек по категориям
const categoriesCount = { all: users.length };

users.forEach((user) => {
  const speciality = user.speciality;
  if (categoriesCount.hasOwnProperty(speciality)) {
    categoriesCount[speciality]++;
  } else {
    categoriesCount[speciality] = 1;
  }
});

const categoryColors = {
  Marketing: "#03CEA4",
  Management: "#5A87FC",
  "HR & Recruting": "#F89828",
  Design: "#F52F6E",
  Development: "#7772F1",
};

// Функция рендера одной карточки
function renderUserCard(user) {
  const card = document.createElement("div");
  card.className = "user-card";
  card.dataset.id = user.id;

  const bgColor = categoryColors[user.speciality] || "#ffffff";

  card.innerHTML = `
        <img src="${user.imageUrl}" alt="${user.speciality}">
        <div class="info">
        <h2 class="info-speciality" style="background-color: ${bgColor}">${user.speciality}</h2>
        <p class="info-description">${user.description}</p>
        <span class="info-price">${user.price}</span>  <span class="info-name">| ${user.name}</span>
        </div>
    `;

  return card;
}

// Функция для отображения определенного количества карточек
function showItems(startIndex, endIndex) {
  for (let i = startIndex; i <= Math.min(endIndex, users.length - 1); i++) {
    const card = renderUserCard(users[i]);
    userList.appendChild(card);
  }
}

// Первоначальная отрисовка первых 9 карточек
showItems(0, 8);

// Поиск
searchInput.addEventListener("input", (event) => {
  const filterValue = event.target.value.trim().toLowerCase();

  userList.innerHTML = "";

  if (!filterValue) {
    showAllCards();
    return;
  }

  // Отфильтрованный массив по полям description
  const filteredUsers = users.filter((user) =>
    user.description.toLowerCase().includes(filterValue)
  );

  // Рендер найденных карточек
  filteredUsers.forEach((filteredUser) => {
    const card = renderUserCard(filteredUser);
    userList.appendChild(card);
  });
});

// Функции для скрытия и показа всех карточек
function hideAllCards() {
  const cards = document.querySelectorAll(".user-card");
  cards.forEach((card) => (card.style.display = "none"));
}

// Функция рендера всех карточек
function showAllCards() {
  userList.innerHTML = "";
  users.forEach((user) => {
    const card = renderUserCard(user);
    userList.appendChild(card);
  });
}

// Обработчик нажатия на фильтры
filtersContainer.addEventListener("click", (event) => {
  if (event.target.tagName === "BUTTON") {
    const selectedSpeciality = event.target.dataset.speciality;

    userList.innerHTML = "";

    const filteredUsers =
      selectedSpeciality === "all"
        ? users
        : users.filter((u) => u.speciality === selectedSpeciality);

    filteredUsers.forEach((filteredUser) => {
      const card = renderUserCard(filteredUser);
      userList.appendChild(card);
    });

    updateActiveFilters(selectedSpeciality);
  }
});

// Обновление активных фильтров
function updateActiveFilters(activeCategory) {
  const buttons = filtersContainer.querySelectorAll("button");
  buttons.forEach((btn) =>
    btn.classList.toggle(
      "active-filter",
      btn.dataset.speciality === activeCategory
    )
  );
}

// Обработчик кнопки loadMore
loadMoreBtn.addEventListener("click", () => {
  const nextStartIndex = displayedItems;
  const nextEndIndex = nextStartIndex + 8;

  if (nextEndIndex >= users.length) {
    loadMoreBtn.disabled = true;
  }

  showItems(nextStartIndex, nextEndIndex);
  displayedItems += 9;
});

// HTML-кнопки
let buttonsHtml =
  '<button class="btn active-filter" data-speciality="all">All <span class="count">' +
  categoriesCount["all"] +
  "</span></button>";

["Marketing", "Management", "HR & Recruting", "Design", "Development"].forEach(
  (category) => {
    buttonsHtml += `
        <button class="btn" data-speciality="${category}">
            ${category} <span class="count">${
      categoriesCount[category] || 0
    }</span>
        </button>
    `;
  }
);

filtersContainer.innerHTML = buttonsHtml;
