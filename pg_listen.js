const { Pool, Client } = require('pg')
const yaml = require('js-yaml');
var parse = require('pg-connection-string').parse;
const fs = require('fs');

const argv = require('yargs')
	.option('config', {
		alias: 'c',
		describe: 'path to file with configuration',
	})
	.help()
	.argv;

var config = yaml.load(fs.readFileSync(argv.config || './config.cfg', 'utf8'));

// is there configuration to DB?
if (!config || !config.pgasync_url) {
    console.log('\nConfig file is empty, or does not contains mandatory informations.\n');
    process.exit(1);
}
let db = parse(config.pgasync_url);

const client = new Client({
  user: db.user,
  password: db.password,
  host: db.host,
  database: db.database,
  port: db.port,
})

client.connect().catch((err) => {
    console.error('\nCannot connect to DB.\n', err);
    process.exit(1);
});

// test query
client.query('SELECT 1 as test')
    .then((resp) => {
        console.log(`\nConnected to database "${db.database}" at ${db.host}:${db.port}.\n`);

        // signing listeners for notifications
        config.listen.forEach((channel) => {
            client.query(`LISTEN ${channel}`)
            console.log(`Listening to notifications "${channel}".`);
        });
        console.log('\n');
    })
    .catch((err) => {
        console.error('\nTest query was rejected.', err, '\n');
        process.exit(1);
    });

// Console log incoming notifications
client.on('notification', msg => {
    console.log('\nIncoming notification "', msg.channel, '" -');
    try {
        console.log(JSON.stringify(JSON.parse(msg.payload), null, "  "));
    } catch {
        console.log(msg.payload);
    }
    console.log('\n')
})
