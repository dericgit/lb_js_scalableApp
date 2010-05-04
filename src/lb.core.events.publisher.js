/*
 * Namespace: lb.core.events.publisher
 * Core Events Publisher
 *
 * The publisher manages a list of subscribers, which get all notified of
 * every event published until they get removed from the list.
 *
 * Author:
 * Eric Bréchemier <legalbox@eric.brechemier.name>
 *
 * Copyright:
 * Legal Box (c) 2010, All Rights Reserved
 *
 * Version:
 * 2010-05-04
 */
/*requires lb.base.log.js */
/*requires lb.core.events.js */
/*jslint nomen:false, white:false, onevar:false, plusplus:false */
/*global lb */
// preserve the module, if already loaded
lb.core.events.publisher = lb.core.events.publisher || (function() {
  // Builder of
  // Closure for lb.core.events.publisher module

  var log = lb.base.log.print,

  // Private members

  // array, the list of subscribers (lb.core.events.Subscribers) subscribed to
  // event notifications
      subscribers = [];

  function getSubscribers(){
    // Function: getSubscribers(): array
    // Get the list of subscribers.
    //
    // Returns:
    //   array, the list of subscribers (lb.core.events.Subscriber)

    return subscribers;
  }

  function addSubscriber(subscriber){
    // Function: addSubscriber(subscriber)
    // Add a new subscriber to the list.
    //
    // Parameter:
    //   subscriber - object, the new subscriber (lb.core.events.Subscriber)

    subscribers.push(subscriber);
  }

  function removeSubscriber(subscriber){
    // Function: removeSubscriber(subscriber)
    // Remove an existing subscriber from the list.
    //
    // Parameter:
    //   subscriber - object, the old subscriber (lb.core.events.Subscriber)
    //
    // Note:
    // Nothing happens in case the subscriber is not present.

    for (var i=0; i<subscribers.length; i++){
      if (subscriber === subscribers[i]){
        subscribers.splice(i,1);
      }
    }
  }

  function publish(event){
    // Function: publish(event)
    // Publish an event to be broadcast to all subscribers.
    //
    // Parameter:
    //   event - object, the event object
    //
    // Note:
    //   All subscribers present at the start of the call will get notified.
    //   Adding or removing a subscriber during the publication of an event
    //   will only have effect for subsequent events.

    // take a snapshot of the list of subscribers to avoid running into
    // infinite loops or skipping subscribers in case the list is modified.
    var currentSubscribers = subscribers.concat();

    for (var i=0; i<currentSubscribers.length; i++){
      try {
        currentSubscribers[i].notify(event);
      } catch(e) {
        log('ERROR: Failed to notify subscriber "'+currentSubscribers[i]+
            '", "'+e+'"');
      }
    }
  }

  return { // Facade API
    getSubscribers: getSubscribers,
    addSubscriber: addSubscriber,
    removeSubscriber: removeSubscriber,
    publish: publish
  };
}());
