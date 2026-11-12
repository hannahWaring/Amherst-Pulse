# Amherst Pulse API

> Version 1.0.0

Errors are `{ "error": { "code", "message" } }`, except collection routes, which send `{ "error": "<message>" }`.


## Path Table

| Method | Path | Description |
| --- | --- | --- |
| POST | [/pins](#postpins) | Create a pin |
| GET | [/pins/collection/{collectionId}](#getpinscollectioncollectionid) | List the pins in a collection |
| GET | [/pins/user/{userId}](#getpinsuseruserid) | List a user's public pins (not implemented) |
| GET | [/pins/{id}](#getpinsid) | Get a pin |
| PATCH | [/pins/{id}](#patchpinsid) | Update a pin (creator only) |
| DELETE | [/pins/{id}](#deletepinsid) | Delete a pin (creator only) |
| POST | [/collections](#postcollections) | Create a collection |
| GET | [/collections](#getcollections) | List all public collections (not implemented) |
| GET | [/collections/user/{userId}](#getcollectionsuseruserid) | List the collections a user owns |
| GET | [/collections/user/{userId}/shared](#getcollectionsuseruseridshared) | List the collections shared with a user |
| GET | [/collections/{id}](#getcollectionsid) | Get a collection |
| PATCH | [/collections/{id}](#patchcollectionsid) | Update a collection |
| DELETE | [/collections/{id}](#deletecollectionsid) | Delete a collection |
| POST | [/collections/{id}/addPin](#postcollectionsidaddpin) | Add a pin to a collection (user_id must be the owner or a collaborator) |
| DELETE | [/collections/{id}/deletePin/{pinId}](#deletecollectionsiddeletepinpinid) | Remove a pin from a collection (user_id must be the owner or a collaborator) |
| POST | [/collections/{id}/share](#postcollectionsidshare) | Share a collection with a user (not implemented) |
| DELETE | [/collections/{id}/revoke](#deletecollectionsidrevoke) | Revoke a user's access to a collection (not implemented) |
| POST | [/auth/signup](#postauthsignup) | Create an account and sign in |
| POST | [/auth/login](#postauthlogin) | Sign in |
| POST | [/auth/logout](#postauthlogout) | Sign out (invalidates the access and refresh tokens) |
| POST | [/auth/refresh](#postauthrefresh) | Get a new session from a refresh token |

## Reference Table

| Name | Path | Description |
| --- | --- | --- |
| bearerAuth | [#/components/securitySchemes/bearerAuth](#componentssecurityschemesbearerauth) |  |
| PinFields | [#/components/schemas/PinFields](#componentsschemaspinfields) |  |
| NewPin | [#/components/schemas/NewPin](#componentsschemasnewpin) |  |
| Pin | [#/components/schemas/Pin](#componentsschemaspin) |  |
| CollectionFields | [#/components/schemas/CollectionFields](#componentsschemascollectionfields) |  |
| NewCollection | [#/components/schemas/NewCollection](#componentsschemasnewcollection) |  |
| Collection | [#/components/schemas/Collection](#componentsschemascollection) |  |
| CollectionPin | [#/components/schemas/CollectionPin](#componentsschemascollectionpin) |  |
| Credentials | [#/components/schemas/Credentials](#componentsschemascredentials) |  |
| AuthSession | [#/components/schemas/AuthSession](#componentsschemasauthsession) |  |
| CollectionId | [#/components/parameters/CollectionId](#componentsparameterscollectionid) |  |
| UserId | [#/components/parameters/UserId](#componentsparametersuserid) |  |

## Path Details

***

### [POST]/pins

- Summary  
  Create a pin

- Tags  
  Pins

- Security  
  bearerAuth

#### RequestBody

*Required*

- application/json

```typescript
{
  title: string
  description?: string | null
  location_name?: string | null
  latitude?: number | null
  longitude?: number | null
  starts_at?: string | null
  ends_at?: string | null
  is_all_day?: boolean //default: false
  recurrence_rule?: string | null
}
```

#### Responses

- 201 Created

`application/json`

```typescript
{
  id?: string //format: uuid
  creator_id?: string //format: uuid
  title?: string
  description?: string | null
  location_name?: string | null
  latitude?: number | null
  longitude?: number | null
  starts_at?: string | null
  ends_at?: string | null
  is_all_day?: boolean //default: false
  recurrence_rule?: string | null
}
```

- 400 `Title is required.` · `Unknown field in request.` · `Invalid value in request.` · `Missing required field.`

- 401 `Authentication required.`

***

### [GET]/pins/collection/{collectionId}

- Summary  
  List the pins in a collection

- Tags  
  Pins

- Security  
  bearerAuth

#### Parameters(Path)

```typescript
collectionId: string //format: uuid
```

#### Responses

- 200 Pins (empty if none)

`application/json`

```typescript
{
  id?: string //format: uuid
  creator_id?: string //format: uuid
  title?: string
  description?: string | null
  location_name?: string | null
  latitude?: number | null
  longitude?: number | null
  starts_at?: string | null
  ends_at?: string | null
  is_all_day?: boolean //default: false
  recurrence_rule?: string | null
}[]
```

- 400 `Invalid collection ID.`

- 401 `Authentication required.`

***

### [GET]/pins/user/{userId}

- Summary  
  List a user's public pins (not implemented)

- Tags  
  Pins

- Security  
  bearerAuth

#### Parameters(Path)

```typescript
userId: string //format: uuid
```

#### Responses

- 401 `Authentication required.`

- 501 `Not implemented`

***

### [GET]/pins/{id}

- Summary  
  Get a pin

- Tags  
  Pins

- Security  
  bearerAuth

#### Parameters(Path)

```typescript
id: string //format: uuid
```

#### Responses

- 200 The pin

`application/json`

```typescript
{
  id?: string //format: uuid
  creator_id?: string //format: uuid
  title?: string
  description?: string | null
  location_name?: string | null
  latitude?: number | null
  longitude?: number | null
  starts_at?: string | null
  ends_at?: string | null
  is_all_day?: boolean //default: false
  recurrence_rule?: string | null
}
```

- 400 `Invalid pin ID.`

- 401 `Authentication required.`

- 404 `Pin not found`

***

### [PATCH]/pins/{id}

- Summary  
  Update a pin (creator only)

- Tags  
  Pins

- Security  
  bearerAuth

#### Parameters(Path)

```typescript
id: string //format: uuid
```

#### RequestBody

*Required*

- application/json

```typescript
{
  title?: string
  description?: string | null
  location_name?: string | null
  latitude?: number | null
  longitude?: number | null
  starts_at?: string | null
  ends_at?: string | null
  is_all_day?: boolean //default: false
  recurrence_rule?: string | null
}
```

#### Responses

- 200 The updated pin

`application/json`

```typescript
{
  id?: string //format: uuid
  creator_id?: string //format: uuid
  title?: string
  description?: string | null
  location_name?: string | null
  latitude?: number | null
  longitude?: number | null
  starts_at?: string | null
  ends_at?: string | null
  is_all_day?: boolean //default: false
  recurrence_rule?: string | null
}
```

- 400 `Invalid pin ID.` · `Title must be a non-empty string.` · `Unknown field in request.` · `Invalid value in request.` · `Missing required field.`

- 401 `Authentication required.`

- 403 `Only the creator can edit this pin`

- 404 `Pin not found` · `Not found` (empty body)

***

### [DELETE]/pins/{id}

- Summary  
  Delete a pin (creator only)

- Tags  
  Pins

- Security  
  bearerAuth

#### Parameters(Path)

```typescript
id: string //format: uuid
```

#### Responses

- 204 Deleted

- 400 `Invalid pin ID.`

- 401 `Authentication required.`

- 403 `Only the creator can delete this pin`

- 404 `Pin not found`

***

### [POST]/collections

- Summary  
  Create a collection

- Tags  
  Collections

- Security  
  bearerAuth

#### RequestBody

*Required*

- application/json

```typescript
{
  owner_id: string //format: uuid
  title: string
  description?: string | null
  visibility?: enum[private, public] //default: private
  viewer_can_add_pins?: boolean //default: false
}
```

#### Responses

- 201 Created

`application/json`

```typescript
{
  id?: string //format: uuid
  owner_id?: string //format: uuid
  title?: string
  description?: string | null
  visibility?: enum[private, public] //default: private
  viewer_can_add_pins?: boolean //default: false
}
```

- 401 `Authentication required.`

- 500 `null value in column "<column>" of relation "collections" violates not-null constraint` · `invalid input syntax for type uuid: "<value>"` · `insert or update on table "collections" violates foreign key constraint "collections_owner_id_fkey"`

***

### [GET]/collections

- Summary  
  List all public collections (not implemented)

- Tags  
  Collections

- Security  
  bearerAuth

#### Responses

- 401 `Authentication required.`

- 501 `Not implemented`

***

### [GET]/collections/user/{userId}

- Summary  
  List the collections a user owns

- Tags  
  Collections

- Security  
  bearerAuth

#### Parameters(Path)

```typescript
userId: string //format: uuid
```

#### Responses

- 200 Collections (empty if none)

`application/json`

```typescript
{
  id?: string //format: uuid
  owner_id?: string //format: uuid
  title?: string
  description?: string | null
  visibility?: enum[private, public] //default: private
  viewer_can_add_pins?: boolean //default: false
}[]
```

- 401 `Authentication required.`

- 500 `invalid input syntax for type uuid: "<userId>"`

***

### [GET]/collections/user/{userId}/shared

- Summary  
  List the collections shared with a user

- Tags  
  Collections

- Security  
  bearerAuth

#### Parameters(Path)

```typescript
userId: string //format: uuid
```

#### Responses

- 200 Collections (empty if none)

`application/json`

```typescript
{
  id?: string //format: uuid
  owner_id?: string //format: uuid
  title?: string
  description?: string | null
  visibility?: enum[private, public] //default: private
  viewer_can_add_pins?: boolean //default: false
}[]
```

- 401 `Authentication required.`

- 500 `invalid input syntax for type uuid: "<userId>"`

***

### [GET]/collections/{id}

- Summary  
  Get a collection

- Tags  
  Collections

- Security  
  bearerAuth

#### Parameters(Path)

```typescript
id: string //format: uuid
```

#### Responses

- 200 The collection

`application/json`

```typescript
{
  id?: string //format: uuid
  owner_id?: string //format: uuid
  title?: string
  description?: string | null
  visibility?: enum[private, public] //default: private
  viewer_can_add_pins?: boolean //default: false
}
```

- 401 `Authentication required.`

- 404 `Collection not found`

- 500 `invalid input syntax for type uuid: "<id>"`

***

### [PATCH]/collections/{id}

- Summary  
  Update a collection

- Tags  
  Collections

- Security  
  bearerAuth

#### Parameters(Path)

```typescript
id: string //format: uuid
```

#### RequestBody

*Required*

- application/json

```typescript
{
  title?: string
  description?: string | null
  visibility?: enum[private, public] //default: private
  viewer_can_add_pins?: boolean //default: false
}
```

#### Responses

- 200 The updated collection

`application/json`

```typescript
{
  id?: string //format: uuid
  owner_id?: string //format: uuid
  title?: string
  description?: string | null
  visibility?: enum[private, public] //default: private
  viewer_can_add_pins?: boolean //default: false
}
```

- 401 `Authentication required.`

- 404 `Collection not found`

- 500 `invalid input syntax for type uuid: "<id>"` · `Cannot coerce the result to a single JSON object` (empty body)

***

### [DELETE]/collections/{id}

- Summary  
  Delete a collection

- Tags  
  Collections

- Security  
  bearerAuth

#### Parameters(Path)

```typescript
id: string //format: uuid
```

#### Responses

- 204 Deleted

- 401 `Authentication required.`

- 404 `Collection not found`

- 500 `invalid input syntax for type uuid: "<id>"`

***

### [POST]/collections/{id}/addPin

- Summary  
  Add a pin to a collection (user_id must be the owner or a collaborator)

- Tags  
  Collections

- Security  
  bearerAuth

#### Parameters(Path)

```typescript
id: string //format: uuid
```

#### RequestBody

*Required*

- application/json

```typescript
{
  pin_id: string //format: uuid
  user_id: string //format: uuid
}
```

#### Responses

- 201 Added

`application/json`

```typescript
{
  collection_id?: string //format: uuid
  pin_id?: string //format: uuid
  added_by?: string //format: uuid
}
```

- 401 `Authentication required.`

- 403 `Only the owner or an editor of this collection can do this`

- 404 `Collection not found` · `Pin not found`

- 409 `Pin is already in this collection`

- 500 `invalid input syntax for type uuid: "<value>"`

***

### [DELETE]/collections/{id}/deletePin/{pinId}

- Summary  
  Remove a pin from a collection (user_id must be the owner or a collaborator)

- Tags  
  Collections

- Security  
  bearerAuth

#### Parameters(Path)

```typescript
id: string //format: uuid
```

```typescript
pinId: string //format: uuid
```

#### RequestBody

*Required*

- application/json

```typescript
{
  user_id: string //format: uuid
}
```

#### Responses

- 204 Removed

- 401 `Authentication required.`

- 403 `Only the owner or an editor of this collection can do this`

- 404 `Collection not found` · `Pin is not in this collection`

- 500 `invalid input syntax for type uuid: "<value>"`

***

### [POST]/collections/{id}/share

- Summary  
  Share a collection with a user (not implemented)

- Tags  
  Collections

- Security  
  bearerAuth

#### Parameters(Path)

```typescript
id: string //format: uuid
```

#### Responses

- 401 `Authentication required.`

- 501 `Not implemented`

***

### [DELETE]/collections/{id}/revoke

- Summary  
  Revoke a user's access to a collection (not implemented)

- Tags  
  Collections

- Security  
  bearerAuth

#### Parameters(Path)

```typescript
id: string //format: uuid
```

#### Responses

- 401 `Authentication required.`

- 501 `Not implemented`

***

### [POST]/auth/signup

- Summary  
  Create an account and sign in

- Tags  
  Auth

#### RequestBody

*Required*

- application/json

```typescript
{
  username: string
  password: string
}
```

#### Responses

- 201 Created

`application/json`

```typescript
{
  user: {
    id?: string //format: uuid
    username?: string
  }
  access_token?: string
  refresh_token?: string
  expires_at?: integer
}
```

- 400 `username and password are required` · `Password should be at least 6 characters.`

- 409 `Username is already taken`

***

### [POST]/auth/login

- Summary  
  Sign in

- Tags  
  Auth

#### RequestBody

*Required*

- application/json

```typescript
{
  username: string
  password: string
}
```

#### Responses

- 200 Signed in

`application/json`

```typescript
{
  user: {
    id?: string //format: uuid
    username?: string
  }
  access_token?: string
  refresh_token?: string
  expires_at?: integer
}
```

- 400 `username and password are required`

- 401 `Invalid username or password`

***

### [POST]/auth/logout

- Summary  
  Sign out (invalidates the access and refresh tokens)

- Tags  
  Auth

- Security  
  bearerAuth

#### Responses

- 204 Signed out

- 401 `Missing bearer token` · `Invalid or expired token`

***

### [POST]/auth/refresh

- Summary  
  Get a new session from a refresh token

- Tags  
  Auth

#### RequestBody

*Required*

- application/json

```typescript
{
  refresh_token: string
}
```

#### Responses

- 200 New session

`application/json`

```typescript
{
  user: {
    id?: string //format: uuid
    username?: string
  }
  access_token?: string
  refresh_token?: string
  expires_at?: integer
}
```

- 400 `refresh_token is required`

- 401 `Invalid or expired refresh token`

## References

### #/components/securitySchemes/bearerAuth

- Type: http
- Scheme: bearer
- Bearer format: JWT

### #/components/schemas/PinFields

```typescript
{
  title?: string
  description?: string | null
  location_name?: string | null
  latitude?: number | null
  longitude?: number | null
  starts_at?: string | null
  ends_at?: string | null
  is_all_day?: boolean //default: false
  recurrence_rule?: string | null
}
```

### #/components/schemas/NewPin

```typescript
{
  title: string
  description?: string | null
  location_name?: string | null
  latitude?: number | null
  longitude?: number | null
  starts_at?: string | null
  ends_at?: string | null
  is_all_day?: boolean //default: false
  recurrence_rule?: string | null
}
```

### #/components/schemas/Pin

```typescript
{
  id?: string //format: uuid
  creator_id?: string //format: uuid
  title?: string
  description?: string | null
  location_name?: string | null
  latitude?: number | null
  longitude?: number | null
  starts_at?: string | null
  ends_at?: string | null
  is_all_day?: boolean //default: false
  recurrence_rule?: string | null
}
```

### #/components/schemas/CollectionFields

```typescript
{
  title?: string
  description?: string | null
  visibility?: enum[private, public] //default: private
  viewer_can_add_pins?: boolean //default: false
}
```

### #/components/schemas/NewCollection

```typescript
{
  owner_id: string //format: uuid
  title: string
  description?: string | null
  visibility?: enum[private, public] //default: private
  viewer_can_add_pins?: boolean //default: false
}
```

### #/components/schemas/Collection

```typescript
{
  id?: string //format: uuid
  owner_id?: string //format: uuid
  title?: string
  description?: string | null
  visibility?: enum[private, public] //default: private
  viewer_can_add_pins?: boolean //default: false
}
```

### #/components/schemas/CollectionPin

```typescript
{
  collection_id?: string //format: uuid
  pin_id?: string //format: uuid
  added_by?: string //format: uuid
}
```

### #/components/schemas/Credentials

```typescript
{
  username: string
  password: string
}
```

### #/components/schemas/AuthSession

```typescript
{
  user: {
    id?: string //format: uuid
    username?: string
  }
  access_token?: string
  refresh_token?: string
  expires_at?: integer
}
```

### #/components/parameters/CollectionId

```typescript
id: string //format: uuid
```

### #/components/parameters/UserId

```typescript
userId: string //format: uuid
```