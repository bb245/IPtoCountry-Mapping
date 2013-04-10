"use strict";

var fs = require('fs');
var csv = require('csv');
var redis = require('redis');

var client = redis.createClient();

client.on('error', function(error) {
    console.log(error.message);
});

client.del('ipaddress', redis.print);

csv()
    .from.stream(fs.createReadStream('master_ip_address.csv'), {
        columns: ['ip_start_num', 'ip_end_num', 'city', 'region_name',
            'country_name', 'postal_code', 'latitude', 'longitude', 'metro_code',
            'area_code']
    })
    .on('record', function(data) {
        client.zadd("ipaddress", data.ip_end_num, JSON.stringify(data));
    })
    .on('end', function() {
        client.quit();
        console.log('done');
    })
    .on('error', function(error) {
        console.log(error.message);
    });
