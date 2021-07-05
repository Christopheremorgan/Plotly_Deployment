function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options

    d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected

  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {

  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {

  // Prep data for charts
      // 3. Create a variable that holds the samples array.
        var sampleData = data.samples;

      // 4. Create a variable that filters the samples for the object with the desired sample number.
        var sampleArray = sampleData.filter(sampleObj => sampleObj.id == sample);

      // 5. Create a variable that holds the first sample in the array.
        var sampleInfo = sampleArray[0];

      // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.

        var otuID = sampleInfo.otu_ids;

        var otuLabel = sampleInfo.otu_labels;

        var sampleValue = sampleInfo.sample_values;
          console.log(sampleValue);

  // Create the horizontal bar chart
      // 7. Create the yticks for the bar chart by getting top 10 otu_ids and map them in descending order
        //  so the otu_ids with the most bacteria are last.

        var topTenOtus = otuID.slice(0, 10).reverse();

        var topTenSamples = sampleValue.slice(0, 10).reverse();
           console.log(topTenSamples);

        var yticks = topTenOtus.map(id => `OTU ${id}`);
           console.log(yticks);
 
      // 8. Create the trace for the bar chart. 

        var trace1 = {
              x: topTenSamples,
              y: yticks,
              text: otuLabel,
              type: "bar",
              orientation: "h"
          };

        var barData = [trace1];

      // 9. Create the layout for the bar chart. 

        var barLayout = {
            title: "Top 10 Bacteria Cultures Found",
          };

      // 10. Use Plotly to plot the data in a bar chart with the layout. 

        Plotly.newPlot("bar", barData, barLayout);

  // Create the bubble chart
      // 1. Create the trace for the bubble chart.

        var bubbleData = [{
          x: yticks,
          y: topTenSamples,
          text: otuLabel,
          mode: 'markers',
          marker: {
              color: ['rgb(93, 164, 214)', 'rgb(255, 144, 14)', 'rgb(44, 160, 101)', 'rgb(255, 65, 54)'],
              size: [40, 60, 80, 100]
          }
        }];

      // 2. Create the layout for the bubble chart.

        var bubbleLayout = {
            title: "Bacteria Cultures per Sample"
            xaxis: "OTU ID"

           };

      // 3. Use Plotly to plot the data with the layout.

      Plotly.newPlot("bubble", bubbleData, bubbleLayout); 

   }); 
};
