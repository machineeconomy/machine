# machine
This repository contains the code to setup an IOTA wallet and have some extra communitcation functions via websockets. 

The code can deployed via docker on a machine, to enable easy machine2machine micro and macro payments. 

For demonstratiosn purposes, we setup a docker-compose file, to compose four example machines.

- Machine 1 - A robot
- Machine 2 - Wind energy provider
- Machine 3 - A second robot
- Machine 4 - Solar energy provider

[This demonstration](https://machineeconomy.github.io/m2m.akitablock.io/) shows, how a user can send iota devnet tokens to one of the robots, to manufacture a new product. The robot will automatically pay an energy provider after an order.

## Setup and run

Start all 4 machines (robot 1 and 2 + solar and wind energy)

You have to install [Docker](https://www.docker.com).

```bash
git clone https://github.com/machineeconomy/machine
cd machine
docker-compose up
```

## Architecture

This service provides an iota wallet for an machine. It can be configured via enviroment variables.

### Environment Variables

| Variable   |      Example      |  Description |
|----------|:-------------:|------:|
| PORT |    3000   |  application port |
| NAME |  robot 1 | the name of the service |
| SEED |    AVL...RFS   |  81 trytes long iota seed for the wallet |


### Webserver

The service provide some endpoints to get information about the state of the service.


| PATH   |      Example      |  Description |
|----------|:-------------:|------:|
| / |    http://localhost:3000/   | show current service name |


### Websockets

The sevice also provides a websocket connection. It runs also on the same PORT like the webserver under path `/sockets`.

When a new usser connect to the ws server, the service emits a message with the name and status of the machine in the `welcome` channel.

The service listens to the `order` channel, for incoming orders through the user application. 