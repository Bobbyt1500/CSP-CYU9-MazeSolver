/*
Maze constraints:
    Only consists of characters: \n, x, s, e, *

    x: Wall
    s: Start
    e: End
    *: Path

    Can only move to the following relative positions:
    (0,1)
    (1,0)
    (0,-1)
    (-1,0)
*/

var fs = require('fs')

class Maze {
    constructor(data) {
        // Find start / end point

        for (var i = 0; i < data.length; ++i) {
            for (var j = 0; j < data[i].length; ++j) {
                if (data[i][j] == 's') this.start = [i,j];
                if (data[i][j] == 'e') this.end = [i,j];
            }
        }

        this.data = data
    }

    printSolution(steps) {
        let solution_data = Array.from(this.data)

        steps.forEach((val) => {
            solution_data[val[0]][val[1]] = '█'
        })

        for (var i = 0; i < solution_data.length; ++i) {
            console.log(solution_data[i].join(""))
        }
    }

    getOptions(position) {
        
        let options = []

        if (position[0] - 1 >= 0) options.push([position[0] - 1, position[1]])
        if (position[1] - 1 >= 0) options.push([position[0], position[1] - 1])
        if (position[0] + 1 < this.data.length) options.push([position[0] + 1, position[1]])
        if (position[1] + 1 < this.data[0].length) options.push([position[0], position[1] + 1])
        
        return options
    }

    solve() {
        
        var cur = {
            pos: this.start,
            visited: new Set([this.start])
        }

        var queue = [cur]

        while (queue.length > 0) {
            var cur = queue.shift() 
            var options = this.getOptions(cur.pos)

            for (var i = 0; i < options.length; ++i) {

                // Skip this option if it was already visited
                if (cur.visited.has(options[i])) continue;

                var character = this.data[options[i][0]][options[i][1]];
                
                // If this option is a path, add it to the queue
                if (character == '*') {
                    
                    var new_cur = {
                        pos: options[i],
                        visited: new Set(cur.visited)
                    }

                    new_cur.visited.add(options[i])

                    queue.push(new_cur)

                } else if (character == "e") {
                    
                    // If this character is the end, return the path
                    cur.visited.add(options[i])
                    return cur.visited
                }
            }

        }

        // If all paths were checked and no solution, return null
        return null
    }
}

function parse(fileName) {
    let data = fs.readFileSync(fileName, 'utf8').split('\n')

    for (var i = 0; i < data.length; ++i) data[i] = data[i].split('')

    return data
}

function main() {
    // Get filename from command line args
    let fileName = process.argv[2]

    if (fileName == undefined) {

        console.log("Please provide filename")
        process.exit(1)

    }

    // Parse data
    var data = null
    try {

        data = parse(fileName)

    } catch (err) {

        console.error(err)
        process.exit(1)

    }

    // Solve maze
    let maze = new Maze(data)

    steps = maze.solve()

    // Show Solution
    maze.printSolution(steps)
    
}
  
if (require.main === module) {
    main();
}
