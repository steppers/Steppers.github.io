function Entry(name, type, parent) {
    this.parent = parent;
    this.name = name;
    this.type = type;
    this.content = [];

    if(parent !== null) {
        if(parent.path != "/") {
            this.path = parent.path + "/" + name;
        } else {
            this.path = parent.path + name;
        }
    } else {
        this.path = "/";
    }

    this.new_directory = function(name) {
        var dir = new Entry(name, "d", this)
        this.content.push(dir);
        return dir;
    }

    this.new_file = function(name) {
        var file = new Entry(name, "f", this)
        this.content.push(file);
        return file;
    }
}

function files_get_entry(entry_path) {
    var parts = entry_path.split("/");
    var l = parts.length;

    var curr_entry = files.root;
    // Part to check for
    for (i = 0; i < l; i++) {
        var search_for = parts[i];
        // Search the current directory
        for (d = 0; d < curr_entry.content.length; d++) {
            if(curr_entry.content[d].name === search_for) {
                curr_entry = curr_entry.content[d];
                break;
            }
        }

        if((i === l - 1) && (curr_entry.path !== entry_path)) {
            return null;
        }
    }
    return curr_entry;
}

var files = {
    root : new Entry("/", "d", null)
};
