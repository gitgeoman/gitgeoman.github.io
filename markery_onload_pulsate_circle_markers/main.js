$(document).ready(function () {
	//pętla do tworzenia listy ofert				
	for (var licznik in geojsonFeature.features){
		$('#oferty')
		.append('<div id="oferta '+licznik+'" class="col">'
						+'<img src='
							+geojsonFeature.features[licznik].properties.miniaturka+' alt="...">'
						+'<div id="tekst '+licznik+'">'
							+geojsonFeature.features[licznik].properties.description
						+'</div>'
				+'</div>'
		)
	};				
  //wczytywanie mapy

    //deklaracja map podkładowych
    var lyrOSM = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png'),
        lyrORTO = L.tileLayer.wms("http://mapy.geoportal.gov.pl/wss/service/img/guest/ORTO/MapServer/WMSServer", {layers: "Raster", format: 'image/png', transparent : 'true', version : '1.1.1'}),    
        lyrSozo = L.tileLayer.wms("http://mapy.geoportal.gov.pl/wss/service/img/guest/SOZO/MapServer/WMSServer", {layers: "Raster", format: 'image/png', transparent : 'true', version : '1.1.1'}),
        
        // przypisuję do zmiennej mymap obiekt mapa z klasy map
        mymap = L.map('mymap', {center: [52.3289, 21.0], zoom: 10, zoomControl: false, attributionControl: false});

    mymap.addLayer(lyrOSM);
        
    var baseMaps = {
        "Openstreetmap": lyrOSM,
        "Ortofotomapa": lyrORTO,
        "Mapa Sozologiczna": lyrSozo        
      };
    
    //polecenie dodania ikonki do wyboru danych
    L.control.layers(baseMaps).addTo(mymap);

    //dodaje skale
    L.control.scale({position:'bottomright', imperial:false, maxWidth:200}).addTo(mymap);
    
 	var myLayer = L.geoJSON(geojsonFeature, 
		{
			pointToLayer: function (feature, latlng){
				return L.circleMarker(latlng, feature.properties.symbol_circle);

			}
		}
		).addTo(mymap);

	//pulsujące markery
 	 $( ".col[id^='oferta']" ).mouseover(function() {
    		var str=parseInt(this.id[7]);
    		marker = L.geoJSON(geojsonFeature.features[str], {
		 		pointToLayer: function (feature, latlng) 
		 		{
		 			//wstawia marker w postaci okręgu
		 			return L.circleMarker(latlng, {
							    color: 'red',
							    fillColor: '#f03',
							    fillOpacity: 0.5,
							    radius: 10,
							    className:'pulse'
					});
    			}
    		}
    		).addTo(mymap);
    //treść popup
    		var dzisiaj = new Date();
		 	marker.bindPopup(dzisiaj.getFullYear()
		 						+ "." +dzisiaj.getMonth()
		 						+ "." + dzisiaj.getDate() 
		 						+ " - " + dzisiaj.getHours() 
		 						+ ":" + dzisiaj.getMinutes() 
		 						+ ":" + dzisiaj.getSeconds()+"<br>"
		 						+geojsonFeature.features[str].properties.description+", <br>").openPopup();
		 			});
    $( ".col[id^='oferta']" ).mouseout(function() {
		 	
		 	marker.closePopup();
		 	mymap.removeLayer(marker)
		});
});