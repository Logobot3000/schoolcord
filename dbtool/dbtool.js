const fs = require('node:fs');
class Dbtool {
    constructor(path) {
        this.path = path;
        if (this.path[this.path.length - 1] === '/') this.path = this.path + 'db';
        else this.path = this.path + '/db';
        if (!fs.existsSync(this.path)) {
            fs.mkdirSync(this.path);
        }
    }

    getTableContents(name) {
        const filepath = this.path + `/${name}.json`;
        let data = fs.readFileSync(filepath);
        return JSON.parse(data);
    }

    writeToTable(name, data) {
        const filepath = this.path + `/${name}.json`;
        fs.writeFileSync(filepath, JSON.stringify(data, null, '\t'));
    }

    createTable(name, params) {
        let table = {params: params, data: []};
        let filepath = this.path + `/${name}.json`;

        for (let i in table.params) {
            table.params[i] = table.params[i].toLowerCase()
            if (table.params[i] === 'auto_increment') {
                table.next_increment = 0
            }
        }

        if (!fs.existsSync(filepath)) {
            this.writeToTable(name, table)
        }
        else {
            console.log("table already exists");
        }
    }

    insertIntoTable(name, data) {
        let filepath = this.path + `/${name}.json`;
        let tableContents = this.getTableContents(name)

        for (let i in tableContents.params) {
            if (tableContents.params[i] === 'auto_increment') {
                data[i] = tableContents.next_increment;
                tableContents.next_increment += 1;
                continue;
            }
            if (!data[i]) {
                throw new Error(`missing parameter: expected parameter: ${i}`);
            }
            if (tableContents.params[i] !== typeof(data[i])) {
                throw new Error(`incorrect type: expected type: ${tableContents.params[i]}, given type: ${typeof(data[i])}`)
            }
        }

        tableContents.data.push(data)

        this.writeToTable(name, tableContents)
    }

    removeFromTable(name, filter) {
        let filepath = this.path + `/${name}.json`;
        let tableContents = this.getTableContents(name);

        let filteredData = this.select(name, filter);

        for (let i in filteredData) {
            let index = tableContents.data.indexOf(filteredData[i]);
            if (index > -1) {
                tableContents.splice(index, 1);
            }
        }

        this.writeToTable(name, tableContents);
    }

    select(name, filter) {
        let tableContents = this.getTableContents(name);
        return tableContents.data.filter(filter)
    }
}

module.exports = Dbtool;