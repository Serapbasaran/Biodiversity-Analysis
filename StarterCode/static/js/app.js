// Set up the initial position of the page by sample IDs to the dropdown menu
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

      });
     };
    function optionChanged(newID) {
        // Fetch new data each time a new subject ID is selected
        barChart(newID);
        bubbleChart(newID);
        metaData(newID)
    };
    init ();


    function barChart(subjectId){
        d3.json('samples.json').then((data)=>{
            var samples=data.samples;
            var testNum=samples.map(row=>row.id).indexOf(subjectId);
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
    
    function bubbleChart(subjectID){
        d3.json('samples.json').then((data)=>{
            var samples=data.samples;
            var testNum=samples.map(row=>row.id).indexOf(subjectID);
            var otu_ids = samples.map(row => row.otu_ids);
            var otu_ids = otu_ids[testNum];            
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
                           width: 1000,
                           margin: {t:0, t:30}
                         };
            Plotly.newPlot('bubble',[trace1], layout);
        })
    };


// Display the metadata for each test object ID selected;

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