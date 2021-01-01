// Append sample ids to the dropdown menu 
d3.json('samples.json').then((data)=>{
    var id=data.names;
    console.log(data.metadata);
    var select=d3.selectAll('#selDataset');
    Object.entries(id).forEach(([key,value])=>{
        select.append('option').text(value);
    })
})
