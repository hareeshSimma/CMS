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
//company info
switch ($option){
case 0:
    $q="select * from company";
       $records=$conn->query($q);
       $rows=$records->num_rows;
       if($rows>0)
       {
           $res='';
           $x=1;
          while($row=$records->fetch_assoc())
          {
             $res .='{';
             $res .= '"companyCode":"'    . $row["CompanyCode"] . '",';
             $res .='"estd":"'     .$row["Estd"].'",';
             $res .='"address":"'     .$row["Address"].'",';
             $res .='"phone":"'     .$row["Phone"].'",';
             $res .='"city":"'     .$row["City"].'",';
             $res .='"companyName":"'     .$row["CompanyName"].'",';
             $res .='"contact":"'     .$row["Contact"].'",';
             $res .='"mobile":"'     .$row["Mobile"].'",';
             $res .='"emailid":"'     .$row["Emailid"].'",';
             $res .='"id":"'     .$row["id"].'",';
             $res .='"state":"'     .$row["state"].'",';
             $res .='"fax":"'     .$row["Fax"].'"';
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
       echo "no records found";
   break;
     

case 1:
    $q="insert into company(CompanyCode,CompanyName,Estd,Contact,Phone,Mobile,Emailid,Fax,state,City,Address) values('".$data->companyCode."','".$data->companyName."','".$data->estd."','".$data->contact."','".$data->phone."','".$data->mobile."','".$data->emailid."','".$data->fax."','".$data->state."','".$data->city."','".$data->address."')";
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

    

case 2:
    
  
      $q="update company set CompanyCode='".$data->companyCode."',CompanyName='".$data->companyName."',Estd='".$data->estd."',Contact='".$data->contact."',Phone='".$data->phone."',Mobile='".$data->mobile."',Emailid='".$data->emailid."',Fax='".$data->fax."',state='".$data->state."',City='".$data->city."',Address='".$data->address."' where id='".$data->id."'";
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
     
case 3:  
     $q="delete from company where id='".$data->id."'";
     $result=$conn->query($q);
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
     
//end company info
 //interview

case 4:
  
    $q="select * from interview";
       $records=$conn->query($q);
       $rows=$records->num_rows;
       if($rows>0)
       {
           $res='';
           $x=1;
          while($row=$records->fetch_assoc())
          {
             $res .='{';
             $res .= '"idate":"'    . $row["Idate"] . '",';
             $res .='"venue":"'     .$row["Venue"].'",';
             $res .='"cType":"'     .$row["cType"].'",';
             $res .='"start":"'     .$row["Start"].'",';
             $res .='"mobile":"'     .$row["Mobile"].'",';
             $res .='"className":"'     .$row["class"].'",';
             $res .='"cdate":"'     .$row["Cdate"].'",';
             $res .='"person":"'     .$row["Person"].'",';
             $res .='"company":"'     .$row["Company"].'",';
             $res .='"semester":"'     .$row["Semester"].'",';
             $res .='"id":"'     .$row["id"].'",';
             $res .='"close":"'     .$row["Close"].'",';
             $res .='"acdYr":"'     .$row["AcdYr"].'"';
             
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
       echo "no records found";
   break;
      
    

case 5:
    $q="insert into interview(Company,Person,Idate,Venue,Cdate,Start,Close,class,cType,Semester,Mobile,AcdYr) values('".$data->company."','".$data->person."','".$data->idate."','".$data->venue."','".$data->cdate."','".$data->start."','".$data->close."','".$data->className."','".$data->cType."','".$data->semester."','".$data->mobile."','".$data->acdYr."')";
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
     

case 6:
    $q="update interview set AcdYr='".$data->acdYr."',Company='".$data->company."',cType='".$data->cType."',class='".$data->className."',semester='".$data->semester."',Person='".$data->person."',Idate='".$data->idate."',Cdate='".$data->cdate."',Start='".$data->start."',Close='".$data->close."',Venue='".$data->venue."',Mobile='".$data->mobile."' where id='".$data->id."'";
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
    $q="delete from interview  where id='".$data->id."'";
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
     

//end interview
//start student report
case 8: 
    $q="select * from studallot";
       $records=$conn->query($q);
       $rows=$records->num_rows;
       if($rows>0)
       {
           $res='';
           $x=1;
          while($row=$records->fetch_assoc())
          {
             $res .='{';
             $res .= '"date":"'    . $row["date"] . '",';
             $res .='"cType":"'     .$row["cType"].'",';
             $res .='"companyName":"'     .$row["companyName"].'",';
             $res .='"name":"'     .$row["name"].'",';
             $res .='"className":"'     .$row["className"].'",';
             $res .='"section":"'     .$row["section"].'",';
             $res .='"id":"'     .$row["id"].'",';
             $res .='"medium":"'     .$row["medium"].'",';
             $res .='"admNo":"'     .$row["admNo"].'",';
             $res .='"acdYr":"'     .$row["acdYr"].'",';
             $res .='"remarks":"'     .$row["remarks"].'",';
              $res .='"status":"'     .$row["status"].'"';
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
       echo "no records found";
      
   break;

case 9:
    $q="insert into studallot(cType,className,section,medium,admNo,name,acdYr,companyName,status,remarks,date) values('".$data->cType."','".$data->className."','".$data->section."','".$data->medium."','".$data->admNo."','".$data->name."','".$data->acdYr."','".$data->companyName."','".$data->status."','".$data->remarks."','".$data->date."')";
  $records=$conn->query($q);
          $response='{';
          if ($records > 0){
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
       $q="update studallot set cType='".$data->cType."',className='".$data->className."',section='".$data->section."',medium='".$data->medium."',admNo='".$data->admNo."',acdYr='".$data->acdYr."',CompanyName='".$data->companyName."',Status='".$data->status."',Remarks='".$data->remarks."',Date='".$data->date."' where id='".$data->id."'";
  $records=$conn->query($q);
          $response='{';
          if ($records>0){
           $response .='"message":"Updated Successfully",';
          $response .= '"status":"success"';}
          else{
               $response .= '"message":"Not Updated",';
            $response .= '"status":"error"'; 
          }
         
          $response .= '}';
          echo $response;
          break;
     

case 11:
    $q="delete from studallot  where id='".$data->id."'";
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
     

}//end student report

?>
