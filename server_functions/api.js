const { rsgData } = require("../js/data.js");
console.log(rsgData.reverseShellCommands)

const insertParameters = function (command, params) {
    // TODO: Extract the inlined JS from index.html into a new file,
    // so the insertParameters + encoding logic can be reused
    const encoder = (value) => value;
    try {
        command = command
        .replace(encoder('{ip}'), encoder(params.ip))
        .replace(encoder('{port}'), encoder(String(params.port)))
        .replace(encoder('{shell}'), encoder(params.shell))
        return command
    } catch (error) {
        return command
    }
}

const send = function (event, _context) {
    const { queryStringParameters } = event;
    if(!queryStringParameters.port){queryStringParameters.port = "1337"}
    let shells = []
    rsgData.reverseShellCommands.forEach(shell=>{
        shells.push({
            name: shell.name,
            command: insertParameters(shell.command, queryStringParameters),
            meta: shell.meta
        })
    })
    return JSON.stringify(shells)
}

exports.handler = async function(event, _context) {
    const { queryStringParameters } = event;
    if(queryStringParameters.ip && queryStringParameters.shell) {
        return {
            statusCode: 200,
            body: send(event, _context)
        };
    }
    else{
        return {
            statusCode: 200,
            body: JSON.stringify({message: "Insufficient Parameters"})
        };
    }
}
