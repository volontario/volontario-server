volontar.io
===========
volontar.io is the best stuff imaginable designed by two bold men holding their keep against the dark armies of to-do items and their master, *Mattsam*.

API
---
All responses are formatted in JSON.

### Root

#### `GET /`
Returns an empty object for debugging. Consider Redis's `PONG`.

### Locations

#### `GET /locations`
| Field | Meaning |
|-------|:--------|
| category | Filter by category |

Returns a list of locations.

### Events

#### `GET /events`
Returns a list of events.

#### `POST /events`
| Field | Type | Meaning |
|-------|:---- |:--------|
| category | `string` | Category, e.g. "charity" |
| latitude | `float` | Latitude |
| longitude | `float` | Longitude |
| name | `string` | Name of the event |
| originalId | `string` | ID in the original system |
| url | `string` | URL for the event |

Enters an event into the database

### Users

#### `GET /users`
Returns a list of users.

#### `POST /users`
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

Enters a user into the database
