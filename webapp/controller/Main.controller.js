var orders=[];
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

			var postUrl = "https://api.yaas.io/hybris/oauth2/v1/token";
			var self = this;
			$.ajax({
				type: 'POST',
				url: postUrl,
				data: {
					grant_type: "password",
					scope: "hybris.tenant=salesextension hybris.customer_read hybris.customer_create hybris.customer_update",
					username: "shivakishore.anchuri@sap.com",
					password: "Iwork4yaas",
					client_id: "eQAufGCR4nKnaZjztN2A8d0lvwnmJveF"
				},
				contentType: "application/x-www-form-urlencoded",
				success: function(data) {
					self._loadData(data.access_token);
				}
			});
		},
		_loadData: function(bearerToken) {
			var oView = this.getView();
			var getUrl = "https://api.yaas.io/hybris/customer/v1/salesextension/customers";
			oView.setBusy(true);
			var self = this;
				var sTitle = self.getOwnerComponent().getModel("i18n").getResourceBundle().getText("mainTitleCount", [0]);
					this.getView().getModel().setProperty("/title",sTitle);
			$.ajax({
				type: 'GET',
				url: getUrl,
				headers: {
					Authorization: "Bearer ".concat(bearerToken)
				},
				success: function(results) {
					oView.setBusy(false);
					self._mapResults(results);
				}
			});
		},

		_mapResults: function(results) {
			var oModel = this.getView().getModel();
			//var orders = [];
			var self = this;
			for (var i = 0; i < results.length; i++) {
				var properties = [];
				var order = {};
				var oTemp = results[i];
				for (var property in oTemp) {
					if (oTemp.hasOwnProperty(property)) {
						properties.push(property);
					}
				}
				for (var j = 0; j < properties.length; j++) {
					var property_name = properties[j];
					Object.defineProperty(order, property_name, {
						value: oTemp[property_name]
					});
				}
				orders.push(order);
			}
			oModel.setProperty("/customers", orders);
			self._setTitle(results.length);
		},
		_setTitle: function(count)
		{
			var self = this;
				var oModel = this.getView().getModel();
				var sTitle = self.getOwnerComponent().getModel("i18n").getResourceBundle().getText("mainTitleCount", [count]);
					this.getView().getModel().setProperty("/title",sTitle.charAt(0).toUpperCase()+sTitle.substr(1));
		},
		capitalize : function() {
    return this.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
		},
		
		handleNavigation: function(evt)
		{
			var context = evt.getSource().getBindingContext();
			this.nav.to("Detail", context);
			
		},
			handleSearch: function(evt) {

			// create model filter
			var filters = [];
			var query = evt.getParameter("query");
			if (query && query.length > 0) {
				var model_search = [];
				for(var i=0;i<orders.length;i++)
				{
					if(orders[i].customerNumber.search(query) !== -1 )
					{
						model_search.push(orders[i]);
					}
				}
			/*	var filter = new sap.ui.model.Filter("id",
					sap.ui.model.FilterOperator.Contains, query);
				filters.push(filter);
*/
			this.getView().getModel().setProperty("/customers", model_search);
			}
			else{
				this.getView().getModel().setProperty("/customers", orders);
			}
			
			
			// update list binding
		/*	var list = this.getView().byId("__table0");
			var binding = list.getBinding("items");

			binding.filter(filters);*/
		}
	});

});