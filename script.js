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
const CATEGORY_MULTIPLIER = {
  Transport: 2,
  "Food & Drinks": 0.25,
  "Energy Use": 1.5,
  "Consumption & Products": 0.01,
  Waste: 0.5,
  Housing: 0.75,
  Other: 1,
};
const GLOBAL_AVG_CO2_EMISSIONS = 25.9;
const SVG_NAMESPACE = "http://www.w3.org/2000/svg";

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
  var tableRowLength = document
    .getElementById("table")
    .querySelectorAll("tr").length;

  if (tableRowLength > 2) {
    document.querySelectorAll("tr")[tableRowLength - 1].remove();
  }
}

function resetTable() {
  const tableLength = document
    .getElementById("table")
    .querySelectorAll("tr").length;

  for (let i = 1; i < tableLength; i++) {
    document.getElementById("table").querySelectorAll("tr")[1].remove();
  }

  addTableRow();
  clearDynamicHTMLElements();
}

function getTableData(nodeList) {
  let dataArray = [];
  let dataSummaryArray = [];

  for (let i = 0; i < nodeList.length; i++) {
    let data = {};
    const category = nodeList[i].options[nodeList[i].selectedIndex].text.trim();
    data[category] = CATEGORY_MULTIPLIER[category] * GLOBAL_AVG_CO2_EMISSIONS;

    dataArray.push(data);
  }

  CATEGORY_ARRAY.forEach((category) => {
    let total = dataArray.reduce((sum, obj) => {
      return sum + (obj[category] ?? 0);
    }, 0);

    if (total > 0) {
      let data = {};
      data[category] = total;

      dataSummaryArray.push(data);
    }
  });

  return dataSummaryArray;
}

function updateTableData(
  nodeList1,
  nodeListLength1,
  nodeList2,
  nodeListLength2
) {
  const pi = Math.PI;
  const cx = "250";
  const cy = "250";
  let radius = "75";
  const strokeWidth = (parseInt(radius) * 2).toString();
  const circumference = 2 * parseInt(radius) * pi;
  const colorsArray = [
    "aqua",
    "crimson",
    "slategray",
    "darkorange",
    "royalblue",
    "gold",
  ];

  let tableData = getTableData(nodeList2);
  const CO2Total = calculateCO2Emissions(
    nodeList1,
    nodeListLength1,
    nodeList2,
    nodeListLength2
  );

  let lastStop = 0;

  for (let i = 0; i < tableData.length; i++) {
    const CO2Key = Object.keys(tableData[i])[0];
    const CO2Value = tableData[i][CO2Key];
    const gapLength = Math.round((CO2Value / CO2Total) * circumference);
    const remainingLength = Math.round(circumference - gapLength);
    const percentage = ((CO2Value / CO2Total) * 100).toFixed(2);

    tableData[i]["cx"] = cx;
    tableData[i]["cy"] = cy;
    tableData[i]["r"] = radius;
    tableData[i]["fill"] = "transparent";
    tableData[i]["stroke"] = colorsArray[i];
    tableData[i]["stroke-linecap"] = "butt";
    tableData[i]["stroke-width"] = strokeWidth;
    tableData[i]["stroke-dasharray"] = `${gapLength} ${remainingLength}`;
    tableData[i]["stroke-dashoffset"] = `${lastStop}`;
    tableData[i]["percentage"] = percentage + "%";

    lastStop -= gapLength;
  }

  return tableData;
}

