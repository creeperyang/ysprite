const colors = require('colors')
const program = require('commander')
const Command = program.Command

const humanReadableArgName = arg => {
    let nameOutput = arg.name + (arg.variadic === true ? '...' : '')
    return arg.required ? '<' + nameOutput + '>' : '[' + nameOutput + ']'
}

const pad = (str, width) => {
    const len = Math.max(0, width - str.length)
    return str + Array(len + 1).join(' ')
}

Command.prototype.commandHelp = function() {
    if (!this.commands.length) return ''

    let commands = this.commands.filter(cmd => {
        return !cmd._noHelp
    }).map(cmd => {
        let args = cmd._args.map(function(arg) {
            return humanReadableArgName(arg)
        }).join(' ')

        return [
            colors.green(cmd._name + (cmd._alias ? '|' + cmd._alias : '') + (cmd.options.length ? ' [options]' : '') + ' ' + args),
            colors.grey(cmd.description())
        ]
    })

    let width = commands.reduce(function(max, command) {
        return Math.max(max, command[0].length);
    }, 0);

    return [
        '', colors.green('  Commands:'), '', commands.map(function(cmd) {
            let desc = cmd[1] ? '  ' + cmd[1] : '';
            return pad(cmd[0], width) + desc;
        }).join('\n').replace(/^/gm, '    '), ''
    ].join('\n');
};

Command.prototype.optionHelp = function() {
    let width = this.largestOptionLength();

    // Prepend the help information
    return [colors.green(pad('-h, --help', width)) + '  ' + colors.grey('output usage information')]
        .concat(this.options.map(function(option) {
            return colors.green(pad(option.flags, width)) + '  ' + colors.grey(option.description);
        }))
        .join('\n');
};

Command.prototype.helpInformation = function() {
    let desc = [];
    if (this._description) {
        desc = [
            colors.grey('  ' + this._description), ''
        ];
    }

    let cmdName = this._name;
    if (this._alias) {
        cmdName = cmdName + '|' + this._alias;
    }
    let usage = [
        '', colors.green('  Usage: ' + cmdName + ' ' + this.usage()), ''
    ];

    let cmds = [];
    let commandHelp = this.commandHelp();
    if (commandHelp) cmds = [commandHelp];

    let options = [
        colors.green('  Options:'), '', '' + this.optionHelp().replace(/^/gm, '    '), '', ''
    ];

    return usage
        .concat(cmds)
        .concat(desc)
        .concat(options)
        .join('\n');
};

module.exports = program
