const ACTIVITY_ARRAY = [
  "Select an activity",
  "Sitting/Sleeping",
  "Walking/Running",
  "Eating solid foods and drinking fluids",
  "Charging portable gadgets (e.g., smartphone, laptop, tablet)",
  "Buying clothing and cosmetic products",
  "Recycling",
  "Using geyser",
  "Driving a vehicle",
  "Taking a taxi (regular, Uber, or Bolt)",
];
const CATEGORY_ARRAY = [
  "Select a category",
  "Transport",
  "Food & Drinks",
  "Energy Use",
  "Consumption & Products",
  "Waste",
  "Housing",
  "Other",
];

function addActivityData() {
  const newTableRow = document.createElement("tr");
  const newTableData = document.createElement("td");
  const newSelectActivity = document.createElement("select");
  newSelectActivity.className = "activity-values";

  for (let i = 0; i < ACTIVITY_ARRAY.length; i++) {
    const activityOption = document.createElement("option");

    activityOption.text = ACTIVITY_ARRAY[i];
    activityOption.value = ACTIVITY_ARRAY[i];

    if (activityOption.text === ACTIVITY_ARRAY[0]) {
      activityOption.selected = true;
      activityOption.disabled = true;
    }

    newSelectActivity.appendChild(activityOption);
  }

  newTableData.appendChild(newSelectActivity);
  newTableRow.appendChild(newTableData);

  return newTableRow;
}

function addCategoryData() {
  const newTableRow = addActivityData();
  const newTableData = document.createElement("td");
  const newSelectCategory = document.createElement("select");

  newSelectCategory.setAttribute("class", "category-values");

  for (let i = 0; i < CATEGORY_ARRAY.length; i++) {
    const categoryOption = document.createElement("option");
    categoryOption.text = CATEGORY_ARRAY[i];
    categoryOption.value = CATEGORY_ARRAY[i];

    if (categoryOption.text === CATEGORY_ARRAY[0]) {
      categoryOption.selected = true;
      categoryOption.disabled = true;
    }

    newSelectCategory.appendChild(categoryOption);
  }

  newTableData.appendChild(newSelectCategory);
  newTableRow.appendChild(newTableData);

  return newTableRow;
}

function addTableRow() {
  document.getElementById("table").appendChild(addCategoryData());
}

function removeTableRow() {
  var tableRowLength = document.querySelectorAll("tr").length;

  if (tableRowLength > 2) {
    document.querySelectorAll("tr")[tableRowLength - 1].remove();
  }
}

function resetTable() {
  const tableLength = document.querySelectorAll("tr").length;

  for (let i = 1; i < tableLength; i++) {
    document.querySelectorAll("tr")[1].remove();
  }

  addTableRow();
  clearDynamicHTMLElements();
}

function createFilter(nodeList) {
  const nodeLength = nodeList.length;
  let newDivElement = document.createElement("div");
  newDivElement.id = "filter-id";
  let newDropdownElement = document.createElement("select");
  newDropdownElement.className = "category-filter";
  let newOptionElement = document.createElement("option");
  newOptionElement.className = "category";
  newOptionElement.innerText = "Filter by <Category>.";
  newOptionElement.selected = true;
  newOptionElement.disabled = true;
  let categoryArray = [];

  newDropdownElement.appendChild(newOptionElement);

  for (let i = 0; i < nodeLength; i++) {
    const selectedCategory =
      nodeList[i].options[nodeList[i].selectedIndex].text.trim();

    if (!categoryArray.includes(selectedCategory)) {
      categoryArray.push(selectedCategory);

      let optionElement = document.createElement("option");
      optionElement.class = newOptionElement.class;
      optionElement.innerText = selectedCategory;

      newDropdownElement.appendChild(optionElement);
    }
  }

  if (document.getElementById("filter-id")) {
    document.getElementById("filter-id").remove();
  }

  newDivElement.appendChild(newDropdownElement);
  document.getElementById("body-id").appendChild(newDivElement);
}

function createPieChart() {
  let newDivElement = document.createElement("div");
  newDivElement.id = "chart-id";
} // To be finished

function updateCO2Emissions(nodeList1, length1, nodeList2, length2) {
  let newCO2Str = calculateCO2Emissions(nodeList1, length1, nodeList2, length2);

  if (newCO2Str === undefined) {
    clearDynamicHTMLElements();
  } else {
    if (document.getElementById("co2-result")) {
      clearDynamicHTMLElements();
    }

    let element = document.createElement("p");
    element.id = "co2-value";
    let div = document.createElement("div");
    div.id = "co2-result";
    element.innerHTML =
      "The total CO<sub>2</sub> emissions is " +
      newCO2Str +
      " kg CO<sub>2</sub>.";

    div.appendChild(element);
    document.getElementById("body-id").appendChild(div);

    createFilter(nodeList2);
  }
}

function checkActivityOptionValues(activityNodeList, length) {
  for (let i = 0; i < length; i++) {
    let activity =
      activityNodeList[i].options[
        activityNodeList[i].selectedIndex
      ].text.trim();

    if (activity === ACTIVITY_ARRAY[0]) {
      return false;
    }
  }

  return true;
}

function checkCategoryOptionValues(categoryNodeList, length) {
  for (let i = 0; i < length; i++) {
    let category =
      categoryNodeList[i].options[
        categoryNodeList[i].selectedIndex
      ].text.trim();

    if (category === CATEGORY_ARRAY[0]) {
      return false;
    }
  }

  return true;
}

function clearDynamicHTMLElements() {
  if (document.getElementById("co2-result")) {
    document.getElementById("co2-result").remove();
  }

  if (document.getElementById("filter-id")) {
    document.getElementById("filter-id").remove();
  }
}

function calculateCO2Emissions(nodeList1, length1, nodeList2, length2) {
  let CO2Total = 0;

  const categoryMultiplier = {
    Transport: 2,
    "Food & Drinks": 0.25,
    "Energy Use": 1.5,
    "Consumption & Products": 0.01,
    Waste: 0.5,
    Housing: 0.75,
    Other: 1,
  };

  const globalAvgCO2Emissions = 25.9;

  if (checkActivityOptionValues(nodeList1, length1) === false) {
    window.alert("Please select an activity.");
    return;
  } else if (checkCategoryOptionValues(nodeList2, length2) === false) {
    window.alert("Please select a category.");
    return;
  } else {
    for (let i = 0; i < length2; i++) {
      let category =
        nodeList2[i].options[nodeList2[i].selectedIndex].text.trim();

      CO2Total += categoryMultiplier[category] * globalAvgCO2Emissions;
    }

    return CO2Total.toFixed(2);
  }
}

function getTotalCO2Emissions() {
  const htmlOptionsNodeList1 = document.querySelectorAll(".activity-values");
  const nodeListLength1 = htmlOptionsNodeList1.length;
  const htmlOptionsNodeList2 = document.querySelectorAll(".category-values");
  const nodeListLength2 = htmlOptionsNodeList2.length;

  updateCO2Emissions(
    htmlOptionsNodeList1,
    nodeListLength1,
    htmlOptionsNodeList2,
    nodeListLength2
  );
}
