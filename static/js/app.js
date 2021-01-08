// Build the initial position of the page by setting the default Subject ID number from dropdown menu
function init (){
    var selector = d3.selectAll('#selDataset');

    d3.json('samples.json').then((data)=>{
    
        var sampleNames=data.names;
        sampleNames.forEach((sample) => {
            selector
              .append("option")
              .text(sample)
              .property("value", sample);
            });
      
        var defaultID = sampleNames[0];
    
        barChart(defaultID);
        bubbleChart(defaultID);
        metaData(defaultID);
        gaugeChart(defaultID)

      });
     };

// Refresh the data each time when a new subject ID is selected
    function optionChanged(newID) {
        barChart(newID);
        bubbleChart(newID);
        metaData(newID);
        gaugeChart(newID)
    };
    init ();

// Create a horizontal bar chart for selected Subject ID to display the top 1O OTUs found in that individual
    function barChart(subjectId){
        d3.json('samples.json').then((data)=>{
            var samples = data.samples;
            var ID = samples.map(row=>row.id).indexOf(subjectId);
            var otuValueTen = samples.map(row=>row.sample_values);
            var otuValueTen = otuValueTen[ID].slice(0,10).reverse();
            var otuIdTen = samples.map(row=>row.otu_ids);
            var otuIdTen = otuIdTen[ID].slice(0,10);
            var otuLabelTen = samples.map(row=>row.otu_labels).slice(0,10);
            
            var trace={
                x: otuValueTen,
                y: otuIdTen.map(r=>`UTO ${r}`),
                text: otuLabelTen,
                type:'bar',
                orientation:'h'
            }
            var layout = {title: "Top 10 OTUs Found", margin: { t: 30, l: 150 }};
      
           Plotly.newPlot('bar',[trace],layout);
        })
    };
 // Create a bubble chart that displays each sample for the selected subject ID
    function bubbleChart(subjectID){
        d3.json('samples.json').then((data)=>{
            var samples=data.samples;
            var ID= samples.map(row=>row.id).indexOf(subjectID);
            var otuIds = samples.map(row => row.otu_ids);
            var otuIds = otuIds[ID];            
            var sampleValues = samples.map(row => row.sample_values);
            var sampleValues = sampleValues[ID];
            var otuLabels = samples.map(row => row.otu_labels);
            var otuLabels = otuLabels[ID];
            var trace1 = {
                x: otuIds,
                y: sampleValues,
                text: otuLabels,
                mode: 'markers',
                marker: {size: sampleValues, 
                         color: otuIds
                        }
                };                       
                
            var layout = { xaxis: {title: 'OTU ID'},
                           height: 600,
                           width: 1000,
                         };
            Plotly.newPlot('bubble',[trace1], layout);
        })
    };


// Display the metadata for each test subject ID selected;

function metaData(subjectID) {
    d3.json("samples.json").then((data) => {
      var metadata = data.metadata;
      // Filter the data for the selected ID number 
      var filteredData = metadata.filter(object => object.id == subjectID);
      var result = filteredData[0];
      // Use d3 to select the panel with id of `#sample-metadata`
      var panel = d3.select("#sample-metadata");
  
      // Use `.html("") to clear any existing metadata
          panel.html("");
  
      // Use `Object.entries` to add each key and value pair to the panel
          Object.entries(result).forEach(([key, value]) => {
          panel.append("h6").text(`${key.toUpperCase()}: ${value}`);
      });
    });
} 

// Adapt a Gauge chart to plot weekly washing frequency of the individual
function gaugeChart(subjectID) {
    d3.json("samples.json").then((data) => {
        var metadata = data.metadata;
        // Filter the data for the selected ID number 
        var filteredData = metadata.filter(object => object.id == subjectID);
        var result = filteredData[0];
        var wfreqValue = result.wfreq;
        console.log(wfreqValue);
        var data = [
            {
              type: "indicator",
              mode: "gauge+number",
              value: wfreqValue,
              title: { text: "Belly Button Washing Frequency per Week", font: { size: 18 } },
              gauge: {
                axis: { range: [null, 9], tickwidth: 1, tickcolor: "black" }, // Max value is 9
                bar: { color: "gray" },  
                bgcolor: "white",
                borderwidth: 2,
                bordercolor: "gray",
                // Set the colors for the different ranges on the gauge
                steps: [
                  { range: [0, 1], color: "rgb(255, 255, 255)" },
                  { range: [1, 2], color: "rgb(232,226,202)"},
                  { range: [2, 3], color: "rgb(255, 247, 230)"},
                  { range: [3, 4], color: "rgb(255, 218, 179)"},
                  { range: [4, 5], color: "rgb(255, 206, 153)"},
                  { range: [5, 6], color: "rgb(255, 193, 128)"},
                  { range: [6, 7], color: "rgb(255, 181, 102)" },
                  { range: [7, 8], color: "rgb(255, 169, 77)" },
                  { range: [8, 9], color: "rgb(255, 133, 51)" }
                ],  
              }  
            }  
            
          ];
          
          var layout = {
            width: 500,
            height: 400,
            margin: { t: 25, r: 25, l: 25, b: 25 },
            paper_bgcolor: "lavender",
            font: { color: "rgb(51, 102, 255)", family: "Arial" }
          };  

        Plotly.newPlot("gauge", data, layout);
    
});
}