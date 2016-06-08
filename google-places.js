var application = require("application");
var imageSource = require("image-source");

var _googleServerApiKey,
    _defaultLanguage,
    _radius,
    _errorCallbackl,
    _defaultLocation,
    _placesApiUrl = 'https://maps.googleapis.com/maps/api/place/autocomplete/json',
    _placesDetailsApiUrl = 'https://maps.googleapis.com/maps/api/place/details/json',
    _placesImagesApiUrl = 'https://maps.googleapis.com/maps/api/place/photo',
    _queryAutoCompleteApiUrl = 'https://maps.googleapis.com/maps/api/place/queryautocomplete/json';

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

exports.init = function(params){
  _googleServerApiKey = params.googleServerApiKey;
  _language = params.language || 'es';
  _radius = params.radius || '100000';
  _location = params.location || '20.651130,-103.426464';
  _errorCallback = params.errorCallback;
}

exports.search = function(text, types){
    var searchBy = capitalize(text).replace(new RegExp(" ", 'g'), "");
    var url = _placesApiUrl + "?input=" + searchBy + "&types=" + types + "&language="+ _language +"&radius="+ _radius +"&key=" + _googleServerApiKey

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

exports.queryAutoComplete = function(text, types){
    var searchBy = capitalize(text).replace(new RegExp(" ", 'g'), "");
    var url = _queryAutoCompleteApiUrl + "?input=" + searchBy + "&location="+ _location +"&types=" + types + "&language="+ _language +"&radius="+ _radius +"&key=" + _googleServerApiKey
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

exports.details = function(placeid){
    var url = _placesDetailsApiUrl + "?placeid=" + placeid + "&language="+ _language +"&key=" + _googleServerApiKey

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
