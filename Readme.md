# Gluco Tracker

### A backend app for glucose tracker

### API documentation

#### 1. Registering a user

<b>Endpoint - </b> `/api/v1/users/signUp`<br>
<b>HTTP method - </b> `POST`<br>
<b>Payload - </b>

```
{
    "name": "your_name",
    "email": "your_email@gmail.com",
    "password": "Your Password",
    "confirmPassword": "Your Password"
}
```

<hr>

#### 2. Login to app

<b>Endpoint - </b> `/api/v1/users/signIn`<br>
<b>HTTP method - </b> `POST`<br>
<b>Payload - </b>

```
{
    "email": "your_email@gmail.com",
    "password": "Your Password",
}
```

<hr>

#### 3. Sign out of app

<b>Endpoint - </b> `/api/v1/users/signOut`<br>
<b>HTTP method - </b> `POST`<br>

<hr>

#### 4. Getting profile of a logged in user

<b>Endpoint - </b> `/api/v1/users/profile`<br>
<b>HTTP method - </b> `GET`<br>

<hr>

#### 5. Update profile of a logged in user

<b>Endpoint - </b> `/api/v1/users/profile`<br>
<b>HTTP method - </b> `PUT`<br>
<b>Payload - </b>

```
{
    "name": "your_updated_name",
}
```

<hr>

#### 6. Creating a glucose reading

<b>Endpoint - </b> `/api/v1/glucoseReading`<br>
<b>HTTP method - </b> `POST`<br>
<b>Payload - </b>

```
{
    "type": "BL",  //This can take BB, AB, BL, AL, BD, AD
    "reading": "155"
}
```

<hr>

#### 7. Getting all the glucose reading by date

<b>Endpoint - </b> `/api/v1/glucoseReading/all`<br>
<b>HTTP method - </b> `GET`<br>

<hr>

#### 8. Getting all the glucose reading for a particular date

<b>Endpoint - </b> `/api/v1/glucoseReading/${date}`<br>
<b>HTTP method - </b> `GET`<br>

<hr>

#### 9. Creating foods

<b>Endpoint - </b> `/api/v1/foods`<br>
<b>HTTP method - </b> `POST`<br>
<br>

```
{
    "label": "rice",
    "value": "rice"
}
```

<hr>

#### 10. Getting all the foods

<b>Endpoint - </b> `/api/v1/foods/all`<br>
<b>HTTP method - </b> `GET`<br>

<hr>
<hr>
