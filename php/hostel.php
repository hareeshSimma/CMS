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
//hostel info
switch ($option){
case 0: 
    $q="select * from hstdetails";
       $records=$conn->query($q);
       $rows=$records->num_rows;
       if($rows>0)
       {
           $res='';
           $x=1;
          while($row=$records->fetch_assoc())
          {
             $res .='{';
             $res .= '"acaYear":"'    . $row["acaYear"] . '",';
             $res .='"hostelFor":"'     .$row["genHstFor"].'",';
             $res .='"hostelName":"'     .$row["hostelName"].'",';
             $res .='"id":"'     .$row["id"].'",';
             $res .='"hostelCap":"'     .$row["capacity"].'",';
             $res .='"hostelLocation":"'     .$row["hostelLocation"].'"';
             $res .= '}';
             $res.= $x< $rows ? ',':'' ;
                $x++;
          }
          $response='{';
          $response .= '"status":"success",';
          $response .='"data":['.$res.']';
          $response .= '}';
          echo $response;
       }else
       echo "No Records Found";
   break;
     
case 1:
    
    $q="insert into hstdetails(acaYear,hostelName,hostelLocation,genHstFor,capacity) values('".$data->acaYear."','".$data->hostelName."','".$data->hostelLocation."','".$data->hostelFor."','".$data->hostelCap."')";
  $records=$conn->query($q);
          $response='{';
          if($records>0){
           $response .='"message":"Inserted Successfully",';
          $response .= '"status":"success"';}
 else {
             $response .= '"message":"Not Inserted",';
            $response .= '"status":"error"';}
         
          $response .= '}';
          echo $response;
          break;

    

case 2:
    
 
   $q="update hstdetails set acaYear ='".$data->acaYear."',hostelName='".$data->hostelName."',hostelLocation='".$data->hostelLocation."',genHstFor='".$data->hostelFor."',capacity='".$data->hostelCap."'where id='".$data->id."'";
  $records=$conn->query($q);
          $response='{';
          if($records>0){
           $response .='"message":"Updated Successfully",';
          $response .= '"status":"success"';}
 else {
       $response .= '"message":"Not Updated",';
            $response .= '"status":"error"';
 }
         
          $response .= '}';
          echo $response;
          break;
     
case 3:
    
  
     $q="delete from hstdetails where id='".$data->id."'";
     $result=$conn->query($q);
           $response='{';
           if($result>0){
           $response .='"message":"Deleted Successfully",';
           $response .= '"status":"success"';}
 else {
       $response .= '"message":"Not Deleted",';
            $response .= '"status":"error"';
 }
           $response .= '}';
          echo $response;
          break;
     
//end hostel info
 //add hostel

case 4:
    
    $q="select * from hstroomdet";
       $records=$conn->query($q);
       $rows=$records->num_rows;
       if($rows>0)
       {
           $res='';
           $x=1;
          while($row=$records->fetch_assoc())
          {
             $res .='{';
             $res .= '"rmNum":"'    . $row["roomNum"] . '",';
             $res .='"hostelName":"'     .$row["hostelName"].'",';
             $res .='"id":"'     .$row["id"].'",';
             $res .='"rmCap":"'     .$row["roomCapacity"].'",';
             $res .='"hostelLocation":"'     .$row["hostelLocation"].'"';
                        
             $res .= '}';
             $res.= $x< $rows ? ',':'' ;
                $x++;
          }
          $response='{';
          $response .= '"status":"success",';
          $response .='"data":['.$res.']';
          $response .= '}';
          echo $response;
       }else
       echo "No Records Found";
   break;
      
    

case 5:
    $q="insert into hstroomdet(roomNum,roomCapacity,hostelName,hostelLocation) values('".$data->rmNum."','".$data->rmCap."','".$data->hostelName."','".$data->hostelLocation."')";
  $records=$conn->query($q);
          $response='{';
          if($records>0){
           $response .='"message":"Inserted Successfully",';
          $response .= '"status":"success"';}
 else {
     $response .= '"message":"Not Inserted",';
            $response .= '"status":"error"';
     
 }
         
          $response .= '}';
          echo $response;
          break;
     

case 6:
   $q="update hstroomdet set roomNum ='".$data->rmNum."',roomCapacity='".$data->rmCap."',hostelName ='".$data->hostelName."',hostelLocation='".$data->hostelLocation."'where id='".$data->id."'";
       $records=$conn->query($q);
         
          $response='{';
          if ($records>0){
           $response .='"message":"Updated Successfully",';
          $response .= '"status":"success"';}
 else {
       $response .= '"message":"Not Updated",';
            $response .= '"status":"error"';
 }
           $response .= '}';
          echo $response;
          break;
     

case 7:
    $q="delete from hstroomdet  where id='".$data->id."'";
  $records=$conn->query($q);
          $response='{';
          if ($records>0){
           $response .='"message":"Deleted Successfully",';
          $response .= '"status":"success"';}
 else {
       $response .= '"message":"Not Deleted",';
            $response .= '"status":"error"';
 }
          $response .= '}';
          echo $response;
          break;
     

//end hostel for students
//start student allot
case 8:
  
    $q="select * from hststuallot";
       $records=$conn->query($q);
       $rows=$records->num_rows;
       if($rows>0)
       {
           $res='';
           $x=1;
          while($row=$records->fetch_assoc())
          {
             $res .='{';
             $res .= '"className":"'    . $row["clsName"] . '",';
             $res .='"section":"'     .$row["section"].'",';
             $res .='"medium":"'     .$row["medium"].'",';
             $res .='"admNo":"'     .$row["admNo"].'",';
             $res .='"acaYear":"'     .$row["acaYear"].'",';
             $res .='"rmNum":"'     .$row["roomNum"].'",';
             $res .='"hostelName":"'     .$row["hostelName"].'",';
             $res .='"name":"'     .$row["stuName"].'",';
             $res .='"course":"'     .$row["courseType"].'",';
             $res .='"from":"'     .$row["fromDate"].'",';
             $res .='"id":"'     .$row["id"].'",';
              $res .='"to":"'     .$row["toDate"].'",';
               $res .='"doj":"'     .$row["doj"].'"';
             $res .= '}';
             $res.= $x< $rows ? ',':'' ;
                $x++;
          }
          $response='{';
          $response .= '"status":"success",';
          $response .='"data":['.$res.']';
          $response .= '}';
          echo $response;
       }else
       echo "No Records Found";
   break;
      
    

case 9:
   
    $q="insert into hststuallot(courseType,clsName,section,medium,stuName,roomNum,hostelName,admNo,acaYear,doj,fromDate,toDate) values('".$data->course."','".$data->className."','".$data->section."','".$data->medium."','".$data->name."','".$data->rmNum."','".$data->hostelName."','".$data->admNo."','".$data->acaYear."','".$data->doj."','".$data->from."','".$data->to."')";
  $records=$conn->query($q);
          $response='{';
          if($records>0){
           $response .='"message":"Inserted Successfully",';
          $response .= '"status":"success"';
          }
 else {
      $response .= '"message":"Not Inserted",';
            $response .= '"status":"error"';
 }
          $response .= '}';
          echo $response;
          break;
     

case 10:
    

    $q="update hststuallot set courseType ='".$data->course."',clsName='".$data->className."',section='".$data->section."',medium='".$data->medium."',stuName='".$data->name."',roomNum='".$data->rmNum."',hostelName='".$data->hostelName."',acaYear='".$data->acaYear."',doj='".$data->doj."',admNo='".$data->admNo."',fromDate='".$data->from."',toDate='".$data->to."'where id='".$data->id."'";
  $records=$conn->query($q);
  
          $response='{';
          if ($records>0){
           $response .='"message":"Updated Successfully",';
          $response .= '"status":"success"';}
 else {
      $response .= '"message":"Not Updated",';
            $response .= '"status":"error"';    
 }
         
          $response .= '}';
          echo $response;
          break;
     

case 11:
    $q="delete from hststuallot  where id='".$data->id."'";
  $records=$conn->query($q);
          $response='{';
          if ($records>0)
          {
           $response .='"message":"Deleted Successfully",';
          $response .= '"status":"success"';}
 else {
     $response .= '"message":"Not Deleted",';
            $response .= '"status":"error"';
     
 }
         
          $response .= '}';
          echo $response;
     

//end student allot
case 12 :
  
    $q="select * from hststuallot";
       $records=$conn->query($q);
       $rows=$records->num_rows;
       if($rows>0)
       {
           $res='';
           $x=1;
          while($row=$records->fetch_assoc())
          {
             $res .='{';
             $res .= '"id":"'    . $row["id"] . '",';
             $res .='"course":"'     .$row["courseType"].'",';
             $res .='"className":"'     .$row["clsName"].'",';
             $res .='"section":"'     .$row["section"].'",';
             $res .='"medium":"'     .$row["medium"].'",';
             $res .='"name":"'     .$row["stuName"].'",';
             $res .='"admNo":"'     .$row["admNo"].'",';
            $res .='"acaYear":"'     .$row["acaYear"].'",';
             $res .='"dol":"'     .$row["dol"].'",';
              $res .='"reason":"'     .$row["reason"].'"';
             $res .= '}';
             $res.= $x< $rows ? ',':'' ;
                $x++;
          }
          $response='{';
          $response .= '"status":"success",';
          $response .='"data":['.$res.']';
          $response .= '}';
          echo $response;
       }else
       echo "No Records Found";
   break;

case 13:
    $q="insert into hstvacated(courseType,clsName,section,medium,stuName,admNo,acaYear,dol,reason) values('".$data->course."','".$data->className."','".$data->section."','".$data->medium."','".$data->admNo."','".$data->name."','".$data->acaYear."','".$data->dol."','".$data->reason."')";
  $records=$conn->query($q);
          $response='{';
          if ($records>0){
           $response .='"message":"Inserted Successfully",';
          $response .= '"status":"success"';}
 else {
     $response .= '"message":"Not Inserted",';
            $response .= '"status":"error"';
 }
         
          $response .= '}';
          echo $response;
          break;

case 14:
    $q="update hstvacated set courseType ='".$data->course."',clsName='".$data->className."',section='".$data->section."',medium='".$data->medium."',stuName='".$data->name."',acaYear='".$data->acaYear."',dol='".$data->dol."',reason='".$data->reason."'where id=".$data->id."";
  $records=$conn->query($q);
  
          $response='{';
          if ($records>0){
           $response .='"message":"Updated Successfully",';
          $response .= '"status":"success"';}
 else {
      $response .= '"message":"Not Updated",';
            $response .= '"status":"error"'; 
 }
         
          $response .= '}';
          echo $response;
          break; 
case 15:
    $q="delete from hstvacated  where id='".$data->id."'";
  $records=$conn->query($q);
          $response='{';
          if ($records>0){
           $response .='"message":"Deleted Successfully",';
          $response .= '"status":"success"';}
 else {
      $response .= '"message":"Not Deleted",';
            $response .= '"status":"error"';
 }
         
          $response .= '}';
          echo $response;
          break;
     

}
?>
