
import kombu
import json
import configparser

import configparser
from rethinkdb import RethinkDB
r = RethinkDB()

import asyncio

from tools import formatea

home_project = "/home/ulises/docker/statistics/python";

async def work():

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
            while (True):
                message = q.get()
                print(message.payload)
            
                r.db("csn").table("hipocentros").insert(formatea(message.payload)).run()
                # print(f'message.payload : {message.payload}')
                message.ack()

            



loop = asyncio.get_event_loop()

try:
    asyncio.ensure_future(work())
    loop.run_forever()
except KeyboardInterrupt:
    pass
finally:
    print("Closing Loop")
    loop.close()

