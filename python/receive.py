import kombu
import json
import configparser
from dateutil import parser

import time
from calendar import timegm

from rethinkdb import RethinkDB
r = RethinkDB()

"""
CONFIG = {
    "exchange": "seismic.topic",
    "amqp_uri": "amqp://temp_stats:eighiikooj6uXaal@dev-pub-mq.lan.csn.uchile.cl//",
    "topic": "stats.demo",
    "queue": "stats_demo"

}
"""

CONFIG = {
    "exchange": "seismic.topic",
    "amqp_uri": "amqp://task_stats:hugei3jo4xu1ueV2@dev-pub-mq.lan.csn.uchile.cl//",
    "topic": "seismic.events.*",
    "queue": "task_stats"

}



home_project = "/home/ulises/docker/statistics/python";

def main():

    config = configparser.ConfigParser()
    config.read(f'{home_project}/config.ini')

    serverinfo = config['SERVERCONFIG']
    rethinkdb = format(serverinfo['rethinkdb'])

    print(f'rethinkdb : {rethinkdb}')

    exchange = kombu.Exchange(CONFIG["exchange"], no_declare=True)
    queue = kombu.Queue(name=CONFIG["queue"],
                        exchange=exchange, rheading_key=CONFIG["topic"], no_declare=True)

    r.connect( rethinkdb, 28015).repl()

    with kombu.Connection(CONFIG["amqp_uri"]) as conn:
        with conn.SimpleQueue(name=queue) as q:
            
            message = q.get()
            print(message.payload)
            r.db("csn").table("hipocentros").insert(formatea(message.payload)).run()
            # print(type(message.payload))
            message.ack()

def formatea(msg):
   
    head = []
    body = []
 
    creation_info = msg['data']['event']['creation_info']
    agency = creation_info['agency']
    author = creation_info['author']
    creation_time = parser.parse(creation_info['creation_time']) 

    reference = msg['data']['event']['descriptions'][0]['text']

    id = msg['data']['event']['id']

    head.append('agency')
    body.append(agency)

    head.append('author')
    body.append(author)

    head.append('id')
    body.append(id)

    head.append('creation_time')
    body.append(creation_time)

    head.append('reference')
    body.append(reference)

    preferred_magnitude = msg['data']['event']['preferred_magnitude'];
        
    evaluation_mode = preferred_magnitude['evaluation_mode'];
    evaluation_status = preferred_magnitude['evaluation_status'];
    mag = preferred_magnitude['mag'];
    station_count = preferred_magnitude['station_count'];
    type = preferred_magnitude['type'];

    head.append('evaluation_mode')
    body.append(evaluation_mode)
    
   
    head.append('evaluation_status')
    body.append(evaluation_status)

    head.append('mag')
    body.append(mag)

    head.append('station_count')
    body.append(station_count)
    
    head.append('type')
    body.append(type)
    

    preferred_origin = msg['data']['event']['preferred_origin'];

    origin_time = parser.parse(preferred_origin['creation_info']['creation_time'])

    # print(origin_time)

    depth = preferred_origin['depth']['value'];

    latitude = preferred_origin['latitude'];
    longitude = preferred_origin['longitude'];

    head.append('origin_time')
    body.append(origin_time)

    head.append('depth')
    body.append(depth)

    head.append('latitude')
    body.append(latitude)

    head.append('longitude')
    body.append(longitude)

    mail = False
    
    if "meta" in msg:
        mail = msg['meta']['recipients']['mail']

    head.append('mail')
    body.append(mail)
   
    origin_fec = timegm(time.strptime(preferred_origin['creation_info']['creation_time'], "%Y-%m-%dT%H:%M:%S.%f+00:00"))
    creation_fec = timegm(time.strptime(creation_info['creation_time'], "%Y-%m-%dT%H:%M:%S.%f+00:00"))

    if mail == True:
   
       mail_fec = timegm(time.strptime(msg['meta']['created_at'], "%Y-%m-%dT%H:%M:%S.%f+00:00")) 
        

       head.append('retardo_mail')
       body.append(int(mail_fec) - int(origin_fec))
    
    else:
          
       head.append('retardo_mail')
       body.append(None)
        
    head.append('retardo_pub')
    body.append(int(creation_fec) - int(origin_fec))

    head.append('sensible')
    body.append(None)

    return dict(zip(head,body))
    
if __name__ == "__main__":
    main()
