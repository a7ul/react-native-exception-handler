# Crashy Project 

Battery-included with automatic error logging, just provide your api server url

## Usage

``` npm install https://github.com/kukuandroid/crashy.git#stable --save ```

In your app.js or application root,
```
import Crashy from "crashy"

   Crashy.init({
            apiUrl: "your-api-url",
            deviceInfo: { // any device details },
            errorTitle: "Error Title",
            customerId: "your-customer-id",
            errorMessage: "",
        });
```

##  Peer-dependencies
Crashy has dependencies to libraries as below, make sure to install it :

| No | Library | Link |
| :---:   | :-: | :-: |
| 1 | Async Storage | https://react-native-async-storage.github.io/async-storage/docs/install |


## For react-native@0.60.0 or above

As react-native@0.60.0 or above supports autolinking, so there is no need to run linking process. Read more about autolinking here.


## Option Properties
Property | Type | Default | Desc
--- | --- | --- | ---
apiLogUrl *(required)* | `String` | null | Log Error Server Url
errorTitle  | `String` | default | Alert message title
errorMessage | `String` | default | Alert message body
deviceInfo | `Object` |  


## Maybank : Engineering Team

Peace ! ✌🏻🍻
