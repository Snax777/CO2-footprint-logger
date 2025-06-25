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
  document.getElementById("table").appendChild(addCategoryData());

  const tableLength = document.querySelectorAll("tr").length;

  for (let i = 1; i < tableLength-1; i++) {
    document.querySelectorAll("tr")[1].remove();
  }
}
