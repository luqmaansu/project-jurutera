// Chart-1

const data1 = {
    datasets: [{
        label: 'Random value 1',
        data: [{
            x: 0,
            y: 0,
        }],
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgba(255, 99, 132, 0.2)',
    }],
};

const config1 = {
    type: 'line',
    data: data1,
    options: {
        scales: {
            x: {
                type: 'linear',
                suggestedMax: 10,
                ticks: {
                    stepSize: 1.0,
                }
            },
            y: {
                min: 0,
            }
        }
    }
};

const context1 = document.getElementById('chart-1').getContext('2d');
const chart1 = new Chart(context1, config1);


// Chart-2

const data2 = {
    datasets: [{
        label: 'Random value 2',
        data: [{
            x: 0,
            y: 0,
        }],
        backgroundColor: 'rgb(99, 138, 214)',
        borderColor: 'rgba(99, 138, 214, 0.2)',
    }],
};

const config2 = {
    type: 'bar',
    data: data2,
    options: {
        scales: {
            x: {
                type: 'linear',
                suggestedMax: 10,
                ticks: {
                    stepSize: 1.0,
                }
            },
            y: {
                min: 0,
            }
        }
    }
};

const context2 = document.getElementById('chart-2').getContext('2d');
const chart2 = new Chart(context2, config2);



// Functions

// Chart-1 updates when update1() button is pressed
function update1() {
    chartObj = chart1
    update(chartObj)
}

// Chart-2 updates at an interval of the specified milliseconds
setInterval(function () {
    chartObj = chart2
    update(chartObj)
}, 2000);

function update(chartObj) {

    $.ajax({
        type: 'GET',
        success: function (response) {

            // Set x interval of new data
            interval = 1
            max = 10

            // Get number of data in dataset[0]
            number = chartObj.data.datasets[0].data.length
            console.log('number:', number)

            // If max data, shift
            if (number > max) {
                chartObj.data.datasets[0].data.shift()
            }

            // Get value of the last X and the next X
            lastX = chartObj.data.datasets[0].data.slice(-1)[0].x

            // Insert new data
            console.log('insert new data')
            newData = {
                x: lastX + 1,
                y: response.value,
            }
            chartObj.data.datasets[0].data.push(newData)

            // Update chart
            chartObj.update()

        },
    })

}