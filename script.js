function addActivityData() {
  const activityArray = [
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

  const newTableRow = document.createElement("tr");
  const newTableData = document.createElement("td");
  const newSelectActivity = document.createElement("select");

  for (let i = 0; i < activityArray.length; i++) {
    const activityOption = document.createElement("option");

    activityOption.text = activityArray[i];
    activityOption.value = activityArray[i];

    newSelectActivity.appendChild(activityOption);
  }

  newTableData.appendChild(newSelectActivity);
  newTableRow.appendChild(newTableData);

  return newTableRow;
}

function addCategoryData() {
  const categoryArray = [
    "Select a category",
    "Transport",
    "Food & Drinks",
    "Energy Use",
    "Consumption & Products",
    "Waste",
    "Housing",
    "Other",
  ];

  const newTableRow = addActivityData();
  const newTableData = document.createElement("td");
  const newSelectCategory = document.createElement("select");

  newSelectCategory.setAttribute("class", "category-values");

  for (let i = 0; i < categoryArray.length; i++) {
    const categoryOption = document.createElement("option");
    categoryOption.text = categoryArray[i];
    categoryOption.value = categoryArray[i];

    if (categoryArray[i] === categoryArray[0]) {
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

  if (document.getElementById("co2-result")) {
    document.getElementById("co2-result").remove();
  }
}

function updateCO2Emissions(nodeList, length) {
  let newCO2Str = calculateCO2Emissions(nodeList, length);
  let divElement = document.getElementById("co2-result");

  if (newCO2Str === undefined) {
    if (!divElement) {
    } else {
      divElement.remove();
    }
  } else {
    if (divElement) {
      divElement.remove();
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
  }
}

function calculateCO2Emissions(nodeList, length) {
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

  for (let i = 0; i < length; i++) {
    let category = nodeList[i].options[nodeList[i].selectedIndex].text.trim();

    if (!(category in categoryMultiplier)) {
      window.alert("Please select a category.");
      return;
    }

    CO2Total += categoryMultiplier[category] * globalAvgCO2Emissions;
  }

  return CO2Total.toFixed(2);
}

function getTotalCO2Emissions() {
  const htmlOptionsNodeList = document.querySelectorAll(".category-values");
  const nodeListLength = htmlOptionsNodeList.length;

  updateCO2Emissions(htmlOptionsNodeList, nodeListLength);
}
