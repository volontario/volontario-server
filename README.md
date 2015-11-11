volontario API
==============
All responses are formatted in JSON.

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
Enters a location into the system

| Field | Type | Meaning |
|-------|:---- |:--------|
| category | `string` | Category, e.g. "bloodServiceCentre" |
| latitude | `float` | Latitude |
| longitude | `float` | Longitude |
| name | `string` | Name of the location |
| url | `string` | URL for the location |

Events
------

### `GET /events`
Returns a list of events.

### `GET /events/:id`
Returns an event with the provided `id`.

### `POST /events`
Enters an event into the system

| Field | Type | Meaning |
|-------|:---- |:--------|
| category | `string` | Category, e.g. "charity" |
| latitude | `float` | Latitude |
| longitude | `float` | Longitude |
| name | `string` | Name of the event |
| originalId | `string` | ID in the original system |
| url | `string` | URL for the event |

Users
-----

### `GET /users`
Returns a list of users.

### `GET /users/:id`
Returns a user with the provided `id`.

### `POST /users`
Enters a user into the system

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
