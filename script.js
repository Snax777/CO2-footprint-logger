const ACTIVITY_CATEGORY_DATA = [
  {
    activity: "Sitting/Sleeping",
    category: "Physical Activities",
    multiplier: 0.03,
  },
  {
    activity: "Walking/Running",
    category: "Physical Activities",
    multiplier: 0.5,
  },
  { activity: "Eating beef", category: "Food & Drinks", multiplier: 0.1 },
  { activity: "Eating hot chips", category: "Food & Drinks", multiplier: 0.05 },
  {
    activity: "Charging portable gadgets (e.g., smartphone, laptop, tablet)",
    category: "Energy Use",
    multiplier: 1.5,
  },
  {
    activity: "Buying clothes",
    category: "Consumption & Products",
    multiplier: 0.01,
  },
  {
    activity: "Using cosmetic products",
    category: "Consumption & Products",
    multiplier: 0.3,
  },
  { activity: "Recycling", category: "Waste", multiplier: 0.15 },
  {
    activity: "Using geyser",
    category: "Housing & Energy Use",
    multiplier: 0.8,
  },
  { activity: "Driving a car", category: "Transport", multiplier: 3 },
  { activity: "Riding a motorcycle", category: "Transport", multiplier: 1.75 },
  {
    activity: "Riding a bicycle",
    category: "Physical Activities",
    multiplier: 1.25,
  },
  { activity: "Exercising", category: "Physical Activities", multiplier: 1 },
  {
    activity: "Taking a taxi (regular, Uber, or Bolt)",
    category: "Transport",
    multiplier: 2,
  },
  {
    activity: "Watching TV",
    category: "Housing & Energy Use",
    multiplier: 1.5,
  },
  {
    activity: "Using refrigerator",
    category: "Housing & Energy Use",
    multiplier: 2.25,
  },
  {
    activity: "Making tea/coffee",
    category: "Food & Drinks",
    multiplier: 0.75,
  },
  { activity: "Making a braai", category: "Food & Drinks", multiplier: 1.25 },
  {
    activity: "Heating home",
    category: "Housing & Energy Use",
    multiplier: 2.5,
  },
  {
    activity: "Cooling/AC use",
    category: "Housing & Energy Use",
    multiplier: 3.0,
  },
  {
    activity: "Water heating",
    category: "Housing & Energy Use",
    multiplier: 1.8,
  },
  {
    activity: "Lighting home",
    category: "Housing & Energy Use",
    multiplier: 0.6,
  },
  {
    activity: "Hoovering carpet",
    category: "Housing & Energy Use",
    multiplier: 1.4,
  },
  {
    activity: "Washing dishes",
    category: "Housing & Energy Use",
    multiplier: 1.1,
  },
  { activity: "Cooking", category: "Housing & Energy Use", multiplier: .9 },
];
const GLOBAL_AVG_CO2_EMISSIONS = 25.9;
const SVG_NAMESPACE = "http://www.w3.org/2000/svg";

function addNewTableRow() {
  const newTableRow = document.createElement("tr");
  const newTableData = document.createElement("td");
  const newSelectActivity = document.createElement("select");
  newSelectActivity.className = "activity-values";

  const defaultActivityOption = document.createElement("option");
  defaultActivityOption.text = "Select an activity";
  defaultActivityOption.value = "all";
  defaultActivityOption.selected = true;
  defaultActivityOption.disabled = true;

  newSelectActivity.appendChild(defaultActivityOption);

  for (let i = 0; i < ACTIVITY_CATEGORY_DATA.length; i++) {
    const activityOption = document.createElement("option");

    activityOption.text = ACTIVITY_CATEGORY_DATA[i]["activity"];
    activityOption.value = ACTIVITY_CATEGORY_DATA[i]["activity"];

    newSelectActivity.appendChild(activityOption);
  }

  newTableData.appendChild(newSelectActivity);
  newTableRow.appendChild(newTableData);
  document.getElementById("table").appendChild(newTableRow);
  saveToLocalStorage();
}

function removeTableRow() {
  let tableRowLength = document
    .getElementById("table")
    .querySelectorAll("tr").length;

  if (tableRowLength > 2) {
    document.querySelectorAll("tr")[tableRowLength - 1].remove();
  }

  saveToLocalStorage();
}

