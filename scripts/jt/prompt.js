function environment() {
    this.fs = new glitch_fs();          //File system
    this.wd = this.fs.root;    //Working directory
}
var env = new environment();

var html_prompt;
var html_prompt_out;

var current_addr = 72;
var user_input = "";
var cursor_visible = true;

function init() {
    html_prompt = document.getElementById('prompt');
    html_prompt_out = document.getElementById('prompt-out');

    $( document ).on("keypress", onKeyPress);
    $( document ).on("keydown", onKeyDown);

    update_prompt(current_addr);
    update_output("type --help for details");

    env.fs.root.add_entry("dir1", "d");
    env.fs.root.add_entry("dir2", "d");

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

function execute_command() {
    var cmd = user_input.trim();

    var file_out = cmd.split(">");
    var piped_cmds = file_out[0].split("|");
    if(file_out.length > 1) {
        file_out = file_out[1].trim(); //Get the file name
    } else {
        file_out = null;
    }

    var err = null;
    var out = null;
    var l = piped_cmds.length;
    for(var i = 0; i < l; i++) {
        cmd = piped_cmds[i];
        var parts = cmd.split(' ');

        if(parts[0] in commands) {
            out = commands[parts[0]](parts, out);
        } else {
            err = "command not found: " + parts[0];
            break;
        }
    }

    user_input = "";
    if(err !== null) {
        update_output(err);
    } else {
        if(file_out !== null) {
            var e = env.wd.get_entry_by_name(file_out);
            if(e === null) {
                e = env.wd.add_entry(file_out, "f");
            }
            if(e.type === "d") {
                update_output("Cannot output to directory!");
                return;
            }
            e.content = out;
        } else {
            update_output(out);
        }
    }
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
    var prompt_base = toHex(current_addr) + ": > ";
    html_prompt.textContent = prompt_base + user_input + (cursor_visible ? "_" : "");
}

function update_output(contents) {
    html_prompt_out.textContent = contents;
}
