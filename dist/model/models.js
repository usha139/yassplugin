sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device"
], function(JSONModel, Device) {
	"use strict";

	return {

		createDeviceModel: function() {
			var oModel = new JSONModel(Device);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},
		createAPIModel: function() {
		var oModel = new JSONModel();
			oModel.setData({
				cols: [{
					name: "Id"
				}, {
					name: "CustomerName"
				}, {
					name: "Status"
				},
         		{
					name: "TotalPrice"
				}, {
					name: "Currency"
				}],
				items: []
			});
			return oModel;			
		}

	};
});