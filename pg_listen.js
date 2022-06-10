const { Pool, Client } = require('pg')
const yaml = require('js-yaml');
var parse = require('pg-connection-string').parse;
const fs = require('fs');

const argv = require('yargs')
	.option('config', {
		alias: 'c',
		describe: 'path to file/directory with configuration',
	})
	.demandOption('config', 'Please provide path to file/directory with configuration')
	.help()
	.argv;

var config = yaml.load(fs.readFileSync(argv.config, 'utf8'));
let db = parse(config.pgasync_url);

const client = new Client({
  user: db.user,
  password: db.password,
  host: db.host,
  database: db.database,
  port: db.port,
})
client.connect()

config.listen.forEach((channel) => {
    client.query(`LISTEN ${channel}`)
    console.log('Listening to ', channel)
});

client.on('notification', msg => {
    console.log('\n\n', msg.channel, ' - ');
    try {
        console.log(JSON.stringify(JSON.parse(msg.payload), null, "  "));
    } catch {
        console.log(msg.payload);
    }
    console.log('\n\n')
})
