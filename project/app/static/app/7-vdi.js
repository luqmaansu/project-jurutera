// Color settings
const color_reading = 'rgba(13, 110, 253, 0.5)'
const color_na = 'rgba(255, 255, 255, 0.35)'
const color_design = 'rgba(76, 175, 80, 0.35)'
const color_marginal = 'rgba(235, 235, 52, 0.5)'
const color_correction = 'rgba(235, 155, 52, 0.5)'
const color_danger = 'rgba(235, 52, 52, 0.4)'

// Chart data
const data = {
    labels: [1, 300],
    datasets: [{
            label: 'Reading',
            data: [{x: 10,y: 10}],
            backgroundColor: color_reading,
            pointRadius: 0,
            pointStyle: 'rectRot',
        },
        {
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
            fill: '1', // fill to dataset 4
            backgroundColor: color_correction,
            pointStyle: 'line',
        },
        {
            label: 'Marginal',
            data: [1.83, 31.70],
            pointRadius: 0,
            fill: '2', // fill to dataset 3
            backgroundColor: color_marginal,
            pointStyle: 'line',
        },
        {
            label: 'Design',
            data: [0.84, 14.55],
            pointRadius: 0,
            fill: '3', // fill to dataset 2
            backgroundColor: color_design,
            pointStyle: 'line',
        },
        {
            label: 'N/A',
            data: [0, 0],
            pointRadius: 0,
            fill: '4', // fill to dataset 2
            backgroundColor: color_na,
            pointStyle: 'line',
        },
    ]
}

// Chart settings
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

// Chart context (location)
const context = document.getElementById('chart-vdi').getContext('2d');

// Create chart
const chart = new Chart(context, config);

// When Evaluate button is clicked
$("#btn-evaluate").on('click', function (e) {
    e.preventDefault() // prevent the form from actually being submitted

    f = $("#input-frequency").val()
    v = $('#input-velocity').val()

    // evaluate() only if both f and v fields are not empty
    if (f && v) {
        evaluate()
    }

})

// When Random button is clicked
$("#btn-random").on('click', function (e) {

    // prevent the form from actually being submitted
    e.preventDefault()

    // Assign random numbers to variables
    random_f = Math.floor((Math.random() * 200) + 1);
    random_v = Math.floor((Math.random() * 80) + 1);

    // Assign the variables to input fields
    $("#input-frequency").val(random_f)
    $("#input-velocity").val(random_v)

    // Update the slider ranges
    update_range($("#input-frequency"))
    update_range($("#input-velocity"))

    $("#btn-evaluate").click()

})

// When input field changes
$("#input-frequency, #input-velocity").on('change, keyup', function () {
    input = $(this)
    update_range(input)
})

// When range slider changes
$("#range-frequency, #range-velocity").on('input', function () {
    range = $(this)
    update_input(range)
})

function update_range(input) {
    // get the respective input field's ID (note 'this' is the range slider object)
    this_input_id = "#" + input.attr('id')
    this_range_id = this_input_id.replace("input", "range")

    // insert the value from input field into the range slider
    value = input.val()
    $(this_range_id).val(value)
}

function update_input(range) {
    // get the respective range field's ID (note 'this' is the input field object)
    this_range_id = "#" + range.attr('id')
    this_input_id = this_range_id.replace("range", "input")

    // insert the value from range slider into the input field
    value = range.val()
    $(this_input_id).val(value)
}


// When range slider is released
$("#range-frequency, #range-velocity").on('mouseup', function () {

    // automatically press Evaluate button
    $("#btn-evaluate").click()

})

// AJAX function
function evaluate() {

    // get the values of frequency and velocity
    f = $("#input-frequency").val()
    v = $('#input-velocity').val()

    $.ajax({
        type: 'POST',
        data: {
            csrfmiddlewaretoken: csrftoken,
            f: f,
            v: v,
        },
        beforeSend: function () {
            loading_state()
        },
        success: function (response) {

            chart.data.datasets[0].pointRadius = 6
            chart.data.datasets[0].data[0].x = f
            chart.data.datasets[0].data[0].y = v
            chart.update()

            set_category(response)

            reset_state()

        },
        error: function () {

            reset_state()

        }
    })
}

function loading_state() {

    // disable input fields
    $("#input-frequency, #input-velocity").attr("disabled", "true")

    // fill input-category with loading
    $("#input-category").val('Loading..').attr('style', 'background-color:#e9ecef')

    // replace Evaluate with Evaluating
    $("#evaluate_txt").html('Evaluating')

    // disable Evaluate button
    $("#btn-evaluate").attr("disabled", "true")

    // disable range sliders
    $("#range-frequency, #range-velocity").attr("disabled", "true")

    // show loader
    $("#loader").show()
}

reset_state() // initialize page with reset state
function reset_state() {

    // enable input fields
    $("#input-frequency, #input-velocity").removeAttr("disabled")

    // replace Evaluating with Evaluate
    $("#evaluate_txt").html('Evaluate')

    // enable Evaluate button
    $("#btn-evaluate").removeAttr("disabled")

    // disabled range sliders
    $("#range-frequency, #range-velocity").removeAttr("disabled")

    // hide loader
    $("#loader").hide()
}

function set_category(response) {

    cat = response.category

    if (cat == 'Design') {
        color = color_design
    } else if (cat == 'Marginal') {
        color = color_marginal
    } else if (cat == 'Correction') {
        color = color_correction
    } else if (cat == 'Danger') {
        color = color_danger
    } else {
        color = '#e9ecef'
    }

    $("#input-category").val(cat)
    $("#input-category").attr('style', 'background-color:' + color)
}