# nativescript-gplaces

Read Google Places API Documentation at https://developers.google.com/places/android-api/?hl=pt-br

**All Credits for**  https://github.com/mobilemindtec/nativescript-google-places

## Api Configuration

Create a new key to Google Places Api Web Service

## Use in app

```
  var GPlaces = require("nativescript-gplaces");
  GPlaces.init({
                googleServerApiKey: 'your_api_Key',
                language: 'es',
                radius: '100000',
                location: '20.651130,-103.426464',
                errorCallback: function(text){console.log(text)}
               );
```

## Place autocomplete
```
  // run autocomplete
  GPlaces.queryAutoComplete(textSearch.text, types).then(function(result){
      // predictions list
  })
```

## Place search
```
  // run search
  GPlaces.search(textSearch.text, types).then(function(result){
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
