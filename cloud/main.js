// Parse.Cloud.beforeSave("Groceries", function(request, response) {
//    var Groceries = Parse.Object.extend("Groceries");
//    var query = new Parse.Query(Groceries);
//    var entryName = request.object.get("Name");;
//    query.equalTo("Name", entryName);
//    query.count({ useMasterKey: true }).then(function(count) {
//        if(count > 0) {
//            response.error("Exist object");
//        } else {
//            response.success();
//        }
//    });
// });

Parse.Cloud.beforeSave(Parse.User, req=>{
  // Stop registration completely.
  // if(!req.original && !req.master){
  //  if(req.object.get('username') || req.object.get('email')){
  //    throw 'Sign Up disabled.'
  //  }
  //}
  
  // only specific domain
  var rx = /^([\w\.]+)@([\w\.]+)$/;
  var email=req.object.get('email');
  var match = rx.exec(email);
  if(match[2].toLowerCase() != 'mydomain.com'){
    throw 'mydomain staffs only.'
  }
});