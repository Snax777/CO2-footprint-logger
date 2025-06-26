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

  for (let i = 0; i < categoryArray.length; i++) {
    const categoryOption = document.createElement("option");

    categoryOption.text = categoryArray[i];
    categoryOption.value = categoryArray[i];

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
  addTableRow();

  const tableLength = document.querySelectorAll("tr").length;

  for (let i = 1; i < tableLength-1; i++) {
    document.querySelectorAll("tr")[1].remove();
  }
}

function getTotalCO2Emissions() {
   const categoriesCollections = document.querySelectorAll("option");
   const tableLength = categoriesCollections.length;
   const CO2Total = 0;
   const categoryMultiplier = {
    "Transport": 2,
    "Food & Drinks": 0.25,
    "Energy Use": 1.5,
    "Consumption & Products": 0.01,
    "Waste": 0.5,
    "Housing": 0.75,
    "Other": 1,
   };
   const globalAvgCO2Emissions = 25.9;

   for (let i = 0; i <= tableLength + 1; i++) {
    var category = categoriesCollections[i].value;

    if (!(category in categoryMultiplier)) {
      window.alert(
        `Please select a valid category or activity. \n
        \n
        E.g., 'Transport', 'Waste', or 'Other'.`
      );
    }
    
    CO2Total = CO2Total + (globalAvgCO2Emissions * categoryMultiplier[category]);
  }

  const HTMLDivTag = document.createElement("div");
  const CO2TotalString = `The total amount CO\<sub\>2\</sub\> emissions caused by the activities are ${CO2Total}`;
  const HTMLH3Tag = document.createElement("h3");
  HTMLH3Tag.textContent = CO2TotalString;

  HTMLDivTag.setAttribute("id", "co2-value");
  document.getElementById("co2-value").appendChild(HTMLH3Tag);
  document.getElementById("body-id").appendChild(HTMLDivTag);
}
