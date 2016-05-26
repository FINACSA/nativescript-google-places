# nativescript-gplaces

Read Google Places API Documentation at https://developers.google.com/places/android-api/?hl=pt-br
All Credits for https://github.com/mobilemindtec/nativescript-google-places

## Api Configuration

Create a new key to Google Places Api Web Service

## Use in app

```
  var GPlaces = require("nativescript-gplaces");
  var googleServerApiKey = "your key api";
  GPlaces.setGoogleServerApiKey(googleServerApiKey);
  GPlaces.setErrorCallback(onPlacesErrorCallback);

  function onPlacesErrorCallback(text){
      alert(text)
  }
```

## Place search
```
  // run search
  GPlaces.queryAutoComplete(textSearch.text, types, language, radius).then(function(result){
      // search list
  })
```

## Get place details
```
 // get place details
  GPlaces.details(placeId).then(function(place){
      // place result
  })
```

