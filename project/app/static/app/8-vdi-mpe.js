// Color settings -------------------------------------
// --> Defining standard colors used throughout this page

const color_reading = 'rgba(13, 110, 253, 0.5)'
const color_na = 'rgba(255, 255, 255, 0.35)'
const color_grey = '#e9ecef'
const color_design = 'rgba(76, 175, 80, 0.35)'
const color_marginal = 'rgba(235, 235, 52, 0.5)'
const color_correction = 'rgba(235, 155, 52, 0.5)'
const color_danger = 'rgba(235, 52, 52, 0.4)'

// Button functions -------------------------------------
// --> Defining functions to be executed when pressing buttons

function btn_add(){
    // get the outer HTML of default reading-data
    trow = $('#reading-data-1').prop('outerHTML')

    // get n
    n = get_rows()
    n += 1

    // replace "-1" string in trow with '-' + n
    trow_add = trow.replaceAll('-1', '-' + n)

    // change the class 'reading-data-default' to 'reading-data-added'
    trow_add = trow_add.replaceAll('reading-data-default', 'reading-data-added')

    // append #table-body with trow as a new element at the end
    $('#table-body').append(trow_add)

    // change the No. column of this data to the value of n
    $('#reading-data-' + n + ' > th').html(n)

    // revert the category color to default
    $('#input-category-' + n).attr('style', 'background-color:' + color_grey)

    // check if need to disable_remove button
    disable_remove()
}

function btn_remove(){
    // get n
    n = get_rows()

    // if there's only 1 reading data, do nothing
    if (n <= 1) {
        return false
    }

    // if there's more than 1 reading data, remove the last one
    $('#reading-data-' + n).remove()

    // remove excess datasets from chart
    remove_excess_datasets()

    // check if need to disable_remove button
    disable_remove()
}

function btn_evaluate(e){

    e.preventDefault() // prevent the form from actually being submitted
    evaluate()

}

function btn_remove_all(){
    $('.reading-data-added').remove()
    remove_all_datasets()

    $('.form-data, .form-category').val('')
    $('.form-category').attr('style', 'background-color:' + color_grey)

    // check if need to disable_remove button
    disable_remove()
}



// Chart generation -------------------------------------
// --> Process of initializing the structure of the chart and plotting it

// Data
const data = {
    labels: [1, 300],
    datasets: [{
            label: 'Danger',
            data: [9.00, 155.88],
            pointRadius: 0,
            fill: 'end', // fill to end (top) of chart
            backgroundColor: color_danger,
            pointStyle: 'line',
        },
        {
            label: 'Correction',
            data: [3.50, 60.62],
            pointRadius: 0,
            fill: '0', // fill to dataset 0
            backgroundColor: color_correction,
            pointStyle: 'line',
        },
        {
            label: 'Marginal',
            data: [1.83, 31.70],
            pointRadius: 0,
            fill: '1', // fill to dataset 1
            backgroundColor: color_marginal,
            pointStyle: 'line',
        },
        {
            label: 'Design',
            data: [0.84, 14.55],
            pointRadius: 0,
            fill: '2', // fill to dataset 2
            backgroundColor: color_design,
            pointStyle: 'line',
        },
        {
            label: 'N/A',
            data: [0, 0],
            pointRadius: 0,
            fill: '3', // fill to dataset 3
            backgroundColor: color_na,
            pointStyle: 'line',
        },
    ]
}

// Config
const config = {
    type: 'scatter',
    data: data,
    options: {
        responsive: true,
        aspectRatio: 1,
        plugins: {
            legend: {
                onClick: null, // disable hiding plots by clicking on legend
                labels: {
                    boxWidth: 20,
                    // exclude Data 1, 2, etc labels from showing in legend
                    filter: function(item, chart){
                        return !item.text.includes('Data');
                    },
                },
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        
                        // Assigning parts of the label
                        data_no = context.dataset.label + ': '
                        x = context.parsed.x + ' Hz, '
                        y = context.parsed.y + ' mm/s RMS '

                        // Concatenating the parts
                        label = data_no + x + y
                        return label;

                    },
                },
            },
        },

        scales: {
            x: {
                display: true,
                type: 'logarithmic',
                min: 1,
                max: 300,
                ticks: {
                    maxTicksLimit: 100,
                },
                title: {
                    display: true,
                    text: 'Frequency (Hz)',
                },
            },
            y: {
                display: true,
                type: 'logarithmic',
                min: 1,
                max: 100,
                ticks: {
                    maxTicksLimit: 20,
                },
                title: {
                    display: true,
                    text: 'Velocity (mm/s RMS)',
                },
            },
        },
    }
}

