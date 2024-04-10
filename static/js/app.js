// Function to fetch data from the JSON file
function fetchData() {
    // Use d3.json to fetch data from the specified URL
    d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then(function(data) {
      // Call function to create dropdown options
      createDropdown(data.names);
  
      // Call function to initialize dashboard with default sample
      updateDashboard(data.names[0], data);
    });
  }
  
  // Function to create dropdown options
  function createDropdown(names) {
    // Select the HTML element with id "selDataset"
    var dropdown = d3.select("#selDataset");
    
    // For each name in the provided array, append an <option> element to the dropdown
    dropdown.selectAll("option")
      .data(names)
      .enter()
      .append("option")
      .attr("value", function(d) { return d; })
      .text(function(d) { return d; });
  }
  
  // Function to update dashboard elements based on selected sample
  function updateDashboard(sample, data) {
    // Fetch data for selected sample
    console.log("Data")
    console.log(sample);
    console.log(data);
    var sampleData = data.samples.filter(item => item.id === sample);
    var metadata = data.metadata.filter(item => item.id === parseInt(sample));
    console.log("Filtered Data")
    console.log(sampleData)
    console.log(metadata)
  
    // Update demographic info
    updateDemographicInfo(metadata);
  
    // Update bar chart
    updateBarChart(sampleData);
  
    // Update bubble chart
    updateBubbleChart(sampleData);
  }
  
  // Function to update demographic info display
  function updateDemographicInfo(metadata) {
    console.log("Updating Demographic Info...");
    console.log(metadata);
    // Select the HTML element with id "sample-metadata"
    var metadataPanel = d3.select("#sample-metadata");
    metadataPanel.html("");
    
    // For each key-value pair in the metadata, append a <p> element to display the information
    Object.entries(metadata[0]).forEach(([key, value]) => {
      metadataPanel.append("p").text(`${key}: ${value}`);
    });
  }
  
  // Function to update bar chart
  function updateBarChart(sampleData) {
    console.log("Updating Bar Chart...");
    console.log(sampleData)
    var otuIds = sampleData[0].otu_ids.slice(0, 10).reverse();
    var sampleValues = sampleData[0].sample_values.slice(0, 10).reverse();
    var otuLabels = sampleData[0].otu_labels.slice(0, 10).reverse();
    
    // Define the trace for the bar chart
    var trace = {
      x: sampleValues,
      y: otuIds.map(id => `OTU ${id}`),
      text: otuLabels,
      type: "bar",
      orientation: "h"
    };
    
    // Define layout options for the bar chart
    var layout = {
      title: "Top 10 OTUs",
      yaxis: {
        automargin: true
      }
    };
    
    // Define data array containing the trace
    var data = [trace];
    
    // Create the bar chart using Plotly
    Plotly.newPlot("bar", data, layout);
  }
  
  // Function to update bubble chart
  function updateBubbleChart(sampleData) {
    // Define the trace for the bubble chart
    console.log("Updating Bubble Chart...");
    console.log(sampleData)
    var trace = {
      x: sampleData[0].otu_ids,
      y: sampleData[0].sample_values,
      text: sampleData[0].otu_labels,
      mode: "markers",
      marker: {
        size: sampleData[0].sample_values,
        color: sampleData[0].otu_ids
      }
    };
    // Define layout options for the bubble chart
    var layout = {
      title: "OTU Bubble Chart",
      xaxis: { title: "OTU ID" },
      yaxis: { title: "Sample Value" }
    };
    
    // Define data array containing the trace
    var data = [trace];
    
    // Create the bubble chart using Plotly
    Plotly.newPlot("bubble", data, layout);
  }
  
  // Function to handle dropdown change
  function optionChanged(sample) {
    // When the dropdown value changes, fetch data again and update dashboard
    d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then(function(data) {
      updateDashboard(sample, data);
    });
  }
  
// Function to update gauge chart
function updateGaugeChart(washingFrequency) {
  var data = [
      {
          domain: { x: [0, 1], y: [0, 1] },
          value: washingFrequency,
          title: { text: "Belly Button Washing Frequency<br> Scrubs per Week" },
          type: "indicator",
          mode: "gauge+number",
          gauge: {
              axis: { range: [0, 9] },
              steps: [
                  { range: [0, 1], color: "#f7f7f7" },
                  { range: [1, 2], color: "#d9f0d3" },
                  { range: [2, 3], color: "#aed9e0" },
                  { range: [3, 4], color: "#9fc7ba" },
                  { range: [4, 5], color: "#76b7d3" },
                  { range: [5, 6], color: "#5991a8" },
                  { range: [6, 7], color: "#4d7590" },
                  { range: [7, 8], color: "#2e5179" },
                  { range: [8, 9], color: "#0d3045" }
              ],
              threshold: {
                  line: { color: "red", width: 4 },
                  thickness: 0.75,
                  value: washingFrequency
              }
          }
      }
  ];

  var layout = { width: 400, height: 300, margin: { t: 0, b: 0 } };
  Plotly.newPlot('gauge', data, layout);
}

// Function to update dashboard elements based on selected sample
function updateDashboard(sample, data) {
  // Fetch data for the selected sample
  var sampleData = data.samples.filter(item => item.id === sample);
  var metadata = data.metadata.filter(item => item.id === parseInt(sample));

  // Update demographic info
  updateDemographicInfo(metadata);

  // Update gauge chart
  updateGaugeChart(metadata[0].wfreq); // Assuming "wfreq" is the key for weekly washing frequency

  // Update bar chart
  updateBarChart(sampleData);

  // Update bubble chart
  updateBubbleChart(sampleData);
}

// Call the fetchData function to initialize the dashboard
  fetchData();