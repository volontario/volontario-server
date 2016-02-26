volontario API
==============

* All responses and request bodies are formatted as JSON.
* To fetch resources, use GET. Some resources may require Basic auth.
* To add resources, you must use Basic auth. The fresh resources will be owned by the user you created.
* To modify and delete resources, ensure you either own the resource directly or own the user that owns the resources. Then use Basic auth.
* For Basic auth credentials, create a user (via `POST /users`).
* Tests may be ran using `npm tests`.

### Notes on `PATCH`
`PATCH` requests are formatted as specified in RFC6902. The only supported operation is `replace`.

For example, to update the `startsAt` field of an event, send the following body to `/events/:id`:

```json
{
	"op": "replace",
	"path": "/startsAt",
	"value": "2015-12-30T21:10:03.772Z"
}
```

The response should then be an empty `204`.


Root
----

#### `GET /`
Always returns an empty object. May be used as a status check.


Locations
---------

#### `GET /locations`
Returns a list of locations along with basic details.

#### `GET /locations/:id`
Returns a location with the provided `id`.

#### `GET /locations/:id/:field`
Returns a specific field of a location with the provided `id`. Has to be used to fetch expensive fields.

#### `POST /locations`
Enters a location into the system. Returns `201` on success.

```json
{
	"category": "soupKitchen",
	"coordinates": {
		"latitude": 61.493,
		"longitude": 23.766
	},
	"name": "Soup kitchen",
	"ownerId": "0123456789abcdef",
	"url": "https://soup.kitchen"
}
```

#### `DELETE /locations`
Deletes locations that match the appropriate fields (described in the above `POST`). If no field is given i.e. everything is to be deleted, the API will throw an error *unless* it is given a `notVague` override with the value `true`.

On success, returns either `205` or `204` depending on whether anything was actually deleted.

#### `DELETE /locations/:id`
Deletes a location with the provided `id`. Returns `204` on success.


Events
------

#### `GET /events`
Returns a list of events.

#### `GET /events/:id`
Returns an event with the provided `id`.

#### `GET /events/:id/calender`
Works exactly as you would expect. Except, you could give the request a `inverted` field, though, and set it to `true`. Then, instead of *reserved* times, you would get the *free* times of the calendar.

#### `GET /events/:id/:field`
Returns a specific field of an event with the provided `id`. Has to be used to fetch expensive fields such as calendars.

#### `POST /events`
Enters an event into the system. Returns `201` on success.

```json
{
	"category": "food",
	"name": "Free food for the poor",
	"locationId": "01203baccdb123",
	"startsAt": 1455977371443,
	"endsAt": 1455984342294
}
```

#### `POST /events/:id/calendar`
Enters an item into an event calendar. Returns `201` on success.

```json
{
	"from": 1455970444328,
	"to": 1455971059585,
	"userId": "bb34f8098444df"
}
```

#### `PATCH /events/:id`
Updates the given field of an event. See Notes for more information.

#### `DELETE /events`
Deletes events that match the appropriate fields (described in the above `POST`). If no field is given i.e. everything is to be deleted, the API will throw an error *unless* it is given a `notVague` override with the value `true`.

On success, returns either `205` or `204` depending on whether anything was actually deleted.

#### `DELETE /events/:id`
Deletes an event with the provided `id`. Returns `204` on success.

#### `DELETE /events/:id/calendar`
Deletes an item in an event calendar. Returns `204` on success.


Users
-----

#### `GET /users`
Returns a list of users.

#### `GET /users/:id`
Returns a user with the provided `id`.

#### `GET /users/:id/:field`
Returns a specific field of a user with the provided `id`. Has to be used to fetch expensive fields such as `events` or `calendar`.

#### `POST /users`
Enters a user into the system. Returns `201` on success.

```json
{
	"coordinates": {
		"latitude": 62.493,
		"longitude": 22.766
	},
	"dateOfBirth": 74049120000,
	"email": "oliver@volontar.io",
	"givenName": "Oliver",
	"familyName": "Testerman",
	"phoneNumber": "+358504445194",
	"tags": [
		"cooking",
		"computers",
		"organizing"
	]
}
```

#### `DELETE /users`
Deletes users that match the appropriate fields (described in the above `POST`). If no field is given i.e. everything is to be deleted, the API will throw an error *unless* it is given a `notVague` override with the value `true`.

On success, returns either `205` or `204` depending on whether anything was actually deleted.

#### `DELETE /users/:id`
Deletes a user with the provided `id`. Returns `204` on success.