// Context (location)
const context = document.getElementById('chart-vdi').getContext('2d');

// Create chart
const chart = new Chart(context, config);



// AJAX function -------------------------------------
// --> To communicate with the back-end

// Evaluate
function evaluate() {

    // get the values from input fields
    var readings = formToJson('#form-vdi')

    $.ajax({
        type: 'POST',
        headers: {
            "X-CSRFToken": csrftoken
        },
        data: {
            readings: JSON.stringify(readings),
        },
        beforeSend: function () {
            loading_state()
        },
        success: function (response) {

            // undo loading state
            reset_state()

            // Set category input based on AJAX response
            set_category(response)

            // Remove excess
            remove_excess_datasets()

            // Update datasets based on AJAX response
            response.category.forEach(function (val, i) {
                set_category(response, i)
                updateData(readings, i)
            })

        },
        error: function () {
            reset_state()
        }
    })
}



// Helpers -------------------------------------
// --> Defining functions used throughout the script

// Converts form field inputs to JSON object
function formToJson(nameForm) {
    var jsonForm = {};
    $("input", $(nameForm)).each(function (index) {
        jsonForm[$(this).attr("name")] = this.value;
    })
    return jsonForm;
}

// Get the number of reading data rows in table
function get_rows() {
    return $('.reading-data').length
}

// Get the number of reading datasets in chart
function get_plots() {
    return chart.data.datasets.length - 5
    // minus 5 due to others are criteria lines
}

// Disables remove button based on condition
function disable_remove() {
    n = get_rows()
    if (n == 1) {
        $("#btn-remove").attr("disabled", "true")
    } else {
        $("#btn-remove").removeAttr("disabled")
    }
}

function remove_all_datasets(){
    // Get number of datasets in chart
    nc = get_plots()

    // Remove excess datasets from chrt
    for (var e = 0; e < nc; e++)
        chart.data.datasets.pop()

    chart.update(mode = 'none');
}

function remove_excess_datasets(){
    // Get number of fields
    n = get_rows()

    // Get number of datasets in chart
    nc = get_plots()

    // Calculate excess datasets compared to input fields
    excess = nc - n

    // Remove excess datasets from chrt
    for (var e = 0; e < excess; e++)
        chart.data.datasets.pop()

    chart.update(mode = 'none');

}

function updateData(readings, i) {

    i += 1
    thisData = {
        label: 'Data ' + i,
        data: [{
            x: readings['input-frequency-' + i],
            y: readings['input-velocity-' + i],
        }],
        backgroundColor: color_reading,
        pointRadius: 6,
        pointStyle: 'rectRot',
        order: -1,
    }

    nc = get_plots()

    // Check if this is a new data (in input field, not in chart)
    if (i > nc) {
        console.log('Field number', i, 'is initially not in chart')
        chart.data.datasets.push(thisData)
    } else {
        console.log('Field number', i, 'is already in chart')
        chart.data.datasets[i + 4] = thisData
    }

    console.log(chart.data.datasets.length)

    chart.update(mode = 'none');
    return
}

function loading_state() {

    // disable input fields
    $(".form-data").attr("disabled", "true")

    // fill input-category with loading
    $("#input-category").val('Loading..').attr('style', 'background-color:#e9ecef')

    // replace Evaluate with Evaluating
    $("#evaluate_label").html('Evaluating')

    // disable Evaluate button
    $("#btn-evaluate").attr("disabled", "true")

    // disable range sliders
    $("#range-frequency, #range-velocity").attr("disabled", "true")

    // show loader
    $("#loader").show()
}

function reset_state() {

    // enable input fields
    $(".form-data").removeAttr("disabled")

    // replace Evaluating with Evaluate
    $("#evaluate_label").html('Evaluate')

    // enable Evaluate button
    $("#btn-evaluate").removeAttr("disabled")

    // hide loader
    $("#loader").hide()
}

function set_category(response, i) {

    cat = response.category[i]

    if (cat == 'Design') {
        color = color_design
    } else if (cat == 'Marginal') {
        color = color_marginal
    } else if (cat == 'Correction') {
        color = color_correction
    } else if (cat == 'Danger') {
        color = color_danger
    } else {
        color = color_grey
    }

    n = i + 1

    $("#input-category-" + n).val(cat)
    $("#input-category-" + n).attr('style', 'background-color:' + color)

}



// Initializers -------------------------------------
// --> Functions to run when initializing the page

disable_remove() // checks if need to disable remove button
reset_state() // initialize page with reset state
btn_remove_all() // clear data from previous input