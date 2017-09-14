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
    $query="select * from vehicle";
   $records=$conn->query($query);
       $rows=$records->num_rows;
       if($rows>0)
       {
           $res='';
           $x=1;
          while($row=$records->fetch_assoc())
          {
             $res .='{';
             $res .= '"id":"'    . $row["id"] . '",';
             $res .='"ownership":"'     .$row["Ownership"].'",';
             $res .='"lstart":"'  .$row["Lstart"].'",' ;
             $res .='"fuelType":"'  .$row["FuelType"].'",' ;
             $res .= '"vehicle":"'    . $row["VehicleNumber"] . '",';
             $res .='"capacity":"'     .$row["Capacity"].'",';
             $res .='"vehicleType":"'  .$row["VehicleType"].'",' ;
             $res .='"purchase":"'  .$row["Purchase"].'",' ;
             $res .= '"odometer":"'    . $row["Odometer"] . '",';
             $res .='"lend":"'     .$row["Lend"].'",';
             
              $res .='"ownName":"'  .$row["OwnName"].'"' ;
              
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
  else{
       echo 'No Records Found';
    }
break;


case 1:
    $query="insert into vehicle(VehicleNumber,VehicleType,FuelType,Odometer,Capacity,Ownership,Purchase,OwnName,Lstart,Lend) values('".$data->vehicle."','".$data->vehicleType."','".$data->fuelType."','".$data->odometer."','".$data->capacity."','".$data->ownership."','".$data->purchase."','".$data->ownName."','".$data->lstart."','".$data->lend."')";

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

case 2:
    $query="update vehicle set VehicleNumber='".$data->vehicle."', VehicleType='".$data->vehicleType."', FuelType='".$data->fuelType."', Odometer='".$data->odometer."', Capacity='".$data->capacity."', Ownership='".$data->ownership."', Purchase='".$data->purchase."', OwnName='".$data->ownName."', Lstart='".$data->lstart."', Lend='".$data->lend."' where id='".$data->id."'";
   $records=$conn->query($query);

   $response='{';
   if($records>0){
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
    $query="delete from vehicle where id='".$data->id."'";
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
    $query="select * from vehicleroute";
   $records=$conn->query($query);
       $rows=$records->num_rows;
       if($rows>0)
       {
           $res='';
           $x=1;
          while($row=$records->fetch_assoc())
          {
             $res .='{';
             $res .= '"vehicleNum":"'    . $row["VehicleNumber"] . '",';
             $res .='"id":"'     .$row["id"].'",';
             $res .='"driverNumber":"'  .$row["DriverNumber"].'",' ;
             $res .='"route":"'  .$row["Route"].'",' ;
             $res .= '"capacity":"'    . $row["Capacity"] . '",';
             $res .='"vehicleType":"'     .$row["VehicleType"].'",';
             $res .='"license":"'  .$row["License"].'",' ;
             $res .='"driverName":"'  .$row["DriverName"].'",' ;
           
              $res .='"destination":"'  .$row["Destination"].'"' ;
              
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
else{
       echo 'No Records Found';
    }
break;


case 5:
    $query="insert into vehicleroute(VehicleNumber,VehicleType,Capacity,Route,Destination,DriverName,DriverNumber,License) values('".$data->vehicleNum."','".$data->vehicleType."','".$data->capacity."','".$data->route."','".$data->destination."','".$data->driverName."','".$data->driverNumber."','".$data->license."')";

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
    $query="update vehicleroute set VehicleNumber='".$data->vehicleNum."',VehicleType='".$data->vehicleType."',Capacity='".$data->capacity."',Route='".$data->route."',Destination='".$data->destination."',DriverName='".$data->driverName."',DriverNumber='".$data->driverNumber."',License='".$data->license."'where id=".$data->id."'";
   $records=$conn->query($query);

   $response='{';
   if($records>0){
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
    $query="delete from vehicleroute where id='".$data->id."'";
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
    $query="select * from insurance";
   $records=$conn->query($query);
       $rows=$records->num_rows;
       if($rows>0)
       {
           $res='';
           $x=1;
          while($row=$records->fetch_assoc())
          {
             $res .='{';
             $res .= '"insurer":"'    . $row["Insurer"] . '",';
             $res .='"id":"'     .$row["id"].'",';
             $res .='"insuranceCompany":"'  .$row["InsuranceCompany"].'",' ;
             $res .='"date":"'  .$row["Date"].'",' ;
             
              $res .='"vehicleNumber":"'  .$row["VehicleNumber"].'"' ;
              
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
else{
       echo 'No Records Found';
    }
break;


case 9:
    $query="insert into insurance(VehicleNumber,InsuranceCompany,Insurer,Date,ExpiresOn) values('".$data->vehicleNumber."','".$data->insuranceCompany."','".$data->insurer."','".$data->date."','".$data->expiresOn."')";

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
    $query="update insurance set VehicleNumber='".$data->vehicleNumber."',InsuranceCompany='".$data->insuranceCompany."',Insurer='".$data->insurer."',Date='".$data->date."',ExpiresOn='".$data->expiresOn."' where id='".$data->id."'";
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
    $query="delete from insurance where id='".$data->id."'";
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

case 12:
    $query="select * from routeallotment";
   $records=$conn->query($query);
       $rows=$records->num_rows;
       if($rows>0)
       {
           $res='';
           $x=1;
          while($row=$records->fetch_assoc())
          {
             $res .='{';
             $res .= '"id":"'    . $row["id"] . '",';
             $res .='"cType":"'     .$row["cType"].'",';
             $res .='"class":"'  .$row["class"].'",' ;
             $res .='"section":"'  .$row["section"].'",' ;
              $res .='"semester":"'  .$row["semester"].'",' ;
               $res .='"admNo":"'  .$row["StudentNumber"].'",' ;
                $res .='"name":"'  .$row["StudentName"].'",' ;
              $res .='"route":"'  .$row["Route"].'"' ;
              
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
else{
       echo 'No Records Found';
    }
break;


case 13:
    $query="insert into routeallotment(cType,class,semester,section,StudentNumber,StudentName,Route) values('".$data->cType."','".$data->className."','".$data->section."','".$data->semester."','".$data->admNo."','".$data->name."','".$data->route."')";

 $records=$conn->query($query);

   $response='{';
   if ($records>0){
          $response .= '"message":"Inserted Successfully",';
          $response .= '"status":"success"';
   }
 else {
         $response .= '"message":"Not Inserted",';
            $response .= '"status":"error"';
   }
          $response .= '}';
          echo $response;
          break;

case 14:
    $query="update routeallotment set courseType='".$data->vehicleNumber."',class='".$data->vehicleNumber."',semester='".$data->vehicleNumber."',section='".$data->vehicleNumber."',StudentNumber='".$data->vehicleNumber."',StudentName='".$data->vehicleNumber."',Route='".$data->vehicleNumber."'where id=".$data->vehicleNumber."";
					
    $records=$conn->query($query);

   $response='{';
   if($records>0){
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
    $query="delete from routeallotment where id='".$data->id."'";
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