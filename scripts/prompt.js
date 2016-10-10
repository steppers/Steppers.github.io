var prompt;
var prompt_output;

var current_addr = 72;
var user_input = "";
var cursor_visible = true;

var shift_down = false;

function init() {
    prompt = document.getElementById('prompt');
    prompt_output = document.getElementById('prompt-out');

    $( document ).on("keypress", onKeyPress);
    $( document ).on("keydown", onKeyDown);

    user_input = "";
    update_prompt(current_addr);
    update_output("");

    setInterval(function(){ toggle_cursor() }, 500);
}

function onKeyDown(event) {
    switch(event.key) {
        case "Backspace":
            if(user_input.length > 0) {
                current_addr--;
            }
            user_input = user_input.slice(0, -1);
            break;
        case "Enter":
            execute_command();
            current_addr = 72;
            break;
    }
    update_prompt(current_addr);
}

function onKeyPress(event) {
    var c = String.fromCharCode(event.which);
    user_input = user_input + c;
    if(event.which !== 13) {
        current_addr++;
    }
    update_prompt(current_addr);
}

var commands = {
    "ls" : function(cmd) {
        update_output(cmd + " > " + "Home, About, Games, Blog, Github, TheRealmGames");
    },
    "cd" : function(cmd) {
        switch(cmd[1].toLowerCase()) {
            case "home":
                window.location.href = "http://google.co.uk";
                break;
            case "trg":
                window.location.href = "http://therealmgames.co.uk";
                break;
            case "therealmgames":
                window.location.href = "http://therealmgames.co.uk";
                break;
            default:
                break;
        }
    },
};

function execute_command() {
    var cmd = user_input.trim();
    var parts = cmd.split(' ');
    if(parts[0] in commands) {
        commands[parts[0]](parts);
    } else {
        update_output("");
    }
    user_input = "";
}

function toHex(address) {
    var t = address.toString(16);
    switch (t.length) {
        case 1:
            t = "000" + t;
            break;
        case 2:
            t = "00" + t;
            break;
        case 3:
            t = "0" + t;
            break;
        default: break;
    }
    return "0x" + t.toUpperCase();
}

function toggle_cursor() {
    cursor_visible = !cursor_visible;
    update_prompt(current_addr, user_input);
}

function update_prompt(address) {
    prompt_base = toHex(current_addr) + ": > ";
    prompt.textContent = prompt_base + user_input + (cursor_visible ? "_" : "");
}

function update_output(contents) {
    prompt_output.textContent = contents;
}
