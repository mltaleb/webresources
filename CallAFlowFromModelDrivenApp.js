var CallFlow = window.CallFlow || {}
;(function () {
  var ID = "THE_ID"
  var currentUserName = Xrm.Utility.getGlobalContext().userSettings.userName
  var message =
    currentUserName +
    ": This application can run a flow without using dataverse connector!!"

  this.executeOnLoad = function (executionContext) {
    var formContext = executionContext.getFormContext()

    formContext.ui.setFormNotification(message, "INFO", ID)

    window.setTimeout(function () {
      formContext.ui.clearFormNotification(ID)
    }, 5000)
  }

  // this.attributeOnChange = function (executionContext) {
  //     var formContext = executionContext.getFormContext();

  //     // Automatically set some column values if the account name contains "Contoso"
  //     var accountName = formContext.getAttribute("name").getValue();
  //     if (accountName.toLowerCase().search("contoso") != -1) {
  //         formContext.getAttribute("websiteurl").setValue("https://www.contoso.com");
  //         formContext.getAttribute("telephone1").setValue("425-555-0100");
  //         formContext.getAttribute("description").setValue("Website URL, Phone and Description set using custom script.");
  //     }
  // }

  // Code to run in the form OnSave event
  this.executeOnSave = function (executionContext) {
    var formContext = executionContext.getFormContext()
    var email = formContext.getAttribute("cr1f5_email").getValue()
    var firstname = formContext.getAttribute("cr1f5_firstname").getValue()
    var lastname = formContext.getAttribute("cr1f5_lastname").getValue()
    var data = { lastname: lastname, firstname: firstname, addressemail: email }
    var confirmationInput = {
      pageType: "webresource",
      webresourceName: "mlt_HTML_FR_Confirmation",
    }
    var mycontactInput = {
      pageType: "entitylist",
      entityName: "mlt_callpowerplatform",
    }
    var navigationOptions = {
      target: 2,
      width: 500,
      height: 400,
      position: 1,
    }
    const xhttp = new XMLHttpRequest()
    var url =
      "https://prod-11.westeurope.logic.azure.com:443/workflows/9ca9afffe6524fdf82273478ff36cf60/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=V3fJyIV9SANDrpZDGuFm5wJ8W9i2-SJQ8b5xy1xpqvQ"
    xhttp.open("POST", url)
    xhttp.setRequestHeader("Content-type", "application/json")
    xhttp.onreadystatechange = function () {
      if (xhttp.readyState === 4) {
        if (xhttp.status === 200 || xhttp.status === 201) {
          Xrm.Navigation.navigateTo(confirmationInput, navigationOptions).then(
            function success() {
              Xrm.Navigation.navigateTo(mycontactInput).then(
                function success() {
                  return
                },
                function error() {
                  return
                }
              )
            },
            function error() {
              return
            }
          )
        } else {
          return
        }
      }
    }
    xhttp.send(JSON.stringify(data))
  }
}).call(CallFlow)