function createFilter(nodeList1, nodeList2) {
  const nodeLength = nodeList2.length;
  let newDivElement = document.createElement("div");
  newDivElement.id = "filter-id";
  let newDropdownElement = document.createElement("select");
  newDropdownElement.id = "category-filter-id";
  let newOptionElement = document.createElement("option");
  newOptionElement.className = "category-filter";
  newOptionElement.innerText = "Filter by <Category>";
  newOptionElement.value = "all";
  let categoryArray = [];

  newDropdownElement.appendChild(newOptionElement);

  for (let i = 0; i < nodeLength; i++) {
    const selectedCategory =
      nodeList2[i].options[nodeList2[i].selectedIndex].text.trim();

    if (!categoryArray.includes(selectedCategory)) {
      categoryArray.push(selectedCategory);

      let optionElement = document.createElement("option");
      optionElement.className = newOptionElement.className;
      optionElement.innerText = selectedCategory;
      optionElement.value = selectedCategory;

      newDropdownElement.appendChild(optionElement);
    }
  }

  if (document.getElementById("filter-id")) {
    document.getElementById("filter-id").remove();
  }

  newDivElement.appendChild(newDropdownElement);
  document.getElementById("body-id").appendChild(newDivElement);

  document.getElementById("category-filter-id").onchange = () =>
    createPieChart(nodeList1, nodeList2);
}

function createPieChart(nodeList1, nodeList2) {
  if (document.getElementById("chart-id")) {
    document.getElementById("chart-id").remove();
  }

  let newDivElement = document.createElement("div");
  newDivElement.id = "chart-id";

  let newSVGCanvasElement = document.createElementNS(SVG_NAMESPACE, "svg");
  newSVGCanvasElement.setAttribute("width", "80vw");
  newSVGCanvasElement.setAttribute("height", "75vh");
  newSVGCanvasElement.setAttribute("viewBox", "0 0 500 500");
  newSVGCanvasElement.setAttribute("preserveAspectRatio", "xMidYMid meet");

  const defaultColor = "gainsboro";

  let updatedTableData = updateTableData(
    nodeList1,
    nodeList1.length,
    nodeList2,
    nodeList2.length
  );
  const categoryFilterElement = document.getElementById("category-filter-id");
  const filter = categoryFilterElement?.value || "all";

  for (let i = 0; i < updatedTableData.length; i++) {
    const newCircleElement = document.createElementNS(SVG_NAMESPACE, "circle");
    const CO2Key = Object.keys(updatedTableData[i])[0];
    const color = updatedTableData[i]["stroke"];

    newCircleElement.setAttribute("cx", updatedTableData[i]["cx"]);
    newCircleElement.setAttribute("cy", updatedTableData[i]["cy"]);
    newCircleElement.setAttribute("r", updatedTableData[i]["r"]);
    newCircleElement.setAttribute("fill", updatedTableData[i]["fill"]);
    newCircleElement.setAttribute("stroke", updatedTableData[i]["stroke"]);
    newCircleElement.setAttribute(
      "stroke-linecap",
      updatedTableData[i]["stroke-linecap"]
    );
    newCircleElement.setAttribute(
      "stroke-width",
      updatedTableData[i]["stroke-width"]
    );
    newCircleElement.setAttribute(
      "stroke-dasharray",
      updatedTableData[i]["stroke-dasharray"]
    );
    newCircleElement.setAttribute(
      "stroke-dashoffset",
      updatedTableData[i]["stroke-dashoffset"]
    );

    newCircleElement.setAttribute("data-category", CO2Key);

    if (filter === "all" || filter === CO2Key) {
      newCircleElement.setAttribute("stroke", color);
    } else {
      newCircleElement.setAttribute("stroke", defaultColor);
    }

    newSVGCanvasElement.appendChild(newCircleElement);
  }

  newDivElement.appendChild(newSVGCanvasElement);
  document.body.appendChild(newDivElement);
}

