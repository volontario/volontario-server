volontar.io
===========
volontar.io is the best stuff imaginable designed by two bold men holding their keep against the dark armies of to-do items and their master, *Mattsam*.

API
---
All responses are formatted in JSON.

### `GET /`
Returns an empty object for debugging. Consider Redis's `PONG`.

### `GET /locations`
| Field | Meaning |
|-------|:--------|
| category | Filter by category |

Returns a list of locations.

### `GET /events`
Returns a list of events.

### `POST /events`
| Field | Type | Meaning |
|-------|:---- |:--------|
| category | `string` | Category, e.g. "charity" |
| latitude | `float` | Latitude |
| longitude | `float` | Longitude |
| name | `string` | Name of the event |
| originalID | `string` | ID in the original system |
| url | `string` | URL for the event |

Enters an event into the database
