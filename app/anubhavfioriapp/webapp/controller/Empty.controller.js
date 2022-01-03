sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function(Controller, JSONModel) {
	"use strict";

	return Controller.extend("anubhav.app.controller.Empty", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf anubhav.app.view.Empty
		 */
		onInit: function() {
			this.oRouter = this.getOwnerComponent().getRouter();
			this.oRouter.getRoute('master').attachMatched(this.herculis, this);
			this.getView().setModel(new JSONModel({ 'data': [] }), "local");
		},
		herculis: function(oEvent){
			var that = this;
			this.getView().getModel().callFunction("/getCusomerByCountry", {
				method: 'POST',
				success: function(data){
					var oModel = that.getView().getModel("local");
					oModel.setProperty("/data", data.results)

					var oTable = that.getView().byId("countTable");
					oTable.setModel(oModel);

					var oViz = that.getView().byId("idVizFrame1");
					oViz.setModel(oModel);

					var oPie = that.getView().byId("idVizFrame2");
					oPie.setModel(oModel);
							// oTable.bindRows({
							// 	path: "/tageventlist/tagevent",
							// })
				}
			})
		},

		onSearch: function(oEvent){

		}
		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf anubhav.app.view.Empty
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf anubhav.app.view.Empty
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf anubhav.app.view.Empty
		 */
		//	onExit: function() {
		//
		//	}

	});

});