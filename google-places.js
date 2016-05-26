var application = require("application");
var imageSource = require("image-source");

var _googleServerApiKey;
var _placesApiUrl = 'https://maps.googleapis.com/maps/api/place/autocomplete/json';
var _placesDetailsApiUrl = 'https://maps.googleapis.com/maps/api/place/details/json';
var _placesImagesApiUrl = 'https://maps.googleapis.com/maps/api/place/photo';
var _queryAutoCompleteApiUrl = 'https://maps.googleapis.com/maps/api/place/queryautocomplete/json';
var _defaultLanguage = 'es';
var _radius = '100000';
var _defaultLocation = '20.651130,-103.426464';
var _errorCallback;

function handleErrors(response) {

  if (!response.ok) {

    if(_errorCallback)
      _errorCallback(response.statusText)
  }

  return response;
}

function capitalize(text) {
  return text.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
};


exports.setGoogleServerApiKey = function(googleServerApiKey){
  _googleServerApiKey = googleServerApiKey
}

exports.setErrorCallback = function(errorCallback){
  _errorCallback = errorCallback
}

exports.search = function(text, types, language, radius){
    language = language || _defaultLanguage;
    radius = radius || _radius;

    var searchBy = capitalize(text).replace(new RegExp(" ", 'g'), "");
    var url = _placesApiUrl + "?input=" + searchBy + "&types=" + types + "&language="+ language +"&radius="+ radius +"&key=" + _googleServerApiKey

    return fetch(url)
    .then(handleErrors)
    .then(function(response) {
      return response.json();
    }).then(function(data) {

      var items = []

      for(var i = 0; i < data.predictions.length; i++){
        items.push({
          description: data.predictions[i].description,
          placeId: data.predictions[i].place_id,
          'data': data.predictions[i]
        })
      }

      return items
    })
}

exports.queryAutoComplete = function(text, types, language, radius, clocation){
    language = language || _defaultLanguage;
    radius = radius || _radius;
    clocation = clocation || _defaultLocation;
    var searchBy = capitalize(text).replace(new RegExp(" ", 'g'), "");
    var url = _queryAutoCompleteApiUrl + "?input=" + searchBy + "&location="+ clocation +"&types=" + types + "&language="+ language +"&radius="+ radius +"&key=" + _googleServerApiKey
    return fetch(url)
    .then(handleErrors)
    .then(function(response) {
      return response.json();
    }).then(function(data) {
      var items = []
      for(var i = 0; i < data.predictions.length; i++){
        items.push({
          description: data.predictions[i].description,
          placeId: data.predictions[i].place_id,
          'data': data.predictions[i]
        })
      }
      return items
    })
}

exports.details = function(placeid, language){
    language = language || _defaultLanguage;

    var url = _placesDetailsApiUrl + "?placeid=" + placeid + "&language="+ language +"&key=" + _googleServerApiKey

    return fetch(url)
    .then(handleErrors)
    .then(function(response) {
      return response.json();
    }).then(function(data) {

      var place = {}
      var address_components = data.result.address_components
      for(var key in address_components){

        var address_component = address_components[key]


        if (address_component.types[0] == "route"){
            place.route = address_component.long_name;
        }

        if (address_component.types[0] == "locality"){
            place.locality = address_component.long_name;
        }

        if (address_component.types[0] == "country"){
            place.country = address_component.long_name;
        }

        if (address_component.types[0] == "postal_code_prefix"){
            place.zipCode = address_component.long_name;
        }

        if (address_component.types[0] == "street_number"){
            place.number = address_component.long_name;
        }

        if(address_component.types[0] == "sublocality_level_1"){
          place.sublocality = address_component.long_name;
        }
      }

      place.latitude = data.result.geometry.location.lat
      place.longitude = data.result.geometry.location.lng
      place.nome = data.result.name
      place.phone = data.result.international_phone_number
      place.formattedAddress = data.result.formatted_address

      if(data.result.photos && data.result.photos.length > 0){
        place.photoReference = data.result.photos[0].photo_reference
      }

      return place

    })
}

exports.loadPlacePhoto = function(photoreference, onSuccessCallback, onFailCallback){
  var url = _placesImagesApiUrl + "?maxwidth=100&photoreference=" + photoreference + "&key=" + _googleServerApiKey;
  return imageSource.fromUrl(url)
}