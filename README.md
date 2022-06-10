# pg_listen
Simple listener to PostgreSQL notifications.

## Dependencies
To run this program, you will need ```Node.js``` and ```yarn/npm``` installed. I tested it on Node.js v16.14.0 and yarn v1.22.18.

## Instalation
Clone this repository:
```
git clone https://github.com/Ghasteek/pg_listen.git
```
Go to its folder:
```
cd pg_listen
```
Install all packages:
```
yarn install
```

## Configuration
By default, app will take file ```config.conf``` from same folder as it resides. However, you can change path and filename of config file by adding ```-c path/to/config.cfg```.
<br />
Default config file uses ```yaml``` syntax, and its structure should be like this:
```yaml
pgasync_url: postgres://pg_user:pg_password@pg_server:_pg_port/pg_database

listen:
  - notification_1
  - notification_2
  ...
```
- ```pgasync_url``` - classic postgresql connection string
- ```listen``` - array of notifications you want to listen to

## Parameters
- ```-c path/to/config.cfg``` - optional, path to configuration file, default ```config.cfg```
- ```-n notification1,notification2``` - optional, comma separated list of notifications to listen, default list is in config file, which will be ignored, if list is passed by this parameter

## Run
After editing config file, start program by running
```
node pg_listen
```
After launch, you will see info about connecting and listening to notifications:
```
Connected to database "pg_database" at pg_server:pg_port.

Listening to notifications "notification_1".
Listening to notifications "notification_2".
```
PostgreSQL notification can send only text, but this application will try to convert notification to JSON and then print it.
```
Incoming notification "notification_1" -
{
  "key1": "value",
  "key2": "value",
  "key3": [
        "value1",
        "value2"
      ],
}

```
If only text is passed down by notification, it will print just that:
```
Incoming notification "notification_1" -
Text of your notification
```

## End
  Hope you will enjoy this simple piece of code, that helped me at my work :) 
