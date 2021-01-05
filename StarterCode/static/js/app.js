// Set up the initial position of the page by sample IDs to the dropdown menu
function init (){
    var dropdown = d3.selectAll('#selDataset');

    d3.json('samples.json').then((data)=>{
    
        var sampleNames=data.names;
        sampleNames.forEach((sample) => {
            dropdown
              .append("option")
              .text(sample)
              .property("value", sample);
            });
      
        var initSample = sampleNames[0];
    
        barChart(initSample);
        bubbleChart(initSample);
        metaData(initSample);

      });
     };
    function optionChanged(newSample) {
        // Fetch new data each time a new sample is selected
        barChart(newSample);
        bubbleChart(newSample);
        metaData(newSample)
    };
    init ();


    function barChart(sampleId){
        d3.json('samples.json').then((data)=>{
            var samples=data.samples;
            var testNum=samples.map(row=>row.id).indexOf(sampleId);
            console.log(testNum)
            var otuValueTen=samples.map(row=>row.sample_values);
            var otuValueTen=otuValueTen[testNum].slice(0,10).reverse();
            var otuIdTen=samples.map(row=>row.otu_ids);
            var otuIdTen=otuIdTen[testNum].slice(0,10);
            var otuLabelTen=samples.map(row=>row.otu_labels).slice(0,10);
            
            var trace={
                x: otuValueTen,
                y: otuIdTen.map(r=>`UTO ${r}`),
                text: otuLabelTen,
                type:'bar',
                orientation:'h'
            }
            Plotly.newPlot('bar',[trace]);
        })
    };
    
    function bubbleChart(sampleID){
        d3.json('samples.json').then((data)=>{
            var samples=data.samples;
            var testNum=samples.map(row=>row.id).indexOf(sampleID);
            var otu_ids = samples.map(row => row.otu_ids);
            var otu_ids = otu_ids[testNum];
            console.log(otu_ids)
            var sample_values = samples.map(row => row.sample_values);
            var sample_values = sample_values[testNum];
            var otu_labels = samples.map(row => row.otu_labels);
            var otu_labels = otu_labels[testNum];
            var trace1 = {
                x: otu_ids,
                y: sample_values,
                text: otu_labels,
                mode: 'markers',
                marker: {size: sample_values, 
                         color: otu_ids
                        }
                };                       
                
            var layout = { xaxis: {title: 'OTU ID'},
                           height: 600,
                           width: 1000
                         };
            Plotly.newPlot('bubble',[trace1], layout);
        })
    };


// Display the sample metadata for each UTO_ID selected;

function metaData(sampleID) {
    d3.json("samples.json").then((data) => {
      var metadata = data.metadata;
      // Filter the data for the object with the desired sample number
      var resultArray = metadata.filter(object => object.id == sampleID);
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