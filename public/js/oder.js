let formData = {};
let dishData = [];

function getDishesData() {
  return fetch('./js/dishes.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => data.dishes)
    .catch(error => {
      console.error('Error fetching data:', error);
      throw error;
    });
}

function nextStep() {
  if (validateStep()) {
    let previous = document.getElementById('previous');
    let next = document.getElementById('next');
    let btn = document.getElementById('btn');
    const currentStep = getCurrentStep();
    const nextStep = currentStep + 1;

    document.getElementById(`step${currentStep}`).classList.add('hidden');
    document.getElementById(`step${nextStep}`).classList.remove('hidden');

    document.getElementById(`nav-step${currentStep}`).classList.remove('active');
    document.getElementById(`nav-step${nextStep}`).classList.add('active');

    previous.classList.add('hidden');
    next.classList.add('hidden');
    btn.classList.add('hidden');
    if (nextStep > 1) {
      previous.classList.remove('hidden');
    }
    if (nextStep < 4) {
      next.classList.remove('hidden');
    }

    if (nextStep === 2) {
      populateRestaurants();
    } else if (nextStep === 3) {
      populateDishes();
    } else if (nextStep === 4) {
      displayReview();
      btn.classList.remove('hidden');
    }
  }
}

function prevStep() {
  let previous = document.getElementById('previous');
  let next = document.getElementById('next');
  let btn = document.getElementById('btn');
  const currentStep = getCurrentStep();
  const prevStep = currentStep - 1;

  document.getElementById(`step${currentStep}`).classList.add('hidden');
  document.getElementById(`step${prevStep}`).classList.remove('hidden');

  document.getElementById(`nav-step${currentStep}`).classList.remove('active');
  document.getElementById(`nav-step${prevStep}`).classList.add('active');

  previous.classList.add('hidden');
  next.classList.add('hidden');
  btn.classList.add('hidden');
  if (prevStep > 1) {
    previous.classList.remove('hidden');
  }
  if (prevStep < 4) {
    next.classList.remove('hidden');
  }

  if (prevStep === 2) {
    populateRestaurants();
  } else if (prevStep === 3) {
    populateDishes();
  } else if (prevStep === 4) {
    displayReview();
    btn.classList.remove('hidden');
  }
}

async function addDish() {
  let listMenu = '';
  const dishContainer = document.getElementById('dishContainer');

  const newDishChild = document.createElement('div');
  newDishChild.id = 'dishChild';
  dishContainer.appendChild(newDishChild);

  const newDishLabel = document.createElement('label');
  newDishLabel.textContent = 'Please Select a Dish';

  const newDishSelect = document.createElement('select');
  newDishSelect.id = 'dish';
  newDishSelect.required = 'true';
  const menuList = await getPopulateDishes();
  menuList.forEach(order => {
    listMenu += `
        <option value="${order}">${order}</option>
    `;
  });
  newDishSelect.innerHTML = listMenu;

  const newServingsLabel = document.createElement('label');
  newServingsLabel.textContent = 'Please enter no. of servings';

  const newServingsInput = document.createElement('input');
  newServingsInput.type = 'number';
  newServingsInput.id = 'numServings';
  newServingsInput.min = '1';
  newServingsInput.max = '10';
  newServingsInput.value = '1';

  newDishChild.appendChild(newDishLabel);
  newDishChild.appendChild(newDishSelect);
  newDishChild.appendChild(newServingsLabel);
  newDishChild.appendChild(newServingsInput);
}

function submitForm(event) {
  console.log("Form submitted:", formData);
  event.preventDefault();
  return false;
}

function validateStep() {
  const currentStep = getCurrentStep();

  if (currentStep === 1) {
    const mealCategory = document.getElementById('mealCategory').value;
    const numPeople = document.getElementById('numPeople').value;

    if (!mealCategory || !numPeople || numPeople < 1 || numPeople > 10) {
      alert("Please enter valid values for Meal Category and Number of People (1-10).");
      return false;
    }
    formData.mealCategory = mealCategory;
    formData.numPeople = numPeople;
  } else if (currentStep === 2) {
    const restaurant = document.getElementById('restaurant').value;

    if (!restaurant) {
      alert("Please select a restaurant.");
      return false;
    }
    formData.restaurant = restaurant;
  } else if (currentStep === 3) {

    dishData = [];
    let dishContainer = document.getElementById('dishContainer');
    for (const childElement of dishContainer.children) {
      const dishValue = childElement.querySelector('select').value;
      const numServingsValue = childElement.querySelector('input').value;
      if (!dish || !numServings || numServingsValue < 1 || numServingsValue > 10) {
        alert("Please enter valid values for Dish and Number of Servings (1-10).");
        return false;
      }

      dishData.push({ dish: dishValue, numServings: numServingsValue });
      if (dishExists(dishValue)) {
        alert("Choose another dish!");
        return false;
      }
    }
    formData.dishes = dishData;
  }
  return true;
}

function dishExists(dishValues) {
  let i = 0;
  dishData.forEach(data => {
    if (data.dish === dishValues) {
      i++;
    }
  });
  return i > 1;
}

function getCurrentStep() {
  const currentStepElement = document.querySelector('.step:not(.hidden)');
  return parseInt(currentStepElement.id.replace('step', ''));
}

function populateRestaurants() {
  const restaurantSelect = document.getElementById('restaurant');

  getDishesData()
    .then(dishesData => {
      const listRestaurent = dishesData.reduce((restaurants, dish) => {
        if (dish.availableMeals.includes(formData.mealCategory) && !restaurants.includes(dish.restaurant)) {
          restaurants.push(dish.restaurant);
        }
        return restaurants;
      }, []);
      let selectRestaurants = '';
      listRestaurent.forEach(restaurant => {
        selectRestaurants += `
          <option ${formData.restaurant === restaurant ? 'selected' : ''} value="${restaurant}">${restaurant}</option>
      `;
      });
      restaurantSelect.innerHTML = selectRestaurants;
    })
    .catch(error => {
      console.error('Failed to fetch restaurant data:', error);
    });
}

async function populateDishes() {
  let dishData = [];
  const menuList = await getPopulateDishes();
  const dishContainer = document.getElementById('dishContainer');

  for (const dishChild of dishContainer.children) {
    const dishSelect = dishChild.querySelector('select[id^="dish"]');
    if (dishSelect) {
      if (!menuList.includes(dishSelect.value)) {
        dishContainer.removeChild(dishChild);
      } else {
        dishData.push({ dish: dishChild.querySelector('select').value, numServings: dishChild.querySelector('input').value });
      }
    }
  }
  if (dishData.length === 0) {
    dishContainer.innerHTML = ``;
    addDish();
  }
  formData.dishes = dishData;
}


async function getPopulateDishes() {
  try {
    const dishesData = await getDishesData();
    const listMenu = dishesData.reduce((menus, dish) => {
      if (
        dish.availableMeals.includes(formData.mealCategory) &&
        dish.restaurant === formData.restaurant &&
        !menus.includes(dish.name)
      ) {
        menus.push(dish.name);
      }
      return menus;
    }, []);
    return listMenu;
  } catch (error) {
    console.error('Failed to fetch dishes data:', error);
    throw error;
  }
}

function displayReview() {
  const reviewElement = document.getElementById('review');
  let templateString = '';

  formData.dishes.forEach(data => {
    templateString += `
        <p>${data.dish}:  ${data.numServings}</p>
    `;
  });

  reviewElement.innerHTML = `
    <p>Meal ${formData.mealCategory}</p>
    <p>No. of. People ${formData.numPeople}</p>
    <p>Restaurant ${formData.restaurant}</p>
    <p>Dishes ${templateString}</p>
  `;
}
