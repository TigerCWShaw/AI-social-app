let preference = {  'genre':'video games',
                    'relationship':'friend',
                    'age': '15',
                    'feedback':''
                };
let message = [];
let count = 1;
let scenario_picked = false;

function addMessage(text) {
    //Object where message will be stored
    const chat = {
        text,
        id: count
    }
    count++;
    message.push(chat);

    //Render message to the screen
    const list = document.querySelector('.messages');
    list.insertAdjacentHTML('beforeend',
        `<p class="message-request" id="'msg_' + ${chat.id}">
        <span>${chat.text}</span>
    </p>`);

}

const msg_form = document.querySelector('.message-form');
msg_form.addEventListener('submit', event => {
    event.preventDefault();
    const input = document.querySelector('.typedMessage');

    const text = input.value.trim();

    if (text !== '') {
        addMessage(text);
        input.value = '';
        input.focus();
    }
});

$(function () {
    $("#preference_btn").click(function () {
        // let genre = $('input[name="genre"]:checked').val();
        // alert(preference.toString())
        get_scenarios(preference);
    });
});

$(function () {
    $("#feedback_btn").click(function () {
        // let genre = $('input[name="genre"]:checked').val();
        // alert(preference.toString())
        get_feedbacks(preference);
    });
});

$(function () {
    $("#display_scenarios").on("click", "button.choice_btn", function () {
        // alert($(this).attr('id'))
        let scenario_id = $(this).attr('id');
        get_scenario_msg($(this).attr('id'));
    });
});

$(function () {
    $("#pick_genre").on("click", "button.choice_btn", function () {
        preference['genre'] = $(this).text();
    });
});

$(function () {
    $("#pick_relationship").on("click", "button.choice_btn", function () {
        preference['relationship'] = $(this).text();
    });
});

$(function () {
    $("#pick_age").on("click", "button.choice_btn", function () {
        preference['age'] = $(this).text();
    });
});

$(function () {
    $("#pick_feedback").on("click", "button.choice_btn", function () {
        preference['feedback'] = $(this).text();
    });
});

$(function () {
    $("#msg_btn").click(function () {
        let request = document.querySelector('.typedMessage').value.trim();
        // alert(input)
        if(scenario_picked){
            get_chat_msg(request.toString());
        }
    });
});

function show_scenarios(data) {
    let scenarios = data["scenarios"];
    $("#display_scenarios").empty();
    $.each(scenarios, function (i, item) {
        let scenario_div = $("<button class='choice_btn' id=scenario" + i.toString() + " type='button'>" + item + "</button><br><br>")
        $("#display_scenarios").append(scenario_div)
    })
}

function show_msg(msg) {
    const chat = {
        msg,
        id: count
    }
    // alert("In show msg")
    message.push(chat);
    let msg_p = $("<p class='message-reply' id='msg_' + ${chat.id}><span>"+ msg + "</span></p>")
    count++;
    $(".messages").append(msg_p)
}

function get_scenarios(dict) {
    let data = dict
    $.ajax({
        type: "POST",
        url: "/get_scenarios",
        dataType: "json",
        contentType: "application/json; charset=utf-8",

        data: JSON.stringify(data),
        success: function (data, text) {
            preference = data;
            show_scenarios(data);
            scenario_picked = true;
        },
        error: function (request, status, error) {
            console.log("Error");
            console.log(request);
            console.log(status);
            console.log(error);
        },
    });
}

function get_feedbacks(dict) {
    let data = dict
    $.ajax({
        type: "POST",
        url: "/get_feedbacks",
        dataType: "json",
        contentType: "application/json; charset=utf-8",

        data: JSON.stringify(data),
        success: function (data, text) {
            feedback_list = data;
            $.each(feedback_list, function (i, item) {
                show_msg(item);
            })
            // scenario_picked = true;
        },
        error: function (request, status, error) {
            console.log("Error");
            console.log(request);
            console.log(status);
            console.log(error);
        },
    });
}


function get_scenario_msg(scenario_id) {
    let data = { "scenario_id": scenario_id };
    $.ajax({
        type: "POST",
        url: "/get_scenario_msg",
        dataType: "json",
        contentType: "application/json; charset=utf-8",

        data: JSON.stringify(data),
        success: function (data, text) {
            response = data;
            // alert(response)
            show_msg(response);
        },
        error: function (request, status, error) {
            console.log("Error");
            console.log(request);
            console.log(status);
            console.log(error);
        },
    });
}

function get_chat_msg(msg) {
    let data = { "msg": msg }
    $.ajax({
        type: "POST",
        url: "/get_chat_msg",
        dataType: "json",
        contentType: "application/json; charset=utf-8",

        data: JSON.stringify(data),
        success: function (data, text) {
            response = data;
            // alert(response)
            show_msg(response);
        },
        error: function (request, status, error) {
            console.log("Error");
            console.log(request);
            console.log(status);
            console.log(error);
        },
    });
}