function createLegendTable(nodeList1, nodeList2) {
  if (document.getElementById("legend-id")) {
    document.getElementById("legend-id").remove();
  }

  const updatedTableData = updateTableData(
    nodeList1,
    nodeList1.length,
    nodeList2,
    nodeList2.length
  );
  const legendDiv = document.createElement("div");
  legendDiv.id = "legend-id";
  const legendTable = document.createElement("table");
  legendTable.id = "legend-table";

  const headerRow1 = document.createElement("tr");
  const header1 = document.createElement("th");
  header1.setAttribute("colspan", "3");
  header1.innerHTML = "CO<sub>2</sub> Data Legend";

  headerRow1.appendChild(header1);
  legendTable.appendChild(headerRow1);

  const columnNames = ["Category", "Colour", "CO<sub>2</sub> Emissions %"];

  const headerRow2 = document.createElement("tr");

  for (const column of columnNames) {
    const header2 = document.createElement("th");
    header2.innerHTML = column;

    headerRow2.appendChild(header2);
    legendTable.appendChild(headerRow2);
  }

  for (const data of updatedTableData) {
    let dataArray = [Object.keys(data)[0], data["stroke"], data["percentage"]];
    let dataRow = document.createElement("tr");

    for (let i = 0; i < 3; i++) {
      const tableData = document.createElement("td");
      tableData.innerHTML = dataArray[i];

      if (i === 1) {
        tableData.style.backgroundColor = dataArray[i];
      }

      dataRow.appendChild(tableData);
    }

    legendTable.appendChild(dataRow);
  }

  legendDiv.appendChild(legendTable);
  document.body.appendChild(legendDiv);
}

function updateCO2Emissions(nodeList1, length1, nodeList2, length2) {
  let CO2Value = calculateCO2Emissions(nodeList1, length1, nodeList2, length2);

  if (CO2Value === undefined) {
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
      CO2Value.toFixed(2) +
      " kg CO<sub>2</sub>.";

    div.appendChild(element);
    document.getElementById("body-id").appendChild(div);

    createFilter(nodeList1, nodeList2);
    createLegendTable(nodeList1, nodeList2);
    createPieChart(nodeList1, nodeList2);
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

  if (document.getElementById("chart-id")) {
    document.getElementById("chart-id").remove();
  }

  if (document.getElementById("legend-id")) {
    document.getElementById("legend-id").remove();
  }
}

function calculateCO2Emissions(nodeList1, length1, nodeList2, length2) {
  let CO2Total = 0;
  const tableDataSummary = getTableData(nodeList2);

  if (!checkActivityOptionValues(nodeList1, length1)) {
    window.alert("Please select an activity.");
    clearDynamicHTMLElements();
    return;
  } else if (!checkCategoryOptionValues(nodeList2, length2)) {
    window.alert("Please select a category.");
    clearDynamicHTMLElements();
    return;
  } else {
    for (let i = 0; i < tableDataSummary.length; i++) {
      for (const category of CATEGORY_ARRAY) {
        if (tableDataSummary[i][category] != undefined) {
          CO2Total += tableDataSummary[i][category];
        }
      }
    }

    return CO2Total;
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

window.addEventListener("beforeunload", () => {
  const rows = document.querySelectorAll("#table tr");
  const tableState = [];

  rows.forEach((row) => {
    const activitySelect = row.querySelector(".activity-values");
    const categorySelect = row.querySelector(".category-values");

    if (activitySelect && categorySelect) {
      tableState.push({
        activity: activitySelect.value,
        category: categorySelect.value,
      });
    }
  });

  localStorage.setItem("tableState", JSON.stringify(tableState));
});

window.addEventListener("DOMContentLoaded", () => {
  const savedTableState = JSON.parse(localStorage.getItem("tableState"));

  if (savedTableState && savedTableState.length > 0) {
    const table = document.getElementById("table");

    while (table.rows.length > 1) {
      table.deleteRow(1);
    }

    savedTableState.forEach((rowData) => {
      const newRow = addCategoryData();

      const activitySelect = newRow.querySelector(".activity-values");
      const categorySelect = newRow.querySelector(".category-values");

      if (activitySelect) {
        activitySelect.value = rowData.activity;
      }

      if (categorySelect) {
        categorySelect.value = rowData.category;
      }

      table.appendChild(newRow);
    });
  }
});
