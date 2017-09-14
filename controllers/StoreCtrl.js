angular.module('SMSApp')
  .controller('storeCtrl', function ($scope,$rootScope,$modal,ServerCall,AdminService) {
 var userRole=sessionStorage.getItem("role");
    var userName=sessionStorage.getItem('uid');
    if(userName == undefined)
        return;
    if(userRole != undefined){
         $rootScope.$emit('menuReset',userRole);
    }
   // $scope.tab = 1;
   //$scope.isVendor=true;
  $scope.isDefault=true;
 /* Default tabs visible */
  var setDefault=function()
  {
    $scope.isVendor=false;
    $scope.isCategory=false;
    $scope.isInventory=false;
    $scope.isStockPricing=false;
    $scope.isStock=false;
    $scope.isPayment=false;
    $scope.isReports=false;
  }
   $rootScope.$on('storeMenu',function(eve,data){
  $scope.setTab(data);
  angular.element($('#store li')).removeClass('selTab');
  angular.element($('#store li')[data-1]).addClass('selTab');
  });
   
  /* Tab click function */
  $scope.setTab = function(newTab){
      $scope.tab = newTab;
      $scope.isDefault=false;
      setDefault();
      switch(newTab){   
         case 1:
        $scope.isVendor=true;
        $scope.getVendorList();
        break;
         case 2:
        $scope.isCategory=true;
        $scope.getCategoryList();
        break;
         case 3:
        $scope.isInventory=true;
        $scope.getInventoryList();
        break;
         case 4:
        $scope.isStockPricing=true;
        $scope.getStockPricingList();
         $scope.getCategoryList();
        break;
         case 5:
        $scope.isStock=true;
        $scope.getStockList();
        break;
        case 6:
        $scope.isPayment=true;
        $scope.getPaymentList();
        break;
        case 7:
        $scope.isReports=true;
        $scope.getReportsList();
        break;
      }   
    };
    /* Tab active and inactive color function */
    $scope.isSet = function(tabNum){
      return $scope.tab === tabNum;
    };
  //Vendor start 

  /* Vendor list start */
    var VendorSuccCB=function(res){
      if(res.data)
      $scope.vendorList=res.data;
      else
      $scope.vendorList=[];
    }
    var VendorErrCB=function(res){
      debugger;
    }
    $scope.getVendorList=function(){
      var dataObj={
            'optId':0,
            'type':'vendor'
            }
      ServerCall.getData('php/store.php','POST',dataObj,VendorSuccCB,VendorErrCB)
    };
   
   /* Default Load*/
      if($scope.tab==1)
        $scope.getVendorList();

    /* Add and Edid Vendor modal start */
    
    $scope.addVendor=function(data){
    $modal.open({
    templateUrl: 'views/store/vendorModal.html',
    controller: function($scope,$modalInstance,ServerCall,$location,$rootScope,$timeout){
        $scope.isSave=true; 
        if(data != undefined){
          $scope.isSave=false;
          $scope.CompanyName=data.companyName;
          $scope.CompanyPhone=data.companyPhone;
          $scope.CompanyEmail=data.companyEmail;
          $scope.Country=data.country;
          $timeout(function(){
          $scope.state=data.state;
          },1000);
          $scope.City=data.city;
          $scope.Name=data.name;
          $scope.Phone=data.phone;
          $scope.Address=data.address;
          $scope.BankName=data.bankName;
          $scope.BranchName=data.city;
          $scope.AccountNo=data.city;
          $scope.IFSCCode=data.ifscCode;
          }
           $scope.states=JSON.parse(sessionStorage.getItem('states'));
        $scope.fnVendorSelection=function(selDate){
          $scope.DateofSupply=selDate
        }
        $scope.close=function(){
          $modalInstance.close();
        }
        var sucCB=function(data){
          if(data.status=='success'){
            $modalInstance.close();
            $rootScope.$broadcast('vendor');
          }
          else{
              $scope.msg=data.message;
          }
        }
        var errCB=function(data){
          $scope.msg=data.message;

        }
        $scope.save=function(opt){
            var dataObj={
            'companyName':$scope.CompanyName,
             'companyPhone':$scope.CompanyPhone,
            'companyEmail':$scope.CompanyEmail,
            'country':$scope.Country,
            'state':$scope.state,
            'city':$scope.City,
            'name':$scope.Name,
            'phone':$scope.Phone,
            'address':$scope.Address,
            'bankName':$scope.BankName,
            'branchName':$scope.BranchName,
            'accountNo':$scope.AccountNo,
            'ifscCode':$scope.IFSCCode,
            'type':'vendor'
            }
            if(opt=='2'){
              dataObj.optId=2;
              dataObj.id=data.id;
            }
            else{
               dataObj.optId=1;  
            }
           ServerCall.getData('php/store.php','POST',dataObj,sucCB,errCB)
        }
    },
    size: 'lg',
    backdrop: 'static',
    keyboard: 'false'
    })
   }; 
    /* Add and Edit vendor modal end */

   /* Delete vendor start */
   $scope.deleteVendor=function(data){
            $modal.open({
    templateUrl: 'views/confirmationModal.html',
    controller: function($scope,$modalInstance,ServerCall,$location,$rootScope){
        $scope.close=function(){
          $modalInstance.close();
        }
        var sucCB=function(data){
          if(data.status=='success'){
            $modalInstance.close();
            $rootScope.$broadcast('vendor');
          }
          else{
    $scope.msg=data.message;

          }
        }
        var errCB=function(data){
     $scope.msg=data.message;

        }
        $scope.yes=function(){
          var dataObj={
            'type':'vendor',
            'optId':3,
            'id':data.id
            }
           ServerCall.getData('php/store.php','POST',dataObj,sucCB,errCB)
        }
    },
    size: 'sm',
    backdrop: 'static',
    keyboard: 'false',
    })
   }
   /* Delete vendor end */
   
    //Category start 

  /* Category list start */
    var CategorySuccCB=function(res){
      if(res.data)
      $scope.categoryList=res.data;
      else
      $scope.categoryList=[];
    }
    var CategoryErrCB=function(res){
      debugger;
    }
    $scope.getCategoryList=function(){
      var dataObj={
            'optId':4,
            'type':'category'
            }
      ServerCall.getData('php/store.php','POST',dataObj,CategorySuccCB,CategoryErrCB)
    };
   
    /* Add and Edid category modal start */
    
    $scope.addCategory=function(data){
    $modal.open({
    templateUrl: 'views/store/categoryModal.html',
    controller: function($scope,$modalInstance,ServerCall,$location,$rootScope){
        $scope.isSave=true;
         $scope.catList=[];
        $scope.noOfCat=1;
        $scope.cat={};
        
        
        
        
        
        $scope.vendorList=[];
        
         $scope.changeVendor=function(ven){
          var selCat=  $scope.allCat.filter(function(obj){
                return obj.vendors==ven;
                });

          $scope.catArr=selCat[0].categories.split(',');
         };
         
         
         
         
         
        
      
      /*category plus code start*/

          $scope.addCategoryTextBox=function(){
              $scope.noOfCat=$scope.noOfCat+1;
              var tempObj={
                'catName':'category'+($scope.noOfCat)
              }
              $scope.catList.push(tempObj);
             }
              $scope.deleteCategoryTextBox=function(data){
             if($scope.noOfCat!=1){
              var _tempcat={};
              var index=1;
              delete $scope.cat[data];
              $scope.noOfCat=$scope.noOfCat-1;
              angular.forEach($scope.cat,function(val,key){
                _tempcat['category'+index]=val;
                index++;
              });
              $scope.cat=_tempcat;
            }
             $scope.catList.pop();
           }
            
        if(data != undefined){
            var catArr=data.categories.split(',');
            $scope.noOfCat=catArr.length;
            for(var i=1;i<=catArr.length;i++){
              $scope.cat['category'+i]=catArr[i-1];
              $scope.catList.push({
                'catName':'category'+i
              });
            }
          $scope.catList.shift();
          $scope.isSave=false;
          $scope.Vendors=data.vendors;
      }

/*category plus code end*/

        $scope.close=function(){
          $modalInstance.close();
        }
        var sucCB=function(data){
          if(data.status=='success'){
            $modalInstance.close();
            $rootScope.$broadcast('category');
          }
          else{
   $scope.msg=data.message;
          }
        }
        var errCB=function(data){
        $scope.msg=data.message;

        }
        $scope.save=function(opt){
        var categoryStr='';
       
          angular.forEach($scope.cat,function(val,key){
          categoryStr=categoryStr+val+',';
           });
          categoryStr=categoryStr.substring(0,categoryStr.length-1);

          var dataObj={
            'vendors':$scope.Vendors,
            'categories':categoryStr,
            'type':'category'
           }
            if(opt=='6'){
              dataObj.optId=6;
              dataObj.id=data.id;
            }
            else
            {
                dataObj.optId=5;
            }
           ServerCall.getData('php/store.php','POST',dataObj,sucCB,errCB)
        /*$scope.save=function(opt){
            var dataObj={
            'vendors':$scope.Vendors,
            'category':$scope.Category,
            'type':'category'
            }
            if(opt=='1'){
              dataObj.optId=1;
              dataObj.id=data.id;
            }
           ServerCall.getData('Store','POST',dataObj,sucCB,errCB)*/
        }
      },
      size: 'md',
      backdrop: 'static',
      keyboard: 'false'
      })
     }; 
    /* Add and Edit category modal end */

   /* Delete category start */
   $scope.deleteCategory=function(data){
            $modal.open({
    templateUrl: 'views/confirmationModal.html',
    controller: function($scope,$modalInstance,ServerCall,$location,$rootScope){
        $scope.close=function(){
          $modalInstance.close();
        }
        var sucCB=function(data){
          if(data.status=='success'){
            $modalInstance.close();
            $rootScope.$broadcast('category');
          }
          else{
     $scope.msg=data.message;

          }
        }
        var errCB=function(data){
      $scope.msg=data.message;

        };
        $scope.yes=function(){
          var dataObj={
            'type':'category',
            'optId':7,
            'vendors':data.vendors,
            'id':data.id
            };
           ServerCall.getData('php/store.php','POST',dataObj,sucCB,errCB)
        };
    },
    size: 'sm',
    backdrop: 'static',
    keyboard: 'false',
    });
   };
   //category End

 //Inventory start 

  /* Inventory list start */
    var InventorySuccCB=function(res){
      if(res.data)
      $scope.inventoryList=res.data;
      else
      $scope.inventoryList=[];
    }
    var InventoryErrCB=function(res){
      debugger;
    }
    $scope.getInventoryList=function(){
      var dataObj={
            'optId':8,
            'type':'inventory'
            }
      ServerCall.getData('php/store.php','POST',dataObj,InventorySuccCB,InventoryErrCB)
    };
   
    /* Add and Edid inventory modal start */
    
    $scope.addInventory=function(data){
    $modal.open({
    templateUrl: 'views/store/inventoryModal.html',
    controller: function($scope,$modalInstance,ServerCall,$location,$rootScope){
        $scope.isSave=true;
        $scope.invList=[];
        $scope.noOfInv=1;
        $scope.inv={};

/* drop down for vendor and category start*/

        $scope.vendorList=[];
         $scope.categoryList=[];
         $scope.changeVendor=function(ven){
          var selCat=  $scope.allCat.filter(function(obj){
                return obj.vendors==ven;
                });

          $scope.catArr=selCat[0].categories.split(',');
         }

         var CategorySuccCB=function(res){
            if(res.data){
               $scope.vendorList=res.data;
              //$scope.catArr=res.data;
              $scope.allCat=res.data;
            }
          }
          var CategoryErrCB=function(res){
            debugger;
          }
          $scope.getCategoryList=function(){
            var dataObj={
                  'optId':4,
                  'type':'category'
                  }
            ServerCall.getData('php/store.php','POST',dataObj,CategorySuccCB,CategoryErrCB)
          };
          $scope.getCategoryList();

/* drop down for vendor and category end*/
   

      /*inventory plus code start*/

        $scope.addInventoryTextBox=function(){
        $scope.noOfInv=$scope.noOfInv+1;
        var tempObj={
          'invName':'Inventory Item'+($scope.noOfInv)
        }
        $scope.invList.push(tempObj);
        }
        $scope.deleteInventoryTextBox=function(data){
        if($scope.noOfInv!=1){
        var _tempinv={};
        var index=1;
        delete $scope.inv[data];
        $scope.noOfInv=$scope.noOfInv-1;
        angular.forEach($scope.inv,function(val,key){
          _tempinv['Inventory Item'+index]=val;
          index++;
        });
        $scope.inv=_tempinv;
        }
        $scope.invList.pop();
        }
        if(data != undefined){
           var invArr=data.inventories.split(',');
           $scope.noOfInv=invArr.length;
            for(var j=1;j<=invArr.length;j++){
              $scope.inv['Inventory Item'+j]=invArr[j-1];
              $scope.invList.push({
                'invName':'Inventory Item'+j
              });
            }
         // $scope.catList.shift();
          $scope.invList.shift();
          $scope.isSave=false;
          $scope.Vendors=data.vendors;
          $scope.categoryName=data.categories;
}
/*inventory plus code end*/

        $scope.close=function(){
          $modalInstance.close();
        }
        var sucCB=function(data){
          if(data.status=='success'){
            $modalInstance.close();
            $rootScope.$broadcast('inventory');
          }
          else{
              $scope.msg=data.message;
          }
        }
        var errCB=function(data){
         $scope.msg=data.message;

        }
        $scope.save=function(opt){
        var inventoryStr='';
           angular.forEach($scope.inv,function(val,key){
             inventoryStr=inventoryStr+val+',';
            });
           inventoryStr=inventoryStr.substring(0,inventoryStr.length-1);
          var dataObj={
            'vendors':$scope.Vendors,
            'categories':$scope.categoryName,
            'inventories':inventoryStr,
            'type':'inventory'
           }
            if(opt=='10'){
              dataObj.optId=10;
              dataObj.id=data.id;
            }
            else{
                 dataObj.optId=9;
            }
           ServerCall.getData('php/store.php','POST',dataObj,sucCB,errCB)
        /*$scope.save=function(opt){
            var dataObj={
            'vendors':$scope.Vendors,
            'category':$scope.Category,
            'type':'category'
            }
            if(opt=='1'){
              dataObj.optId=1;
              dataObj.id=data.id;
            }
           ServerCall.getData('Store','POST',dataObj,sucCB,errCB)*/
        }
    },
    size: 'md',
    backdrop: 'static',
    keyboard: 'false'
    })
   }; 
    /* Add and Edit inventory modal end */

   /* Delete inventory start */
   $scope.deleteInventory=function(data){
    $modal.open({
    templateUrl: 'views/confirmationModal.html',
    controller: function($scope,$modalInstance,ServerCall,$location,$rootScope){
        $scope.close=function(){
          $modalInstance.close();
        }
        var sucCB=function(data){
          if(data.status=='success'){
            $modalInstance.close();
            $rootScope.$broadcast('inventory');
          }
          else{
      $scope.msg=data.message;

          }
        }
        var errCB=function(data){
      $scope.msg=data.message;

        }
        $scope.yes=function(){
          var dataObj={
            'type':'inventory',
            'optId':11,
            'vendors':data.vendors,
            'id':data.id
            }
           ServerCall.getData('php/store.php','POST',dataObj,sucCB,errCB)
        }
    },
    size: 'sm',
    backdrop: 'static',
    keyboard: 'false',
    })
   }
   //inventory End

     //StockPricing start 

  /* StockPricing list start */
    var StockPricingSuccCB=function(res){
      if(res.data)
      $scope.stockPricingList=res.data;
      else
      $scope.stockPricingList=[];
    }
    var StockPricingErrCB=function(res){
      debugger;
    }
    $scope.getStockPricingList=function(){
      var dataObj={
            'optId':12,
            'type':'stockPricing'
            }
      ServerCall.getData('php/store.php','POST',dataObj,StockPricingSuccCB,StockPricingErrCB)
    };
   
   
    /* Add and Edid stockPricing modal start */
    
    $scope.addStockPricing=function(data){
    $modal.open({
    templateUrl: 'views/store/stockPricingModal.html',
    controller: function($timeout,$scope,$modalInstance,ServerCall,$location,$rootScope,$timeout){
        $scope.isSave=true;
        $scope.invList=[];
        $scope.noOfInv=1;
        $scope.inv={};
       /* drop down for vendor and category start*/

        $scope.vendorList=[];
         $scope.categoryList=[];
         $scope.changeVendor=function(ven){
          var selCat=  $scope.allCat.filter(function(obj){
                return obj.vendors==ven;
                });
          $scope.catArr=selCat[0].categories.split(',');
         }
         var CategorySuccCB=function(res){
            if(res.data){
               
              $scope.vendorList=res.data;
              //$scope.catArr=res.data;
              $scope.allCat=res.data;
            }
          }
          var CategoryErrCB=function(res){
            debugger;
          }
          $scope.getCategoryList=function(){
            var dataObj={
                  'optId':4,
                  'type':'category'
                  }
            ServerCall.getData('php/store.php','POST',dataObj,CategorySuccCB,CategoryErrCB)
          };
          $scope.getCategoryList();

  /* drop down for vendor and category end*/

   /* drop down for inventory start*/

         $scope.inventoryList=[];
         $scope.changeCategory=function(cat){
          var selInv= $scope.allInv.filter(function(obj){
              return obj.categories==cat
                
                });
          $scope.invArr=selInv[0].inventories.split(',');
         }
          var InventorySuccCB=function(res){
            if(res.data){
              //$scope.invArr=res.data;
              $scope.allInv=res.data;
            }
          }
          var InventoryErrCB=function(res){
            debugger;
          }
          $scope.getInventoryList=function(){
            var dataObj={
                  'optId':8,
                  'type':'inventory'
                  }
            ServerCall.getData('php/store.php','POST',dataObj,InventorySuccCB,InventoryErrCB)
          };
          $scope.getInventoryList();

   /* drop down for inventory start*/

          if(data != undefined){
          $scope.isSave=false;
          /*$scope.vendorObj={
          'vendors':data.vendors,
          'categoryName':data.categoryName,
          }*/
           $timeout(function(){
          $scope.vendors=data.vendors;
          $scope.categoryName=data.categoryName;
          $scope.InventoryItem=data.inventoryItem;
          },100); 
          $scope.Quantity=data.quantity;
          $scope.ReorderLevel=data.reorderLevel;
          $scope.Free=data.free;
          $scope.Discount=data.discount;
          $scope.Mrp=data.mrp;
          $scope.Rate=data.rate;
          $scope.Amount=data.amount;
          $scope.TotAmount=data.totAmount;
          $scope.Date=data.date;
          }

          $scope.fnStockPricingSelection=function(selDate){
          $scope.Date=selDate
        }
 
          $scope.Amont = function() {
          if($scope.Rate == undefined || $scope.Discount == undefined)
          return;
          var rate=$scope.Rate;
          var discount=$scope.Discount;
          $scope.Amount=Math.round($scope.Rate-($scope.Rate/$scope.Discount));
          }
         
          $scope.TotAmont = function() {
          if($scope.Quantity == undefined || $scope.Amount == undefined)
          return;
          var quantity=$scope.Quantity;
          var amount=$scope.Amount;
          $scope.TotAmount=Math.round($scope.Quantity*$scope.Amount);
          }
         

        $scope.close=function(){
          $modalInstance.close();
        }
        var sucCB=function(data){
          if(data.status=='success'){
            $modalInstance.close();
            $rootScope.$broadcast('stockPricing');
          }
          else{
       $scope.msg=data.message;

          }
        }
        var errCB=function(data){
      $scope.msg=data.message;

        }
        
        $scope.save=function(opt){
            var dataObj={
           /* 'vendors':$scope.vendorObj.vendors,
            'categoryName':$scope.vendorObj.categoryName,*/
            'vendors':$scope.Vendors,
            'categoryName':$scope.categoryName,
            'inventoryItem':$scope.InventoryItem,
            'quantity':$scope.Quantity,
            'reorderLevel':$scope.ReorderLevel,
            'free':$scope.Free,
            'discount':$scope.Discount,
            'mrp':$scope.Mrp,
            'rate':$scope.Rate,
            'amount':$scope.Amount,
            'totAmount':$scope.TotAmount,
            'date':$scope.Date,
            'type':'stockPricing'
            }
            if(opt=='14'){
              dataObj.optId=14;
              dataObj.id=data.id;
            }
            else{
                dataObj.optId=13;
            }
           ServerCall.getData('php/store.php','POST',dataObj,sucCB,errCB)
        }
    },
    size: 'lg',
    backdrop: 'static',
    keyboard: false,
     
    })
   }; 
    /* Add and Edit stockPricing modal end */

   /* Delete stockPricing start */
   $scope.deleteStockPricing=function(data){
            $modal.open({
    templateUrl: 'views/confirmationModal.html',
    controller: function($scope,$modalInstance,ServerCall,$location,$rootScope){
        $scope.close=function(){
          $modalInstance.close();
        }
        var sucCB=function(data){
          if(data.status=='success'){
            $modalInstance.close();
            $rootScope.$broadcast('stockPricing');
          }
          else{
       $scope.msg=data.message;

          }
        }
        var errCB=function(data){
      $scope.msg=data.message;

        }
        $scope.yes=function(){
          var dataObj={
            'type':'stockPricing',
            'optId':15,
            'id':data.id
            }
           ServerCall.getData('php/store.php','POST',dataObj,sucCB,errCB)
        }
    },
    size: 'sm',
    backdrop: 'static',
    keyboard: 'false',
    })
   }

    //stock start 

  /* stock list start */
    var StockSuccCB=function(res){
      if(res.data)
      $scope.stockList=res.data;
      else
      $scope.stockList=[];
    }
    var StockErrCB=function(res){
      debugger;
    }
    $scope.getStockList=function(){
      var dataObj={
            'optId':16,
            'type':'stock'
            }
      ServerCall.getData('php/store.php','POST',dataObj,StockSuccCB,StockErrCB)
    };
   
    /* Add and Edid stock modal start */
    
    $scope.addStock=function(data){
    $modal.open({
    templateUrl: 'views/store/stockModal.html',
    controller: function($scope,$modalInstance,ServerCall,$location,$rootScope,$timeout){
        $scope.isSave=true;
        
       
       /* drop down for vendor and category start*/

       $scope.vendorList=[];
         $scope.categoryList=[];
         $scope.changeVendor=function(ven){
          var selCat=  $scope.allCat.filter(function(obj){
                return obj.vendors==ven;
                });
          $scope.catArr=selCat[0].categories.split(',');
         }
        var CategorySuccCB=function(res){
            if(res.data){
               $scope.vendorList=res.data;
              //$scope.catArr=res.data;
              $scope.allCat=res.data;
            }
          }
          var CategoryErrCB=function(res){
            debugger;
          }
          $scope.getCategoryList=function(){
            var dataObj={
                  'optId':16,
                  'type':'category'
                  }
            ServerCall.getData('php/store.php','POST',dataObj,CategorySuccCB,CategoryErrCB)
          };
         
            $scope.getCategoryList();
  /* drop down for vendor and category end*/

   /* drop down for inventory start*/
          $scope.inventoryList=[];
          $scope.changeCategory=function(cat){
          var selInv= $scope.allInv.filter(function(obj){
              return obj.categories==cat
              
                });
          $scope.invArr=selInv[0].inventories.split(',');
         }
          var InventorySuccCB=function(res){
            if(res.data){
              //$scope.invArr=res.data;
              $scope.allInv=res.data;
            }
          }
          var InventoryErrCB=function(res){
            debugger;
          }
          $scope.getInventoryList=function(){
            var dataObj={
                  'optId':8,
                  'type':'inventory'
                  }
            ServerCall.getData('php/store.php','POST',dataObj,InventorySuccCB,InventoryErrCB)
          };
          $scope.getInventoryList();

   /* drop down for inventory start*/

        if(data != undefined){
          $scope.isSave=false;

          $scope.UserType=data.userType;
           $timeout(function(){
          $scope.StudentName=data.studentName;
          $scope.Vendors=data.vendor;
          $scope.Category=data.category;
          },100);
          $scope.InventItem=data.inventItem;
          $scope.AvailableStock=data.availableStock;
          $scope.IssuedStock=data.issuedStock;
          $scope.RemainingStock=data.remainingStock;
          $scope.Amount=data.amount;
          $scope.Date=data.date;
          }

           $scope.fnStockSelection=function(selDate){
           $scope.Date=selDate
           }

          $scope.Remaining = function() {
          if($scope.AvailableStock == undefined || $scope.IssuedStock == undefined)
          return;
          var availableStock=$scope.AvailableStock;
          var issuedStock=$scope.IssuedStock;
          $scope.RemainingStock=Math.floor($scope.AvailableStock - $scope.IssuedStock);
          }

        $scope.close=function(){
          $modalInstance.close();
        }
        var sucCB=function(data){
          if(data.status=='success'){
            $modalInstance.close();
            $rootScope.$broadcast('stock');
          }
          else{
        $scope.msg=data.message;

          }
        }
        var errCB=function(data){
        $scope.msg=data.message;

        }
       
        $scope.save=function(opt){
            var dataObj={
            'userType':$scope.UserType,
            'studentName':$scope.StudentName,
            'vendor':$scope.Vendors,
            'category':$scope.Category,
            'inventItem':$scope.InventItem,
            'availableStock':$scope.AvailableStock,
            'issuedStock':$scope.IssuedStock,
            'remainingStock':$scope.RemainingStock,
            'amount':$scope.Amount,
            'date':$scope.Date,
            'type':'stock'
            }
          
          

            if(opt=='18'){
              dataObj.optId=18;
              dataObj.id=data.id;
            }
            else{
                dataObj.optId=17;
            }
           ServerCall.getData('php/store.php','POST',dataObj,sucCB,errCB)
        }
    },
    size: 'lg',
    backdrop: 'static',
    keyboard: 'false',
   
    })
   }; 
    /* Add and Edit stock modal end */

   /* Delete stock start */
   $scope.deleteStock=function(data){
            $modal.open({
    templateUrl: 'views/confirmationModal.html',
    controller: function($scope,$modalInstance,ServerCall,$location,$rootScope){
        $scope.close=function(){
          $modalInstance.close();
        }
        var sucCB=function(data){
          if(data.status=='success'){
            $modalInstance.close();
            $rootScope.$broadcast('stock');
          }
          else{
     $scope.msg=data.message;

          }
        }
        var errCB=function(data){
     $scope.msg=data.message;

        }
        $scope.yes=function(){
          var dataObj={
            'type':'stock',
            'optId':19,
            'id':data.id
            }
           ServerCall.getData('php/store.php','POST',dataObj,sucCB,errCB)
        }
    },
    size: 'sm',
    backdrop: 'static',
    keyboard: 'false',
    })
   }
   /* Delete stock end */
   // stock end


   //payment start 

  /* payment list start */
    var PaymentSuccCB=function(res){
      if(res.data)
      $scope.paymentList=res.data;
      else
      $scope.paymentList=[];
    }
    var PaymentErrCB=function(res){
      debugger;
    }
    $scope.getPaymentList=function(){
      var dataObj={
            'optId':20,
            'type':'payment'
            }
      ServerCall.getData('php/store.php','POST',dataObj,PaymentSuccCB,PaymentErrCB)
    };
   


    /* Add and Edid payment modal start */
  
    $scope.addPayment=function(data){
    $modal.open({
    templateUrl: 'views/store/paymentModal.html',
    controller: function($scope,$modalInstance,ServerCall,$location,$rootScope,$timeout){
        $scope.isSave=true;


       /* drop down for vendor and category start*/

        $scope.vendorList=[];
         $scope.categoryList=[];
         $scope.changeVendor=function(ven){
          var selCat=  $scope.allCat.filter(function(obj){
                return obj.vendors==ven;
                });
          $scope.catArr=selCat[0].categories.split(',');
         }
        var CategorySuccCB=function(res){
            if(res.data){
               $scope.vendorList=res.data;
              //$scope.catArr=res.data;
              $scope.allCat=res.data;
            }
          }
          var CategoryErrCB=function(res){
            debugger;
          }
          $scope.getCategoryList=function(){
            var dataObj={
                  'optId':4,
                  'type':'category'
                  }
            ServerCall.getData('php/store.php','POST',dataObj,CategorySuccCB,CategoryErrCB)
          };
          $scope.getCategoryList();

  /* drop down for vendor and category end*/

   /* drop down for inventory start*/
         $scope.inventoryList=[];
          $scope.changeCategory=function(cat){
          var selInv= $scope.allInv.filter(function(obj){
              return obj.categories==cat
              
                });
          $scope.invArr=selInv[0].inventories.split(',');
         }
          var InventorySuccCB=function(res){
            if(res.data){
              //$scope.invArr=res.data;
              $scope.allInv=res.data;
            }
          }
          var InventoryErrCB=function(res){
            debugger;
          }
          $scope.getInventoryList=function(){
            var dataObj={
                  'optId':8,
                  'type':'inventory'
                  }
            ServerCall.getData('php/store.php','POST',dataObj,InventorySuccCB,InventoryErrCB)
          };
          $scope.getInventoryList();

   /* drop down for inventory start*/
       
        if(data != undefined){
          $scope.isSave=false;
          $scope.CompanyName=data.companyName;
          $scope.Category=data.category;
         $timeout(function(){
          $scope.state=data.state;
          },100)
          $scope.InvItem=data.invItem;
          $scope.City=data.city;
          $scope.ContactPerson=data.contactPerson;
          $scope.Phone=data.phone;
          $scope.TotAmount=data.totAmount;
          $scope.AmountPaid=data.amountPaid;
          $scope.PayDate=data.payDate;
          $scope.Balence=data.balence;
          $scope.Voucher=data.voucher;

          }

        $scope.states=JSON.parse(sessionStorage.getItem('states'));

      
        $scope.fnPaymentSelection=function(selDate){
          $scope.PayDate=selDate;
        }
        $scope.close=function(){
          $modalInstance.close();
        }
        var sucCB=function(data){
          if(data.status=='success'){
            $modalInstance.close();
            $rootScope.$broadcast('payment');
          }
          else{
          $scope.msg=data.message;
          }
        }
        var errCB=function(data){
              $scope.msg=data.message;
        }
        $scope.save=function(opt){
            var dataObj={
            'companyName':$scope.CompanyName,
            'category':$scope.Category,
            'invItem':$scope.InvItem,
            'state':$scope.state,
            'city':$scope.City,
            'contactPerson':$scope.ContactPerson,
            'phone':$scope.Phone,
            'totAmount':$scope.TotAmount,
            'amountPaid':$scope.AmountPaid,
            'payDate':$scope.PayDate,
            'balence':$scope.Balence,
            'voucher':$scope.Voucher,
            'type':'payment'
            }
            if(opt=='22'){
              dataObj.optId=22;
              dataObj.id=data.id;
            }
            else{
               dataObj.optId=21; 
            }
           ServerCall.getData('php/store.php','POST',dataObj,sucCB,errCB)
        }
    },
    size: 'lg',
    backdrop: 'static',
    keyboard: 'false',
    })
   }; 
    /* Add and Edit payment modal end */

   /* Delete payment start */
   $scope.deletePayment=function(data){
            $modal.open({
    templateUrl: 'views/confirmationModal.html',
    controller: function($scope,$modalInstance,ServerCall,$location,$rootScope){
        $scope.close=function(){
          $modalInstance.close();
        }
        var sucCB=function(data){
          if(data.status=='success'){
            $modalInstance.close();
            $rootScope.$broadcast('payment');
          }
          else{
      $scope.msg=data.message;
          }
        }
        var errCB=function(data){
    $scope.msg=data.message;

        }
        $scope.yes=function(){
          var dataObj={
            'type':'payment',
            'optId':23,
            'id':data.id
            }
           ServerCall.getData('php/store.php','POST',dataObj,sucCB,errCB)
        }
    },
    size: 'sm',
    backdrop: 'static',
    keyboard: 'false',
    })
   }
   /* Delete payment end */
   // payment end






 //reports start 

  /* reports list start */
    var ReportsSuccCB=function(res){
      if(res.data)
      $scope.reportsList=res.data;
      else
      $scope.reportsList=[];
    }
    var ReportsErrCB=function(res){
      debugger;
    }
    $scope.getReportsList=function(){
      var dataObj={
            'optId':3,
            'type':'stock'
            }
      ServerCall.getData('Store','POST',dataObj,StockSuccCB,StockErrCB)
    };
   


   



   
 $rootScope.$on('vendor',function(){
      $scope.getVendorList();
    });
   

 $rootScope.$on('stock',function(){
      $scope.getStockList();
    });

   
 $rootScope.$on('stockPricing',function(){
      $scope.getStockPricingList();
    });

 $rootScope.$on('category',function(){
      $scope.getCategoryList();
    });

 $rootScope.$on('inventory',function(){
      $scope.getInventoryList();
    });

 $rootScope.$on('payment',function(){
      $scope.getPaymentList();
    });



     /* Date selection call back*/
        $scope.fnDateOfSupplySelection=function(selDate){
          $scope.dateofSupply=selDate;
        }

        $scope.fnPayDateSelection=function(selDate){
          $scope.payDate=selDate;
        }

        $scope.fnDateSelection=function(selDate){
          $scope.date=selDate;
        }
  });         
