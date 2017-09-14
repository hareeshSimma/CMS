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
if($option ==1){
   $query="select *from users where user_name= '".$data->uname."' and password ='".$data->pwd."'";
   $records=$conn->query($query);
       $rows=$records->num_rows;
       if($rows>0)
       {
           session_start();
           $res='';
           $x=1;
          while($row=$records->fetch_assoc())
          {
             $res .='{';
             $res .= '"role":"'    . $row["role"] . '",';
             $res .='"uname":"'     .$row["user_name"].'",';
             $res .='"pwd":"'  .$row["password"].'",' ;
              $res .='"schoolCode":"'  .$row["school"].'"' ;
             $res .= '}';
             $res.= $x< $rows ? ',':'' ;
                $x++;
          }
          $response='{';
          $response .= '"status":"success",';
          $response .='"userInfo":'   . $res . '';
          $response .= '}';
          echo $response;
}else{
    echo 'User Name and Password Wrong';
}
}
else if($option ==2){
    session_abort();
           $response='{';
          $response .= '"status":"success"';
          $response .= '}';
          echo $response;
}

?>
