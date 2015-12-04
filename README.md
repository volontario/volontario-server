volontario API
==============
* All responses are formatted as JSON.
* To use any `POST` or `DELETE` commands except `POST /users`, you have to authenticate via HTTP Basic Auth. Create a user and use the same credentials as given to the newly made user when creating or deleting things. This is to be able to match things to their creators and deleters.

Root
----

### `GET /`
Returns an empty object as a status check. Consider Redis's `PONG`.

Locations
---------

### `GET /locations`
Returns a list of locations.

| Field | Meaning |
|-------|:--------|
| category | Filter by category |

### `GET /locations/:id`
Returns a location with the provided `id`.

### `GET /locations/:id/:field`
Returns a specific field of a location with the provided `id`. Has to be used to fetch expensive fields.

### `POST /locations`
Enters a location into the system. Returns `201` on success.

| Field | Type | Meaning |
|-------|:---- |:--------|
| category | `string` | Category, e.g. "bloodServiceCentre" |
| latitude | `float` | Latitude |
| longitude | `float` | Longitude |
| name | `string` | Name of the location |
| url | `string` | URL for the location |

### `DELETE /locations`
Deletes locations that match the appropriate fields (described in the above `POST`). If no field is given i.e. everything is to be deleted, the API will throw an error *unless* it is given a `notVague` override with the value `true`.

On success, returns either `205` or `204` depending on whether anything was actually deleted.

### `DELETE /locations/:id`
Deletes a location with the provided `id`. Returns `204` on success.

Events
------

### `GET /events`
Returns a list of events.

### `GET /events/:id`
Returns an event with the provided `id`.

### `GET /events/:id/:field`
Returns a specific field of an event with the provided `id`. Has to be used to fetch expensive fields such as calendars.

### `POST /events`
Enters an event into the system. Returns `201` on success.

| Field | Type | Meaning |
|-------|:---- |:--------|
| category | `string` | Category, e.g. "charity" |
| latitude | `float` | Latitude |
| longitude | `float` | Longitude |
| name | `string` | Name of the event |
| originalId | `string` | ID in the original system |
| url | `string` | URL for the event |

### `POST /events/:id/calendar`
Enters an item into an event calendar. Returns `201` on success.

| Field | Type | Meaning |
|-------|:---- |:--------|
| userId | `hexstring` | Attendee |
| from | `microtimestamp` | Attending from |
| to | `microtimestamp` | Attending to |

### `DELETE /events`
Deletes events that match the appropriate fields (described in the above `POST`). If no field is given i.e. everything is to be deleted, the API will throw an error *unless* it is given a `notVague` override with the value `true`.

On success, returns either `205` or `204` depending on whether anything was actually deleted.

### `DELETE /events/:id`
Deletes an event with the provided `id`. Returns `204` on success.

### `DELETE /events/:id/calendar`
Deletes an item in an event calendar. Returns `204` on success.

| Field | Type | Meaning |
|-------|:---- |:--------|
| id | `hexstring` | ID of the item |

Users
-----

### `GET /users`
Returns a list of users.

### `GET /users/:id`
Returns a user with the provided `id`.

### `GET /users/:id/:field`
Returns a specific field of a user with the provided `id`. Has to be used to fetch expensive fields.

### `POST /users`
Enters a user into the system. Returns `201` on success.

| Field | Type | Meaning |
|-------|:---- |:--------|
| dateOfBirth | `microtimestamp` | Date of birth
| email | `string` | Email address
| familyName | `string` | Family name |
| givenName | `string` | Given name |
| latitude | `float` | Latitude |
| longitude | `float` | Longitude |
| phoneNumber | `string` | Phone number with country code |
| tags | `string,string,...` | Comma separated list of tags |

### `DELETE /users`
Deletes users that match the appropriate fields (described in the above `POST`). If no field is given i.e. everything is to be deleted, the API will throw an error *unless* it is given a `notVague` override with the value `true`.

On success, returns either `205` or `204` depending on whether anything was actually deleted.

### `DELETE /users/:id`
Deletes a user with the provided `id`. Returns `204` on success.
