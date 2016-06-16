sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function(Controller) {
	"use strict";

	return Controller.extend("com.sap.controller.Main", {

		onInit: function() {
			this._getBearerToken();
		},
		_getBearerToken: function() {
		
			var postUrl = "/token";
			var self = this;
		
	$.ajax({
    type: 'POST',
    url: postUrl,
    data: { 
       grant_type: "client_credentials",
        scope: "hybris.tenant=salesextension hybris.order_view_history hybris.order_read"
    },
    
    contentType:"application/x-www-form-urlencoded",
    success: function(data){
    	self._loadData(data.access_token);
    }
});	
},
_loadData: function(bearerToken) {
var oView = this.getView();
var getUrl = "/salesorders";
	oView.setBusy(true);
	var self = this;
	$.ajax({
    type: 'GET',
    url: getUrl,
     headers: {
       Authorization: "Bearer ".concat(bearerToken)
    },
    success: function(results){
    	oView.setBusy(false);
		self._mapResults(results);	
    }
});	
		},
		
		_mapResults: function(results) {
			var oModel = this.getView().getModel();
		var orders = [];
			for (var i = 0; i < results.length; i++) {
				var oTemp = results[i];
				orders.push({
					Id: oTemp.id,
					CustomerName: oTemp.shippingAddress.contactName,
					Status:oTemp.status,
					TotalPrice:oTemp.totalPrice,
					Currency :oTemp.currency
				});
			}

			oModel.setProperty("/items", orders);
			
		}
	});

});