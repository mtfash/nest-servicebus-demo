# How to run and deploy the application in different environments

You can simply start and test the project using `npm run start:dev` command. Just make sure you include all the necessary variables in an `.env` file. The project is also dockerized so you can run it and all the dependencies using docker compose. Just run `docker compose up` in the project root directory (again make sure all the variables are either defined either in .env file or you provide them) and the services will start. The docker compose file includes `Elasticsearch`, `Kibana`, and `Filebeat` services for managing log data.

Since the project is dockerized you can deploy it anywhere that support docker containers without any problem. I was not able to deploy the application on Azure app service due to some new bug in Microsoft Azure which is still not fixed. (https://learn.microsoft.com/en-us/answers/questions/1527674/the-subscription-is-not-allowed-to-create-or-updat)

## `.env` FIle

Make you you define these variables in the `.env` file:

```
MONGODB_URL=
STORAGE_CONNECTION_STRING=
EVENTHUB_CONNECTION_STRING=
EVENTHUB_FQNS=
EVENTHUB_NAME=
EVENTHUB_CONSUMER_GROUP=
EVENTHUB_STORAGE_ACCOUNT=
EVENTHUB_CHECKPOINT_CONTAINER_NAME=
SERVICEBUS_CONNECTION_STRING=
POST_LIKES_QUEUE=
COMMENTS_QUEUE=
```

## Testing the Application

After you start the application either with `npm run start` or docker compose, you can open `http://locahost:3000/docs` in the browser. This will open the swagger documentation where you can test the APIs.

## Application Introduction

This is a very basic application in which a user will create posts and other users can like or leave comments for each post. We use Mongodb as data store. After a user leaves a comment or likes a post a notification will be created explaining the event.

### Modules

#### posts

This module defines the schemas, controllers, services related to posts, likes and comments. You can call the APIs to create posts, liking a post, leaving comments, etc. For the sake of simplicity theres' no authentication, and we only store the name of the user whereever a user is needed.

When you like a post, or make a comment, an event is sent to `EventHubs` using the `EventHubsProducerService` class which is defined in `events` module.

In a real world scenario these producers, consumers services each one would probably live in its own process even on different servers or networks, but again for the sake of simplicity we have everything in one project.

#### events

The events module contains the `EventHubsConsumerService` and `EventHubsProducerService`. The `EventProducerService` is used in the posts module to send the notification events to `EventHubs`. `EventHubsConsumerService` will ingest the events from `EventHubs` and based on the event type will send messages to `ServiceBus` queues: `post-likes` or `post-comments`.

#### notifications

The notifications module contains two `ServiceBus` consumers: `SBusLikesConsumer` and `SBusCommentsConsumer`
These two consumers will consume the service bus queues for post like and comment messages and transform those messages into notification documents and store them in `notifications` collection.

## Logging

The project uses winston to format logs and uses console and file transports to redirect logs to both terminal and filesystem. If you start the project using the docker compose along with ELK dependencies, the filebeat service will read the logs in the file and send it to elastic search.

I initially tried to integrate the application with Micorsoft Azure Monitor service's App Insights but I had difficulty instrumenting winston logger calls and had to use ELK stack.

## Challenges I faced

Two major challenges I faced was trying to deploy the application on Azure's app service and integrating the App Insights with the nest project which I explained both in previous sections.

## What would I improve?

### Aggregate Notifications Documents

Currently I store a new notification document for each like/comment. This is ineffecient and not scalable. Viral posts could possible have tens of thousands of comments and millions of likes. To tackle this we can aggregate unread notifications (those new notifications that user hasn't read yet) together into one notification. So instead of having 100s of notifications each one saying "X liked your post" we can have something like "X, Y, and 87 others liked your post".

### Batching Events

Currently I am sending each event separately to the `EventHubs`. What I can do to make it better is that instead of immediately sending those events to the eventhubs I would push those messages into a buffer and periodically check whether there's any new message in the buffer for example each second, or five seconds depending on the messages throughput and how much delay is acceptable for us.
