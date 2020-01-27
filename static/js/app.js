// Create the url to the samples.json file
const jsonurl = "../assets/samples.json";

// store the raw data in ram so we dont have to query it everytime we call the function
const rawData = d3.json(jsonurl);

// Define a function that fetch the info for a specific individual
function individual(idNum = 940){
    rawData.then(function(data) {
        var filteredsample = data.samples.filter(item => item.id == idNum);
        var filterMetadata = data.metadata.filter(item => item.id == idNum);
        console.log(filteredsample);

        // Bar chat
        var trace_bar = {
            x : filteredsample[0].sample_values.slice(0,10).reverse(),
            y : filteredsample[0].otu_ids.slice(0,10).reverse().map(num => `OUT ${num}`),
            text : filteredsample[0].otu_labels.slice(0,10).reverse(),
            type : "bar",
            orientation : "h",
        };
        let layout = {
            title : `Top 10 OTUs for ID ${filteredsample[0].id}`,
            yaxis : {
                type : "category"
            }
        }
        let plotdata = [trace_bar];
        Plotly.newPlot("bar",plotdata,layout);

        // Demographic Info
        // clear the previous info first
        d3.select("#sample-metadata").html("");
        for (i = 0; i < Object.keys(filterMetadata[0]).length; i++) {
            if (Object.values(filterMetadata[0])[i] == undefined) {
                d3.select("#sample-metadata").append("p").html(`${Object.keys(filterMetadata[0])[i]} : N/A`);
            } else {
                d3.select("#sample-metadata").append("p").html(`${Object.keys(filterMetadata[0])[i]} : ${Object.values(filterMetadata[0])[i]}`);
                };
            };
        
        // Bubble plot

        // function to generate random color
        function getRandomColor() {
            var letters = '123456789ABCDE';
            var color = '#';
            for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 14)];
            }
            return color;
            };
        
        var trace_bubble = {
            x : filteredsample[0].otu_ids,
            y : filteredsample[0].sample_values,
            marker : {
                size : filteredsample[0].sample_values,
                color : filteredsample[0].otu_ids.map(item => (item = getRandomColor()))
            },
            mode : "markers",
            type : "scatter",
            text : filteredsample[0].otu_labels
        };
        console.log(Math.max(...filteredsample[0].sample_values));
        layout = {
            title : `OTUs for ID ${filteredsample[0].id}`,
            xaxis : {
                title : `OTU ID ${filteredsample[0].id}`
            },
            yaxis : {
                autorange : true
            }
        };

        plotdata = [trace_bubble];

        // plot the bubble chart
        Plotly.newPlot("bubble",plotdata,layout);

        // Gauge chart
        var trace3 = [
            {
              type: "indicator",
              mode: "gauge+number",
              value: 8,
              title: {
                  text: "Belly Button Washing Frequency",
                  font: {
                      size: 20,
                      
                },

                },
              gauge: {
                axis: { range: [null, 9], tickwidth: 1, tickcolor: "darkblue" },
                bar: { color: "darkblue" },
                bgcolor: "white",
                borderwidth: 0,
                bordercolor: "white",
                steps: [
                  { range: [0, 1], color: "#0s0s0s0"},
                  { range: [1, 2], color: "yellow" },
                  { range: [2, 3], color: "2" },
                  { range: [3, 4], color: "2" },
                  { range: [4, 5], color: "2" },
                  { range: [5, 6], color: "2" },
                  { range: [6, 7], color: "2" },
                  { range: [7, 8], color: "2" },
                  { range: [8, 9], color: "2" }
                ],
                threshold: {
                  line: { color: "red", width: 4 },
                  thickness: 0.75,
                  value: 8
                }
              }
            }
          ];
          
          let layout3 = {
              autosize : true,
              margin: {t: 0, b: 0, l: 35, r: 35} 
            };

        Plotly.newPlot('gauge', trace3, layout3);
    });
    };

// loop through all the ids and right them into the index.html
rawData.then(function(data) {
    for (i=0; i<data.names.length; i++) {
        d3.select("#selDataset").append("option").attr("value",data.names[i]).text(data.names[i]);
        console.log(d3.select("option").attr("value"));
    };
});


// on change of selected option, call function optionChanged
d3.selectAll("#selDataset").on("change", optionChanged());


function optionChanged(id) {
    // call individual function
    individual(id);
};



