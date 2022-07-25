import calendar
import kombu
import json
import configparser
from dateutil import parser

import time
from calendar import timegm
import configparser
from rethinkdb import RethinkDB
r = RethinkDB()

home_project = "/home/ulises/docker/statistics/python";

def main():

    config = configparser.ConfigParser()
    config.read(f'{home_project}/config.ini')

    serverinfo = config['SERVERCONFIG']
    rethinkdb = format(serverinfo['rethinkdb'])

    rabbitmq = config['RABBITMQ']

    # print(f'rethinkdb : {rethinkdb}')

    exchange = kombu.Exchange(format(rabbitmq['exchange']), no_declare=True)
    queue = kombu.Queue(format(rabbitmq['queue']),
                        exchange=exchange, rheading_key=format(rabbitmq['topic']), no_declare=True)

    r.connect( rethinkdb, 28015).repl()

    with kombu.Connection(format(rabbitmq['amqp_uri'])) as conn:
        with conn.SimpleQueue(name=queue) as q:
            
            message = q.get()
            # print(message.payload)
            # formatea(message.payload)
            r.db("csn").table("hipocentros").insert(formatea(message.payload)).run()
            # print(f'message.payload : {message.payload}')
            # message.ack()

def formatea(msg):
   
    head = []
    body = []
 
    creation_info = msg['data']['event']['creation_info']
    agency = creation_info['agency']
 
    id = msg['data']['event']['id']

    head.append('ide')
    body.append(id)

    for v in msg['data']['event']['descriptions']:

        if v['type'] == 'felt report':
            r.db("csn").table("hipocentros").filter({"ide": id}).update({"perceived": True}).run()

        if v['type'] == 'nearest cities':
            reference = v['text']   

    head.append('agency')
    body.append(agency)

    author = creation_info['author']

    head.append('author')
    body.append(author)

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

    depth = float(preferred_origin['depth']['value'])/1000;

    latitude = preferred_origin['latitude'];
    longitude = preferred_origin['longitude'];

    head.append('depth')
    body.append(depth)

    head.append('latitude')
    body.append(latitude)

    head.append('longitude')
    body.append(longitude)

    mail = None
    
    if "meta" in msg:

        # mail
        mail = msg['meta']['recipients']['mail']
        head.append('mail')
        body.append(mail)
   
        # creation_time
        creation_time = timegm(time.strptime(msg['meta']['created_at'], "%Y-%m-%dT%H:%M:%S.%f+00:00"))
        head.append('creation_time')
        body.append(parser.parse(msg['meta']['created_at']))
        
        origin_time =    timegm(time.strptime(preferred_origin['time'], "%Y-%m-%dT%H:%M:%S.%f+00:00"))  
        

        head.append('origin_time')
        body.append(parser.parse(preferred_origin['time']))


        retardo_pub = (creation_time - origin_time)/60        

        head.append('retardo_pub')
        body.append(retardo_pub)

        # mayor_5
        head.append('mayor_5')

        if retardo_pub > 5 and evaluation_status == 'preliminary':

            body.append(True)
        else:
            body.append(None) 
        
        # mayor_20
        head.append('mayor_20')

        if retardo_pub > 20 and evaluation_status == 'final':

            body.append(True)
        else:
            body.append(None) 


    if mail == True:
   
       # retardo_mail
       head.append('retardo_mail')
       retardo_mail = (calendar.timegm(time.gmtime()) - origin_time)/60

       body.append(retardo_mail)
    
    else:
          
       head.append('retardo_mail')
       body.append(None)
        

    head.append('perceived')
    body.append(None)

    out = dict(zip(head,body))

    """  
    print(out['ide'])
    print(out['latitude'])
    print(out['longitude'])
    print(out['depth'])
    print(out['mag'])
    print(out['type'])
    print(out['station_count'])
    print(out['origin_time'])
    print(out['author'])
    print(out['agency'])
    print(out['creation_time'])
    print(out['reference'])
    print(out['evaluation_mode'])
    print(out['evaluation_status'])
    print(out['mail'])
    print(out['retardo_pub'])
    print(out['retardo_mail'])
    print(out['mayor_5'])
    print(out['mayor_20'])
    print(out['perceived'])
    """

    # print(out)

    return out
    
if __name__ == "__main__":
    main()
