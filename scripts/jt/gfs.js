function glitch_fs() {
    this.root = new glitch_fs_entry("", null, "d");

    //Returns the glitch_fs_entry associated with the path or null.
    this.get_entry = function(entry_path) {
        var parts = entry_path.split("/");
        var cur_entry = this.root;

        var l = parts.length;
        for(var i = 0; i < l; i++) {
            var t = cur_entry.get_entry_by_name(parts[i]);

            cur_entry = t;
            if(cur_entry === null) {
                break;
            }
        }
        return cur_entry;
    }

    //Add get_relative_entry(path, relative_to)
}

function glitch_fs_entry(name, parent, type) {
    this.name = name;
    this.parent = parent;
    this.type = type;
    this.content = [];
    this.content_size = 0;

    if(parent !== null) {
        if(parent.path === "/") {
            this.path = parent.path + name;
        } else {
            this.path = parent.path + "/" + name;
        }
    } else {
        this.path = "/"
    }

    this.add_entry = function(name, type) {
        if(this.type === "d") {
            if(this.get_entry_by_name(name) === null) {
                var entry = new glitch_fs_entry(name, this, type);
                this.content.push(entry);
                this.content_size++;
                return entry;
            }
        }
        return null;
    }

    this.remove_entry = function(name) {
        if(this.type === "d") {
            if(this.get_entry_by_name(name) !== null) {
                this.swap_entries(this.get_entry_index(name), this.content.length - 1);
                this.content.pop();
                this.content_size--;
            }
        }
        return null;
    }

    this.get_entry_by_name = function(name) {
        if(this.type === "d") {
            if(name === "..") {
                return this.parent;
            }
            for(var i = 0; i < this.content_size; i++) {
                if(this.content[i].name === name) {
                    return this.content[i];
                }
            }
            return null;
        } else {
            return null;
        }
    }

    this.swap_entries = function(i1, i2) {
        var tmp = this.content[i1];
        this.content[i1] = this.content[i2];
        this.content[i2] = tmp;
    }

    this.get_entry_index = function(name) {
        for(var i = 0; i < this.content_size; i++) {
            if(this.content[i].name === name) {
                return i;
            }
        }
    }

    this.get_relative_entry = function(rel_path) {
        var parts = rel_path.split("/");
        var cur_entry = this;

        var l = parts.length;
        for(var i = 0; i < l; i++) {
            var t = cur_entry.get_entry_by_name(parts[i].trim());

            cur_entry = t;
            if(cur_entry === null) {
                cur_entry = this;
                break;
            }
        }
        return cur_entry;
    }
}