function resetTable() {
  const tableLength = document
    .getElementById("table")
    .querySelectorAll("tr").length;

  for (let i = 1; i < tableLength; i++) {
    document.getElementById("table").querySelectorAll("tr")[1].remove();
  }

  addNewTableRow();
  document.getElementById("category-filter").value = "all";
  clearDynamicHTMLElements();

  localStorage.removeItem("footprintData");

  saveToLocalStorage();
}

function getTableData(nodeList, categoryFilter) {
  const activityMap = {};

  for (let i = 0; i < nodeList.length; i++) {
    const selectedActivity = nodeList[i].value;

    const data = ACTIVITY_CATEGORY_DATA.find(
      (obj) => obj.activity === selectedActivity
    );

    if (categoryFilter === "all" || data.category === categoryFilter) {
      const CO2Value = data.multiplier * GLOBAL_AVG_CO2_EMISSIONS;

      if (activityMap[selectedActivity]) {
        activityMap[selectedActivity].CO2Value += CO2Value;
      } else {
        activityMap[selectedActivity] = {
          ...data,
          CO2Value: CO2Value,
        };
      }
    }
  }

  return Object.values(activityMap);
}

function updateTableData(nodeList, categoryFilter) {
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
    "black",
    "midnightblue",
    "navy",
    "darkslategray",
    "maroon",
    "darkgreen",
    "darkolivegreen",
    "darkred",
    "saddlebrown",
    "indigo",
    "darkmagenta",
    "darkslateblue",
    "darkcyan",
    "firebrick",
    "teal",
    "darkgoldenrod",
    "mediumvioletred",
    "violet",
    "silver"
  ];

  let tableData = getTableData(nodeList, categoryFilter);
  const CO2Total = calculateCO2Emissions(nodeList, categoryFilter);

  let lastStop = 0;

  for (let i = 0; i < tableData.length; i++) {
    const CO2Value = tableData[i]["CO2Value"];
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

function createPieChart(nodeList, categoryFilter) {
  if (document.getElementById("pie-chart")) {
    document.getElementById("pie-chart").remove();
  }

  let newDivElement = document.createElement("div");
  newDivElement.id = "pie-chart";

  let newSVGCanvasElement = document.createElementNS(SVG_NAMESPACE, "svg");
  newSVGCanvasElement.setAttribute("width", "80vw");
  newSVGCanvasElement.setAttribute("height", "75vh");
  newSVGCanvasElement.setAttribute("viewBox", "0 0 500 500");
  newSVGCanvasElement.setAttribute("preserveAspectRatio", "xMidYMid meet");

  let updatedTableData = updateTableData(nodeList, categoryFilter);

  for (let i = 0; i < updatedTableData.length; i++) {
    const newCircleElement = document.createElementNS(SVG_NAMESPACE, "circle");

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

    newSVGCanvasElement.appendChild(newCircleElement);
  }

  newDivElement.appendChild(newSVGCanvasElement);
  document.body.appendChild(newDivElement);

  if (document.getElementById("pie-chart")) {
    createLegendTable(updatedTableData, categoryFilter);
  }
}

function createLegendTable(objectDataArray, categoryFilter) {
  if (document.getElementById("legend-id")) {
    document.getElementById("legend-id").remove();
  }

  const legendDiv = document.createElement("div");
  legendDiv.id = "legend-id";
  const legendTable = document.createElement("table");
  legendTable.id = "legend-table";

  const headerRow1 = document.createElement("tr");
  const header1 = document.createElement("th");
  header1.setAttribute("colspan", "4");
  header1.innerHTML = "CO<sub>2</sub> Data Legend";

  headerRow1.appendChild(header1);
  legendTable.appendChild(headerRow1);

  let columnNames = [
    "Activity",
    "Category",
    "Colour",
    "CO<sub>2</sub> Emissions (%)",
  ];

  if (categoryFilter != "all") {
    header1.setAttribute("colspan", "3");
    columnNames = columnNames.filter((item) => item !== "Category");
  }

  const headerRow2 = document.createElement("tr");

  for (const column of columnNames) {
    const header2 = document.createElement("th");
    header2.innerHTML = column;

    headerRow2.appendChild(header2);
    legendTable.appendChild(headerRow2);
  }

  for (let data of objectDataArray) {
    let dataArray = [
      data["activity"],
      data["category"],
      data["stroke"],
      data["percentage"],
    ];

    if (columnNames.length === 3) {
      dataArray.splice(1, 1);
    }

    let dataRow = document.createElement("tr");

    for (let i = 0; i < dataArray.length; i++) {
      const tableData = document.createElement("td");
      tableData.innerHTML = dataArray[i];

      if (i === 1 && dataArray.length === 3) {
        tableData.style.backgroundColor = dataArray[i];
      } else if (i === 2 && dataArray.length === 4) {
        tableData.style.backgroundColor = dataArray[i];
      } else {
        tableData.style.backgroundColor = "gray";
      }

      dataRow.appendChild(tableData);
    }

    legendTable.appendChild(dataRow);
  }

  legendDiv.appendChild(legendTable);
  document.body.appendChild(legendDiv);
}

function updateCO2Emissions(nodeList, categoryFilter) {
  let CO2Value = calculateCO2Emissions(nodeList, categoryFilter);

  if (CO2Value === undefined) {
    clearDynamicHTMLElements();
  } else {
    if (
      document.getElementById("co2-result") ||
      document.getElementById("no-data-result")
    ) {
      clearDynamicHTMLElements();
    }

    let element = document.createElement("p");
    element.id = "co2-value";
    let div = document.createElement("div");

    if (CO2Value) {
      div.id = "co2-result";
      element.innerHTML =
        "The total CO<sub>2</sub> emissions is " +
        CO2Value.toFixed(2) +
        " kg CO<sub>2</sub>.";

      div.appendChild(element);
      document.getElementById("body-id").appendChild(div);

      createPieChart(nodeList, categoryFilter);
    } else {
      clearDynamicHTMLElements();

      div.id = "no-data-result";
      element.innerHTML =
        "There is no data based on the selected category filter: '" +
        categoryFilter +
        "'.";

      div.appendChild(element);
      document.getElementById("body-id").appendChild(div);
    }
  }
}

function checkActivityOptionValues(activityNodeList) {
  for (let i = 0; i < activityNodeList.length; i++) {
    let activity =
      activityNodeList[i].options[
        activityNodeList[i].selectedIndex
      ].text.trim();

    if (activity === "Select an activity") {
      return false;
    }
  }

  return true;
}

function clearDynamicHTMLElements() {
  if (document.getElementById("co2-result")) {
    document.getElementById("co2-result").remove();
  }

  if (document.getElementById("no-data-result")) {
    document.getElementById("no-data-result").remove();
  }

  if (document.getElementById("filter-id")) {
    document.getElementById("filter-id").remove();
  }

  if (document.getElementById("pie-chart")) {
    document.getElementById("pie-chart").remove();
  }

  if (document.getElementById("legend-id")) {
    document.getElementById("legend-id").remove();
  }
}

function calculateCO2Emissions(nodeList, categoryFilter) {
  let CO2Total = 0;
  let tableData = getTableData(nodeList, categoryFilter);

  if (!checkActivityOptionValues(nodeList)) {
    window.alert("Please select an activity.");
    clearDynamicHTMLElements();
    return;
  } else {
    for (let data of tableData) {
      CO2Total += data.CO2Value;
    }
  }

  return CO2Total;
}

function getTotalCO2Emissions() {
  const allSelectedActivitiesNodeList =
    document.querySelectorAll(".activity-values");
  const category = document.getElementById("category-filter").value;

  updateCO2Emissions(allSelectedActivitiesNodeList, category);
  saveToLocalStorage();
}

function loadFromLocalStorage() {
  const savedData = JSON.parse(localStorage.getItem("footprintData"));

  if (!savedData) return;

  const { activities, category } = savedData;

  const table = document.getElementById("table");
  while (table.rows.length > 1) {
    table.deleteRow(1);
  }

  for (let i = 0; i < activities.length; i++) {
    addNewTableRow();
  }

  const activityDropdowns = document.querySelectorAll(".activity-values");
  for (let i = 0; i < activities.length; i++) {
    activityDropdowns[i].value = activities[i];
  }

  document.getElementById("category-filter").value = category;
}

function saveToLocalStorage() {
  const activityDropdowns = document.querySelectorAll(".activity-values");
  const selectedActivities = Array.from(activityDropdowns).map(
    (dropdown) => dropdown.value
  );
  const selectedCategory = document.getElementById("category-filter").value;

  const dataToSave = {
    activities: selectedActivities,
    category: selectedCategory,
  };

  localStorage.setItem("footprintData", JSON.stringify(dataToSave));
}

window.onload = () => {
  loadFromLocalStorage();
};
