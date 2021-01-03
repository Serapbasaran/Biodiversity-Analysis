// Set up the initial position of the page by sample IDs to the dropdown menu




d3.json('samples.json').then((data)=>{
    var id=data.names;
    console.log(data.metadata);
    var dropdownmenu = d3.selectall('#selDataset');

    Object.entries(id).forEach(([i,v])=>{
        dropdownmenu.append('option').text(v);
    })
})

