sap.ui.define([
	"sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/core/Fragment",
	"sap/m/DisplayListItem"
], function(Controller,
	JSONModel,
	MessageToast,
	MessageBox,
	Fragment,
	DisplayListItem) {
	"use strict";

	return Controller.extend("anubhav.app.controller.AddCustomer", {
        onInit: function(){
            this.oLocalData = new JSONModel();
            this.oLocalData.setData({
                "customerData": {
                    "name": "",
                    "type": "C",
                    "emailId": "test@gmail.com",
                    "contactNo": "111-222-3333",
                    "address": "Valley Rd.",
                    "companyName": "click4me",
                    "country": "US"
                }
            });
            this.getView().setModel(this.oLocalData, "local");
        },
        mode: "create",
        onClear: function(){
            this.oLocalData.setProperty("/cusomterData", {
                "name": "",
                "type": "C",
                "emailId": "test@gmail.com",
                "contactNo": "111-222-3333",
                "address": "Valley Rd.",
                "companyName": "click4me",
                "country": "US"
            });
            this.getView().byId("idSave").setText("Create");
            this.mode = "create";
        },
        // showValueHelp="true",
        // valueHelpRequest="onSupplierF4",
        customerPopup: null,
        onConfirmPopup: function(oEvent){
            //step 1: get the selected item by user
            var oSelectedItem = oEvent.getParameter("selectedItem");

            //step 2: get the value of selected data
            var sId = oSelectedItem.getLabel();
            var oDataModel = this.getView().getModel();
            var that = this;
            oDataModel.read("/customer('" + sId + "')", {
                success: function(data) {
                    //step 4: success callback -set data to local model
                    that.oLocalData.setProperty("/customerData", data);
                    that.getView().setBusy(false);
                    that.mode = "update";
                    that.getView().byId("idSave").setText("Update");
                },
                error: function(oErr){
                    //step 5: error callback - handle error
                    MessageBox.error(JSON.parse(oErr.responseText).error.innererror.errordetails[0].message.value);
                    that.getView().setBusy(false);
                    that.mode = "create";
                    that.getView().byId('idSave').setText('Save');
                }
            })

        },
        onSupplierF4: function(oEvent){
            var that = this;
            //just like we check lo_alv IS NOT BOUND
            if(this.customerPopup === null){
                Fragment.load({
                    id: "supplier",
                    name: "anubhav.app.fragments.F4Supplier",
                    controller: this
                }).then(function(oDialog){
                    that.customerPopup = oDialog;
                    that.customerPopup.setTitle("Select Supplier");
                    that.getView().addDependent(that.customerPopup);
                    that.customerPopup.setMultiSelect(false);
                    that.customerPopup.bindAggregation("items", {
                        path: '/customer',
                        template: new DisplayListItem({
                            label: '{id}',
                            value: '{name}'
                        })
                    });
                    that.customerPopup.open();
                });
            }else{
                this.customerPopup.open();
            }

        },
        onDelete: function(){
            MessageBox.confirm("Do you really want to delete the data?", {
                onClose: this._deleteProduct.bind(this)
            });
        },
        _deleteProduct: function(status){
            if(status==="OK"){
                var sId = this.oLocalData.getProperty("/customerData/id");
                //step 2: get the odata model object(default)
                var oDataModel = this.getView().getModel();
                var that = this;
                oDataModel.remove("/customer('" + sId + "')", {
                    success: function(){
                        MessageToast.show("Customer was deleted successfully");
                        that.onClear();
                    },
                    error: function(oErr){
                        MessageToast.show("Action was cancelled");
                        that.onClear();
                    }
                });
            }
        },
        onSave: function(){
            //step 1: prepare payload to send
            var payload = this.oLocalData.getProperty("/customerData");

            //step 2: get the odata model object(default)
            var oDataModel = this.getView().getModel();

            //step 3: fire a post request - .create
            if(this.mode === "update"){
                oDataModel.update("/customer('" + payload.id + "')", payload, {
                    success: function(){
                        MessageToast.show("Update was done");
                    },
                    error: function(oErr){
                        MessageBox.error(JSON.parse(oErr.responseText).error.innererror.errordetails[0].message.value);
                    }
                } )
            }else{
                oDataModel.create("/customer", payload, {
                    success: function(){
                        MessageToast.show("Data created");
                    },
                    error: function(oErr){
                        MessageBox.error(JSON.parse(oErr.responseText).error.innererror.errordetails[0].message.value);
                    }
                });
            }
        }
	});
});