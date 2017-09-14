<?php
header('Access-Control-Allow-Origin: *');  
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Content-Range, Content-Disposition, Content-Description');

  $postdata = file_get_contents("php://input");
   $data = json_decode($postdata);
// include database and object files 
 include_once '../database/database.php'; 
// Create connection
$db=new DB();
$conn =$db->getConnection();

$option=$data->optId;
function authCheck(){
     session_start();
   $cURole=$_SESSION["role"];
   if($cURole !='Admin')
       return false;
   else
       return true;
   
}
switch ($option){
case 0:
    $query="select * from vendor";
   $records=$conn->query($query);
       $rows=$records->num_rows;
       if($rows>0)
       {
           $res='';
           $x=1;
          while($row=$records->fetch_assoc())
          {
             $res .='{';
             $res .= '"phone":"'    . $row["Phone"] . '",';
             $res .='"companyEmail":"'     .$row["CompanyEmail"].'",';
             $res .='"companyPhone":"'  .$row["CompanyPhone"].'",' ;
             $res .='"state":"'  .$row["State"].'",' ;
             $res .= '"accountNo":"'    . $row["AccountNo"] . '",';
             $res .='"bankName":"'     .$row["BankName"].'",';
             $res .='"ifscCode":"'  .$row["IFSCCode"].'",' ;
             $res .='"companyName":"'  .$row["CompanyName"].'",' ;
             $res .= '"country":"'    . $row["Country"] . '",';
             $res .='"city":"'     .$row["City"].'",';
             $res .= '"id":"'    . $row["id"] . '",';
             $res .='"address":"'     .$row["Address"].'",';
             $res .='"name":"'     .$row["Name"].'",';
             $res .='"branchName":"'  .$row["BranchName"].'"' ;
              
             $res .= '}';
             $res.= $x< $rows ? ',':'' ;
                $x++;
          }
          $response='{';
          $response .= '"status":"success",';
          $response .='"data":['.$res.']';
          $response .= '}';
          echo $response;
}
break;

case 1:
    $query="insert into vendor(CompanyName,CompanyPhone,CompanyEmail,Country,State,City,Name,Phone,Address,BankName,BranchName,AccountNo,IFSCCode) values('".$data->companyName."','".$data->companyPhone."','".$data->companyEmail."','".$data->country."','".$data->state."','".$data->city."','".$data->name."','".$data->phone."','".$data->address."','".$data->bankName."','".$data->branchName."','".$data->accountNo."','".$data->ifscCode."')";

 $records=$conn->query($query);

   $response='{';
   if($records>0){
          $response .= '"message":"Inserted Successfully",';
   $response .= '"status":"success"';}
 else {
    $response .= '"message":"Not Inserted",';
            $response .= '"status":"error"'; 
}
         
          $response .= '}';
          echo $response;
          break;

case 2:
    $query="update vendor set CompanyName ='".$data->companyName."',CompanyPhone='".$data->companyPhone."',CompanyEmail='".$data->companyEmail."',Country='".$data->country."',State='".$data->state."',City='".$data->city."',Name='".$data->name."',Phone='".$data->phone."',Address='".$data->address."',BankName='".$data->bankName."',BranchName='".$data->branchName."',AccountNo='".$data->accountNo."',IFSCCode='".$data->ifscCode."'where id=".$data->id."'";
   $records=$conn->query($query);

   $response='{';
   if ($records>0){
          $response .= '"message":"Item Updated Successfully",';
   $response .= '"status":"success"';}
 else {
    $response .= '"message":"Not Updated",';
            $response .= '"status":"error"';  
}
         
          $response .= '}';
          echo $response;
          break;

case 3:
    $query="delete from vendor where id='".$data->id."'";
   $records=$conn->query($query);

   $response='{';
   if ($records>0){
          $response .= '"message":"Deleted Successfully",';
   $response .= '"status":"success"';}
 else {
    $response .= '"message":"Not Deleted",';
            $response .= '"status":"error"';
}
         
          $response .= '}';
          echo $response;
          break;

case 4:
    $query="select * from category";
   $records=$conn->query($query);
       $rows=$records->num_rows;
       if($rows>0)
       
           $res='';
           $x=1;
          while($row=$records->fetch_assoc())
          {
             $res .='{';
             $res .= '"id":"'    . $row["id"] . '",';
             $res .='"categories":"'     .$row["categories"].'",';
            
             $res .='"vendors":"'  .$row["vendors"].'"' ;
              
             $res .= '}';
             $res.= $x< $rows ? ',':'' ;
                $x++;
          }
          $response='{';
          $response .= '"status":"success",';
          $response .='"data":['.$res.']';
          $response .= '}';
          echo $response;
          break;



case 5:
    $query="insert into category(Vendors,Categories) values('".$data->vendors."','".$data->categories."')";

 $records=$conn->query($query);

   $response='{';
   if ($records>0){
          $response .= '"message":"Inserted Successfully",';
   $response .= '"status":"success"';}
 else {
    $response .= '"message":"Not Inserted",';
            $response .= '"status":"error"';
}
         
          $response .= '}';
          echo $response;
          break;

case 6:
    $query="update category set Vendors ='".$data->vendors."',Categories='".$data->categories."' where id='".$data->id."'";
   $records=$conn->query($query);

   $response='{';
   if ($records>0){
          $response .= '"message":"Item Updated Successfully",';
   $response .= '"status":"success"';}
 else {
      $response .= '"message":"Not Updated",';
            $response .= '"status":"error"'; 
}
         
          $response .= '}';
          echo $response;
          break;

case 7:
    $query="delete from category where id='".$data->id."'";
   
   $records=$conn->query($query);

   $response='{';
   if($records>0){
          $response .= '"message":"Deleted Successfully",';
   $response .= '"status":"success"';}
 else {
       $response .= '"message":"Not Deleted",';
            $response .= '"status":"error"';
}
         
          $response .= '}';
          echo $response;
          break;

case 8:
    $query="select * from inventory";
   $records=$conn->query($query);
       $rows=$records->num_rows;
       if($rows>0)
       
           $res='';
           $x=1;
          while($row=$records->fetch_assoc())
          {
             $res .='{';
             $res .= '"id":"'    . $row["id"] . '",';
             $res .='"inventories":"'     .$row["inventories"].'",';
             $res .='"categories":"'     .$row["categories"].'",';
             $res .='"vendors":"'  .$row["vendors"].'"' ;
              
             $res .= '}';
             $res.= $x< $rows ? ',':'' ;
                $x++;
          }
          $response='{';
          $response .= '"status":"success",';
          $response .='"data":['.$res.']';
          $response .= '}';
          echo $response;
          break;



case 9: 
$query="insert into inventory(Vendors,Categories,Inventories) values('".$data->vendors."','".$data->categories."','".$data->inventories."')";

 $records=$conn->query($query);

   $response='{';
   if ($records>0){
          $response .= '"message":"Inserted Successfully",';
   $response .= '"status":"success"';}
 else {
       $response .= '"message":"Not Inserted",';
            $response .= '"status":"error"';
}
         
          $response .= '}';
          echo $response;
          break;
case 10:
    $query="update inventory set Vendors ='".$data->vendors."',Categories='".$data->categories."',Inventories='".$data->inventories."'where id='".$data->id."'";
   $records=$conn->query($query);

   $response='{';
   if ($records>0){
          $response .= '"message":"Item Updated Successfully",';
   $response .= '"status":"success"';}
 else {
     $response .= '"message":"Not Updated",';
            $response .= '"status":"error"'; 
}
         
          $response .= '}';
          echo $response;
          break;

case 11:
    $query="delete from inventory where id='".$data->id."'";
   
   $records=$conn->query($query);

   $response='{';
   if ($records>0){
          $response .= '"message":"Deleted Successfully",';
   $response .= '"status":"success"';}
 else {
      $response .= '"message":"Not Deleted",';
            $response .= '"status":"error"';
 }
          $response .= '}';
          echo $response;
          break;


case 12:   
    $query="select * from stockpricing";
    
   $records=$conn->query($query);
       $rows=$records->num_rows;
       if($rows>0)
       
           $res='';
           $x=1;
          while($row=$records->fetch_assoc())
          {
             $res .='{';
             $res .= '"reorderLevel":"'    . $row["ReorderLevel"] . '",';
             $res .='"mrp":"'     .$row["Mrp"].'",';
             $res .='"date":"'     .$row["Date"].'",';
             $res .='"discount":"'     .$row["Discount"].'",';
             $res .='"id":"'     .$row["id"].'",';
             $res .='"amount":"'     .$row["Amount"].'",';
             $res .='"categoryName":"'     .$row["CategoryName"].'",';
             $res .='"free":"'     .$row["Free"].'",';
             $res .='"inventoryItem":"'     .$row["InventoryItem"].'",';
             $res .='"rate":"'     .$row["Rate"].'",';
             $res .='"totAmount":"'     .$row["TotAmount"].'",';
             $res .='"quantity":"'     .$row["Quantity"].'",';

             $res .='"vendors":"'  .$row["Vendors"].'"' ;
              
             $res .= '}';
             $res.= $x< $rows ? ',':'' ;
                $x++;
          }
          $response='{';
          $response .= '"status":"success",';
          $response .='"data":['.$res.']';
          $response .= '}';
          echo $response;
          break;



case 13:
    $query="insert into stockpricing(Vendors,CategoryName,InventoryItem,Quantity,ReorderLevel,Free,Discount,Mrp,Rate,Amount,TotAmount,Date) values('".$data->vendors."','".$data->categoryName."','".$data->inventoryItem."','".$data->quantity."','".$data->reorderLevel."','".$data->free."','".$data->discount."','".$data->mrp."','".$data->rate."','".$data->amount."','".$data->totAmount."','".$data->date."')";

 $records=$conn->query($query);

   $response='{';
   if ($records>0){
          $response .= '"message":"Inserted Successfully",';
   $response .= '"status":"success"';}
 else {
     $response .= '"message":"Not Inserted",';
            $response .= '"status":"error"';
}
         
          $response .= '}';
          echo $response;
          break;

case 14:
    $query="update stockpricing set Vendors ='".$data->vendors."',CategoryName='".$data->categoryName."',InventoryItem='".$data->inventoryItem."',quantity='".$data->quantity."',ReorderLevel='".$data->reorderLevel."',Free='".$data->free."',Discount='".$data->discount."',Mrp='".$data->mrp."',Rate='".$data->rate."',Amount='".$data->amount."',TotAmount='".$data->totAmount."',Date='".$data->date."'where id=".$data->id."'";
   $records=$conn->query($query);

   $response='{';
   if ($records>o){
          $response .= '"message":"Item Updated Successfully",';
   $response .= '"status":"success"';}
 else {
       $response .= '"message":"Not Updated",';
            $response .= '"status":"error"'; 
}
         
          $response .= '}';
          echo $response;
          break;

case 15:
    $query="delete from stockpricing where id='".$data->id."'";
   
   $records=$conn->query($query);

   $response='{';
   if ($records>0){
          $response .= '"message":"Deleted Successfully",';
   $response .= '"status":"success"';}
 else {
     $response .= '"message":"Not Deleted",';
            $response .= '"status":"error"';
}
         
          $response .= '}';
          echo $response;
          break;


case 16:
    $query="select * from stock";
//    $query2="select * from stock  where  AvailableStock='".$data->availableStock."' and Amount='".$data->amount."' and Vendors ='".$data->vendors."' and CategoryName='".$data->category."' and InventoryItem='".$data->inventItem."'";
//    $records1=$conn->query($query2);
    $records=$conn->query($query);
       $rows=$records->num_rows;
       if($rows>0)
       
           $res='';
           $x=1;
          while($row=$records->fetch_assoc())
          {
             $res .='{';
             $res .= '"amount":"'    . $row["Amount"] . '",';
             $res .='"id":"'     .$row["id"].'",';
             $res .='"remainingStock+":"'     .$row["RemainingStock"].'",';
             $res .='"availableStock":"'     .$row["AvailableStock"].'",';
             $res .='"category":"'     .$row["Category"].'",';
             $res .='"vendor":"'     .$row["Vendor"].'",';
             $res .='"inventItem":"'     .$row["InventItem"].'",';
             $res .='"studentName":"'     .$row["StudentName"].'",';
             $res .='"issuedStock":"'     .$row["IssuedStock"].'",';
             $res .='"date":"'     .$row["Date"].'",';
             

             $res .='"userType":"'  .$row["UserType"].'"' ;
              
             $res .= '}';
             $res.= $x< $rows ? ',':'' ;
                $x++;
          }
          $response='{';
          $response .= '"status":"success",';
          $response .='"data":['.$res.']';
          $response .= '}';
          echo $response;
          break;

case 17:
    $query="insert into stock(UserType,StudentName,Vendor,Category,InventItem,AvailableStock,IssuedStock,RemainingStock,Amount,Date) values('".$data->userType."','".$data->studentName."','".$data->vendor."','".$data->category."','".$data->inventItem."','".$data->availableStock."','".$data->issuedStock."','".$data->remainingStock."','".$data->amount."','".$data->date."')";

 $records=$conn->query($query);

   $response='{';
   if ($records>0){
          $response .= '"message":"Inserted Successfully",';
   $response .= '"status":"success"';}
 else {
     $response .= '"message":"Not Inserted",';
            $response .= '"status":"error"';
}
         
          $response .= '}';
          echo $response;
          break;

case 18:
    $query="update stock set UserType ='".$data->userType."',StudentName='".$data->studentName."',Vendor='".$data->vendor."',Category='".$data->category."',InventItem='".$data->inventItem."',AvailableStock='".$data->availableStock."',IssuedStock='".$data->issuedStock."',RemainingStock='".$data->remainingStock."',Amount='".$data->amount."',Date='".$data->date."'where id=".$data->id."'";
					
						
   $records=$conn->query($query);

   $response='{';
   if ($records>0){
          $response .= '"message":"Item Updated Successfully",';
   $response .= '"status":"success"';}
 else {
     $response .= '"message":"Not Updated",';
            $response .= '"status":"error"'; 
}
         
          $response .= '}';
          echo $response;
          break;

case 19:
    $query="delete from stock where id='".$data->id."'";
   
   $records=$conn->query($query);

   $response='{';
   if ($records>0){
          $response .= '"message":"Deleted Successfully",';
   $response .= '"status":"success"';}
 else {
    $response .= '"message":"Not Deleted",';
            $response .= '"status":"error"';
}
         
          $response .= '}';
          echo $response;
          break;



case 20:
    $query="select * from payment";

    $records=$conn->query($query);
       $rows=$records->num_rows;
       if($rows>0)
       
           $res='';
           $x=1;
          while($row=$records->fetch_assoc())
          {
             $res .='{';
             $res .= '"id":"'    . $row["id"] . '",';
             $res .='"phone":"'     .$row["Phone"].'",';
             $res .='"category+":"'     .$row["Category"].'",';
             $res .='"amountPaid":"'     .$row["AmountPaid"].'",';
             $res .='"state":"'     .$row["State"].'",';
             $res .='"payDate":"'     .$row["PayDate"].'",';
             $res .='"invItem":"'     .$row["InvItem"].'",';
             $res .='"companyName":"'     .$row["CompanyName"].'",';
             $res .='"contactPerson":"'     .$row["ContactPerson"].'",';
      
             $res .='"city":"'  .$row["City"].'"' ;
              
             $res .= '}';
             $res.= $x< $rows ? ',':'' ;
                $x++;
          }
          $response='{';
          $response .= '"status":"success",';
          $response .='"data":['.$res.']';
          $response .= '}';
          echo $response;
break;

          


case 21:
    $query="insert into payment(CompanyName,Category,InvItem,State,City,ContactPerson,Phone,TotAmount,AmountPaid,PayDate,Balence) values('".$data->companyName."','".$data->category."','".$data->invItem."','".$data->state."','".$data->city."','".$data->contactPerson."','".$data->phone."','".$data->totAmount."','".$data->amountPaid."','".$data->payDate."','".$data->balence."')";

 $records=$conn->query($query);

   $response='{';
   if($records>0){
          $response .= '"message":"Inserted Successfully",';
   $response .= '"status":"success"';}
 else {
      $response .= '"message":"Not Inserted",';
            $response .= '"status":"error"';
}
         
          $response .= '}';
          echo $response;
          break;
 
case 22:
    $query="update payment set CompanyName='".$data->companyName."',Category='".$data->category."',InvItem='".$data->invItem."',State='".$data->state."',City='".$data->city."',ContactPerson='".$data->contactPerson."',Phone='".$data->phone."',TotAmount='".$data->totAmount."',AmountPaid='".$data->amountPaid."' ,PayDate='".$data->payDate."' ,Balence='".$data->balence."'where id=".$data->id."'";
					
						
   $records=$conn->query($query);

   $response='{';
   if ($records>0){
          $response .= '"message":"Item Updated Successfully",';
          $response .= '"status":"success"';
   }
 else {
        $response .= '"message":"Not Updated",';
            $response .= '"status":"error"'; 
   }
          $response .= '}';
          echo $response;
          break;

case 23:
    $query="delete from payment where id='".$data->id."'";
   
   $records=$conn->query($query);

   $response='{';
   if ($records>0){
          $response .= '"message":"Deleted Successfully",';
          $response .= '"status":"success"';
   }
 else {
        $response .= '"message":"Not Deleted",';
            $response .= '"status":"error"'; 
   }
          $response .= '}';
          echo $response;
          break;
}

?>