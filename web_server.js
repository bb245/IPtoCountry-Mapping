"use strict";

var http = require("http"), server,
    remote_ip, long_ip,
    redis_client = require("redis").createClient();
var inet = require("./inet");

server = http.createServer(function (request, response) {
    var redis_info;

    response.writeHead(200, {
        "Content-Type": "text/plain"
    });

    redis_client.info(function (err, reply) {
        redis_info = reply; // stash response in outer scope
        if (err) {
            console.log(err.message);
        }
    });

    remote_ip = request.connection.remoteAddress;
    //long_ip = 17076980;
    long_ip = inet.aton(remote_ip);
    redis_client.zrangebyscore("ipaddress", long_ip, "inf", 'limit', 0, 1, function (err, reply) {
        // This is the last reply, so all of the previous replies must have completed already
        if (err) {
            response.write(err.message);
            console.log(err.message);
        }
        response.write("IP Address: " + remote_ip + "\n");
        if (reply.length === 1) {
            var city_info,
                data = JSON.parse(reply[0]);
            city_info = "City: " + data.city + "\n";
            city_info += "Region Name: " + data.region_name + "\n";
            city_info += "Country: " + data.country_name + "\n";
            city_info += "Postal Code: " + data.postal_code + "\n";
            city_info += "Latitude: " + data.latitude + "\n";
            city_info += "Longitude: " + data.longitude + "\n";
            city_info += "Metro Code: " + data.metro_code + "\n";
            city_info += "Area Code: " + data.area_code + "\n";
            response.write(city_info);
        }

        response.write("\nThis page was generated after talking to redis.\n\n" +
            "Redis info:\n" + redis_info + "\n");

        response.end();
    });
}).listen(8000);
