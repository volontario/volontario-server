volontario API
==============
* All responses are formatted in JSON.
* Info on data returned via `GET` requests is not provided because we embrace experimentation.
* Parameters are sent via query – not body

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

### `POST /locations`
Enters a location into the system. Returns `{ "ok": true|false }`.

| Field | Type | Meaning |
|-------|:---- |:--------|
| category | `string` | Category, e.g. "bloodServiceCentre" |
| latitude | `float` | Latitude |
| longitude | `float` | Longitude |
| name | `string` | Name of the location |
| url | `string` | URL for the location |

### `DELETE /locations`
Deletes locations that match the appropriate fields (described in the above `POST`). If no field is given i.e. everything is to be deleted, the API will throw an error *unless* it is given a `notVague` override with the value `true`.

### `DELETE /locations/:id`
Deletes a location with the provided `id`. Returns `{ "ok": true|false }`.

Events
------

### `GET /events`
Returns a list of events.

### `GET /events/:id`
Returns an event with the provided `id`.

### `POST /events`
Enters an event into the system. Returns `{ "ok": true|false }`.

| Field | Type | Meaning |
|-------|:---- |:--------|
| category | `string` | Category, e.g. "charity" |
| latitude | `float` | Latitude |
| longitude | `float` | Longitude |
| name | `string` | Name of the event |
| originalId | `string` | ID in the original system |
| url | `string` | URL for the event |

### `POST /events/:id/calendar`
Enters an item into an event calendar.

| Field | Type | Meaning |
|-------|:---- |:--------|
| userId | `hexstring` | Attendee |
| from | `date` | Attending from |
| to | `date` | Attending to |

### `DELETE /events`
Deletes events that match the appropriate fields (described in the above `POST`). If no field is given i.e. everything is to be deleted, the API will throw an error *unless* it is given a `notVague` override with the value `true`.

### `DELETE /events/:id`
Deletes an event with the provided `id`. Returns `{ "ok": true|false }`.

### `DELETE /events/:id/calendar`
Deletes an item in an event calendar

| Field | Type | Meaning |
|-------|:---- |:--------|
| id | `hexstring` | ID of the item |

Users
-----

### `GET /users`
Returns a list of users.

### `GET /users/:id`
Returns a user with the provided `id`.

### `POST /users`
Enters a user into the system. Returns `{ "ok": true|false }`.

| Field | Type | Meaning |
|-------|:---- |:--------|
| dateOfBirth | `string` | Date of birth formatted as `YYYY-MM-DD`
| email | `string` | Email address
| familyName | `string` | Family name |
| givenName | `string` | Given name |
| latitude | `float` | Latitude |
| longitude | `float` | Longitude |
| phoneNumber | `string` | Phone number with country code |
| tags | `string,string,...` | Comma separated list of tags |

### `DELETE /users`
Deletes users that match the appropriate fields (described in the above `POST`). If no field is given i.e. everything is to be deleted, the API will throw an error *unless* it is given a `notVague` override with the value `true`.

### `DELETE /users/:id`
Deletes a user with the provided `id`. Returns `{ "ok": true|false }`.
