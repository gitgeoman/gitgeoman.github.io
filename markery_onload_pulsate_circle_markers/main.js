$(document).ready(function () {


	//popup text
	function popupText(item,iterator){
		let dzisiaj = new Date();
		let text= 
			`<div id="tekst ${iterator}">
			<img src="https://robohash.org/${iterator}" alt="...">
				${dzisiaj.getFullYear()}-${dzisiaj.getMonth()}-${dzisiaj.getDate()}
				${dzisiaj.getHours()}:${dzisiaj.getMinutes()}:${dzisiaj.getSeconds()} <br/>
				<h4>${item.properties.description.name}</h4>
				${item.properties.description.specification}
			</div>`
		return text
	};

	//pętla do tworzenia listy ofert		
			geojsonFeature.features.forEach((item,iterator)=> {
				$('#oferty').append(
							`<div id="oferta ${iterator}" class="col">
									${popupText(item,iterator)}
								<button class="button">Czytaj więcej</button>
							</div>`
					);
			})
	
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

    //dodaje dane do okna mapy z pliku geojson
 	var myLayer = L.geoJSON(geojsonFeature, 
		{
			pointToLayer: function (feature, latlng){
				return L.circleMarker(latlng, feature.properties.symbol_circle)
				.bindPopup(
					`<h5>${geojsonFeature.features[7].properties.description.name}</h5>
						 ${geojsonFeature.features[7].properties.description.specification}`
				)
				.on('mouseover', function(){
					let a=this.feature.properties.id-1;
					//$(`.col[id^='oferta ${a}']`).css("background-color", "yellow");
					$(`.col[id^='oferta ${a}']`).addClass('pulse')
				})
				.on('mouseout', function(){
					let a=this.feature.properties.id-1;
					//$(`.col[id^='oferta ${a}']`).css("background-color", "#9D8D8F");
					$(`.col[id^='oferta ${a}']`).removeClass('pulse');
				});
			}
		})
 	.addTo(mymap);

	//pulsujące markery
 	 $( ".col[id^='oferta']")
 	 	.mouseover(function() {
			var str=Number(this.id[7]); //pokazuje 8 znak
			marker = L.geoJSON(geojsonFeature.features[str], {
				pointToLayer: function (feature, latlng) 
					{//wstawia marker w postaci okręgu
					 	return L.circleMarker(latlng, {
					 		color: 'red',
							fillColor: '#f03',
							fillOpacity: 0.5,
							radius: 10,
							className:'pulse'
							}
						);
			    	}
			}
			).addTo(mymap);
			    //treść popup
		var dzisiaj = new Date();
		marker
			.bindPopup(
				popupText(geojsonFeature.features[str],str))
			.openPopup();
		})
 	 	.mouseout(function(){
		 	marker.closePopup();
		 	mymap.removeLayer(marker) //usuwa ostatniego markera z mapy
		});



});