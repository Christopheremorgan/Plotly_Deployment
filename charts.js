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

// Create the buildCharts function.
function buildCharts(sample) {

  // Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {

  // Prep data for charts
      // Create a variable that holds the samples array.
        var sampleData = data.samples;

      // Create a variable that filters the samples for the object with the desired sample number.
        var sampleArray = sampleData.filter(sampleObj => sampleObj.id == sample);

      // Create a variable that holds the first sample in the array.
        var sampleInfo = sampleArray[0];

      // Create variables that hold the otu_ids, otu_labels, and sample_values.

        var otuID = sampleInfo.otu_ids;

        var otuLabel = sampleInfo.otu_labels;

        var sampleValue = sampleInfo.sample_values;
          

  // Create the horizontal bar chart
      // Create the yticks for the bar chart by getting top 10 otu_ids and map them in descending order
        //  so the otu_ids with the most bacteria are last.

        var topTenOtus = otuID.slice(0, 10).reverse();

        var topTenSamples = sampleValue.slice(0, 10).reverse();

        var topTenLabels = otuLabel.slice(0, 10).reverse();

        var yticks = topTenOtus.map(id => `OTU ${id}`);
           console.log(yticks);
 
      // Create the trace for the bar chart. 

        var trace1 = {
              x: topTenSamples,
              y: yticks,
              text: topTenLabels,
              type: "bar",
              orientation: "h"
          };

        var barData = [trace1];

      // Create the layout for the bar chart. 

        var barLayout = {
            title: "Top 10 Bacteria Cultures Found",
          };

      // Use Plotly to plot the data in a bar chart with the layout. 

        Plotly.newPlot("bar", barData, barLayout);

  // Create the bubble chart
      // Create the trace for the bubble chart.

        var bubbleData = [{
          x: otuID,
          y: sampleValue,
          text: otuLabel,
          mode: 'markers',
          marker: {
             color: otuID,
             size: sampleValue
          }
        }];

      // Create the layout for the bubble chart.

        var bubbleLayout = {
            title: "Bacteria Cultures per Sample",
            xaxis: { title: "OTU ID" },
            margin: {
                l: 100,
                r: 100,
                t: 100,
                b: 100
            },
            hovermode: 'closest'
           };

      // Use Plotly to plot the data on a bubble chart with a defined layout.

      Plotly.newPlot("bubble", bubbleData, bubbleLayout);
  });

  // Create the wash frequency gauge

    // Pull wash frequency data for gauge.
    d3.json("samples.json").then((data) => {
        var metadata = data.metadata;
        var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
        var result = resultArray[0];
        var washFreq = parseFloat(result.wfreq);
        console.log(washFreq);

    // Create the trace for the gauge chart.
        var gaugeData = [{
            value: washFreq,
            type: 'indicator',
            mode: 'gauge+number',
            gauge: {
                axis: { range: [null, 10] },
                bar: { color: "black" },
                steps: [
                    { range: [0, 2], color: "red" },
                    { range: [2, 4], color: "orange" },
                    { range: [4, 6], color: "yellow" },
                    { range: [6, 8], color: "lightgreen" },
                    { range: [8, 10], color: "green" }
                ]
            }             
        }];

    // Create the layout for the gauge chart.
        
        var gaugeLayout = {
            title: {
                text: `<b>Belly Button Washing Frequency</b> <br> Scrubs per Week` },       
        };

    // Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);

    }); 
};
