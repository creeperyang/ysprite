class Spinner {
    constructor () {
        this.ESC = '\u001b['
        this.cursorLeft = this.ESC + '1000D'
        this.eraseEndLine = this.ESC + 'K'
        this.logUpdate = this._create(process.stdout)
    }
    start (message = '', type = 'circleHalves') {
        const spinner = Spinner.spinners[type]
        let i = 0
        this._timer = setInterval(() => {
            const frames = spinner.frames
            this.logUpdate(frames[i = ++i % frames.length] + message)
        }, spinner.interval)
    }
    stop () {
        clearInterval(this._timer)
        this.logUpdate.clear()
    }
    _create (stream) {
        let prevLineCount = 0

        const render = (...args) => {
            const out = args.join(' ') + '\n'
            stream.write(this.eraseLines(prevLineCount) + out)
            prevLineCount = out.split('\n').length
        }

        render.clear = () => {
            stream.write(this.eraseLines(prevLineCount))
            prevLineCount = 0
        }

        render.done = () => {
            prevLineCount = 0
        }

        return render
    }
    eraseLines (count) {
        let clear = ''

        for (let i = 0; i < count; i++) {
            clear += this.cursorLeft + this.eraseEndLine + (i < count - 1 ? this.cursorUp() : '')
        }

        return clear
    }
    cursorUp (count) {
        return this.ESC + (typeof count === 'number' ? count : 1) + 'A'
    }
}

Spinner.spinners = {
    circleQuarters: {
        interval: 120,
        frames: [
            '◴',
            '◷',
            '◶',
            '◵'
        ]
    },
    circleHalves: {
        interval: 50,
        frames: [
            '◐',
            '◓',
            '◑',
            '◒'
        ]
    }
}

module.exports = Spinner
