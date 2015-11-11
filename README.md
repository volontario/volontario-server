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

Events
------

### `GET /events`
Returns a list of events.

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
