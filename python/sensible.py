import kombu
import json
import configparser
from dateutil import parser

import time
from calendar import timegm

from rethinkdb import RethinkDB
r = RethinkDB()

CONFIG = {
    "exchange": "seismic.topic",
    "amqp_uri": "amqp://temp_stats:eighiikooj6uXaal@dev-pub-mq.lan.csn.uchile.cl//",
    "topic": "stats.demo",
    "queue": "stats_demo"

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

            event = message.payload['data']['event']

            type = event['descriptions'][0]['type']

            id = event['id']

            print(type, id)

            if type == "felt report":

                r.db("csn").table("hipocentros").filter({"id": id}).update({"sensible": True}).run()
            
            message.ack()


if __name__ == "__main__":

    main()
