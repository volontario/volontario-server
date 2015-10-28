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
