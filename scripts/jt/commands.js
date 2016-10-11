var commands = {
    "pwd" : function(cmd, input) { return pwd.execute(cmd, input); },
    "cwd" : function(cmd, input) { return pwd.execute(cmd, input); },
    "ls" : function(cmd, input) { return ls.execute(cmd, input); },
    "dir" : function(cmd, input) { return ls.execute(cmd, input); },
    "cd" : function(cmd, input) { return cd.execute(cmd, input); },
    "mkdir" : function(cmd, input) {return mkdir.execute(cmd, input); },
    "echo" : function(cmd, input) { return echo.execute(cmd, input); },
    "cat" : function(cmd, input) { return cat.execute(cmd, input); },
    "rm" : function(cmd, input) { return rm.execute(cmd, input); },
};

var cd = {
    execute : function(cmd, input) {
        if(cmd.length > 1) {
            var nwd;
            if(cmd[1].startsWith("/")) {
                nwd = env.fs.get_entry(cmd[1]);
            } else {
                nwd = env.wd.get_relative_entry(cmd[1]);
            }
            if(nwd.type === "f") {
                return "Not a directory: " + cmd[1];
            }
            if(nwd === null) {
                return "Could not find directory: " + cmd[1];
            }
            env.wd = nwd;
        } else {
            env.wd = env.fs.root;
        }
    }
};

var ls = {
    execute : function(cmd, input) {
        var out = "";
        var l = env.wd.content.length;
        for (i = 0; i < l; i++) {
            out += env.wd.content[i].name + " ";
        }
        return out;
    }
};

var pwd = {
    execute : function(cmd, input) {
        return env.wd.path;
    }
};

var mkdir = {
    execute : function(cmd, input) {
        if(cmd.length > 1) {
            var dir_name = cmd[1];
            var d = env.wd.add_entry(dir_name, "d");    //TODO: Add relative path capabilities
            if(d === null) {
                return cmd[1] + " already exists!";
            }
        } else {
            return "Must provide directory name!";
        }
    }
};

var echo = {
    execute : function(cmd, input) {
        var out = "";
        for (i = 1; i < cmd.length; i++) {
            out += cmd[i] + " ";
        }
        return out;
    }
}

var rm = {
    execute : function(cmd) {
        if(cmd.length > 1) {
            var entry;
            if(cmd[1].startsWith("/")) {
                entry = env.fs.get_entry(cmd[1]);
            } else {
                entry = env.wd.get_relative_entry(cmd[1]);
            }
            if(entry === null) {
                return "Could not find file: " + cmd[1];
            }
            entry.parent.remove_entry(entry.name);
        }
    }
}

var cat = {
    execute : function(cmd, input) {
        if(cmd.length > 1) {
            var entry;
            if(cmd[1].startsWith("/")) {
                entry = env.fs.get_entry(cmd[1]);
            } else {
                entry = env.wd.get_relative_entry(cmd[1]);
            }
            if(entry === null) {
                return "Could not find file: " + cmd[1];
            }
            if(entry.type === "d") {
                return "Not a file: " + cmd[1];
            }
            return entry.content;
        }
    }
}
