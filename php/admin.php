<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Content-Range, Content-Disposition, Content-Description');

$postdata = file_get_contents("php://input");
$data = json_decode($postdata);
// include database and object files 
include_once '../database/database.php';
// Create connection
$db = new DB();
$conn = $db->getConnection();

$option = $data->optId;

function authCheck() {
    session_start();
    $cURole = $_SESSION["role"];
    if ($cURole != 'Admin')
        return false;
    else
        return true;
}

//college info
switch ($option){
case 0: 
    

    $q = "insert into sinfo(CollegeName,CollegeCaption,CampusName,CampusCode,State,District,city,Street,PinCode,PhNo,Email,CollegeCode,Website,Estd)values('" . $data->collegeName . "','" . $data->collegeCaption . "','" . $data->campusName . "','" . $data->campusCode . "','" . $data->state . "','" . $data->district . "','" . $data->city . "','" . $data->street . "','" . $data->pinCode . "','" . $data->phoneNumber . "','" . $data->email . "','" . $data->collegeCode . "','" . $data->website . "','" . $data->estd . "')";
    $records = $conn->query($q);
    $response = '{';
    if ($records >0) {
        $response .='"message":"Inserted Successfully",';
        $response .= '"status":"success"';
    } else {
        $response .='"message":"Not Inserted",';
        $response .= '"status":"error"';
    }
    $response .= '}';
    echo $response;
    break;

case 1: 
    $q = "update sinfo set CollegeName='" . $data->collegeName . "',CollegeCaption='" . $data->collegeCaption . "',CampusName='" . $data->campusName . "',CampusCode='" . $data->campusCode . "',State='" . $data->state . "',District='" . $data->district . "',city='" . $data->city . "',Street='" . $data->street . "',PinCode='" . $data->pinCode . "',PhNo='" . $data->phoneNumber . "',Email='" . $data->email . "',Logo='" . $data->logo . "',CollegeCode='" . $data->collegeCode . "',Website='" . $data->website . "',Estd='" . $data->estd . "'where CollegeCode='" . $data->pkString . "'";
    $records = $conn->query($q);

    $response = '{';
    if ($records > 0) {
        $response .='"message":"Updated Successfully",';
        $response .= '"status":"success"';
    } else {
        $response .='"message":"Not Updated",';
        $response .= '"status":"error"';
    }
    $response .= '}';
    echo $response;
        break;

    
 case 2: 

    $q = "delete from sinfo where CollegeCode='" . $data->pkString . "'";
    $result = $conn->query($q);
    $response = '{';
    if($result > 0){   
    $response .='"message":"Deleted Successfully",';
    $response .= '"status":"success"';
    }else{
       $response .='"message":"Not Deleted",';
       $response .= '"status":"error"';
    }
    
    $response .= '}';
    echo $response;
        break;

 
case 3:    

    $q = "select * from sinfo";
    $records = $conn->query($q);
    $rows = $records->num_rows;
    if ($rows > 0) {
        $res = '';
        $x = 1;
        while ($row = $records->fetch_assoc()) {
            $res .='{';
            $res .= '"website":"' . $row["Website"] . '",';
            $res .='"campusName":"' . $row["CampusName"] . '",';
            $res .='"city":"' . $row["city"] . '",';
            $res .='"campusCode":"' . $row["CampusCode"] . '",';
            $res .='"collegeCode":"' . $row["CollegeCode"] . '",';
            $res .='"collegeCaption":"' . $row["CollegeCaption"] . '",';
            $res .='"collegeName":"' . $row["CollegeName"] . '",';
            $res .='"estd":"' . $row["Estd"] . '",';
            $res .='"phoneNumber":"' . $row["PhNo"] . '",';
            $res .='"street":"' . $row["Street"] . '",';
            $res .='"district":"' . $row["District"] . '",';
            $res .='"pinCode":"' . $row["PinCode"] . '",';
            $res .='"logo":"' . $row["Logo"] . '",';
            $res .='"state":"' . $row["State"] . '",';
            $res .='"email":"' . $row["Email"] . '"';
            $res .= '}';
            $res.= $x < $rows ? ',' : '';
            $x++;
        }
        $response = '{';
        $response .= '"status":"success",';
        $response .='"data":[' . $res . ']';
        $response .= '}';
        echo $response;
    } else
        echo "no records found";
        break;


//end college info
//subjects
case 4:    

    $q = "select * from subjects";
    $records = $conn->query($q);
    $rows = $records->num_rows;
    if ($rows > 0) {
        $res = '';
        $x = 1;
        while ($row = $records->fetch_assoc()) {
            $res .='{';
            $res .= '"aceYear":"' . $row["aceYear"] . '",';
            $res .='"cType":"' . $row["cType"] . '",';
            $res .='"subjects":"' . $row["subjects"] . '",';
            $res .='"semester":"' . $row["semester"] . '",';
            $res .='"section":"' . $row["section"] . '",';
            $res .='"id":"' . $row["id"] . '",';
            $res .='"class":"' . $row["stream"] . '"';

            $res .= '}';
            $res.= $x < $rows ? ',' : '';
            $x++;
        }
        $response = '{';
        $response .= '"status":"success",';
        $response .='"data":[' . $res . ']';
        $response .= '}';
        echo $response;
    } else
        echo "no records found";
        break;


case 5:    
    $q_countCheck = "select count(*)as count from subjects where cType='" . $data->cType . "'and stream='" . $data->className . "'and section='" . $data->section . "'and semester='" . $data->semester . "'and aceYear='" . $data->acdemicYear . "'";
    $rec_countCheck = $conn->query($q_countCheck);
    $row_countCheck = $rec_countCheck->fetch_assoc();
    $count = $row_countCheck['count'];
    $response = '{';
    if ($count == 0) {
        $q = "insert into subjects(cType,stream,section,semester,aceYear,subjects) values('" . $data->cType . "','" . $data->className . "','" . $data->section . "','" . $data->semester . "','" . $data->acdemicYear . "','" . $data->subjects . "')";
        $records = $conn->query($q);
        if ($records > 0) {

            $response .='"message":"Inserted Successfully",';
            $response .= '"status":"success"';
        } else {
            $response .='"message":"Not Inserted",';
            $response .= '"status":"error"';
        }
    } else {
        $response .='"message":"Data already existed",';
        $response .= '"status":"error"';
    }
    $response .= '}';
    echo $response;
 break;
case 6:    
    $q = "update subjects set cType='" . $data->cType . "',stream='" . $data->className . "',semester='" . $data->semester . "',section='" . $data->section . "',aceYear='" . $data->acdemicYear . "',subjects='" . $data->subjects . "' where id='" . $data->id . "'";
    $records = $conn->query($q);
    $response = '{';
    if($records>0)
    {
    $response .='"message":"Updated Successfully",';
    $response .= '"status":"success"';
    }  else {
        $response .='"message":" Not Updated ",';
    $response .= '"status":"error"';
    
    }
    $response .= '}';
    echo $response;
        break;


case 7:    
    $q = "delete from  subjects  where id='" . $data->id . "'";
    $records = $conn->query($q);
    $response = '{';
    if($records>0)
    {
    $response .='"message":"Deleted Successfully",';
    $response .= '"status":"success"';
    }  else {
    
       $response .='"message":" Not Deleted ",';
    $response .= '"status":"error"'; 
    }
    $response .= '}';
    echo $response;
        break;


//end subjects
//start exams
case 8:    

    $q = "select * from exams";
    $records = $conn->query($q);
    $rows = $records->num_rows;
    if ($rows > 0) {
        $res = '';
        $x = 1;
        while ($row = $records->fetch_assoc()) {
            $res .='{';
            $res .= '"exams":"' . $row["exams"] . '",';
            $res .='"aceYear":"' . $row["aceYear"] . '",';
            $res .='"cType":"' . $row["courseType"] . '",';
            $res .='"className":"' . $row["class"] . '",';
            $res .='"section":"' . $row["section"] . '",';
            $res .='"semester":"' . $row["semester"] . '",';
            $res .='"id":"' . $row["id"] . '"';

            $res .= '}';
            $res.= $x < $rows ? ',' : '';
            $x++;
        }
        $response = '{';
        $response .= '"status":"success",';
        $response .='"data":[' . $res . ']';
        $response .= '}';
        echo $response;
    } else
        echo "no records found";
        break;


case 9:    
    $q_countCheck = "select count(*)as count from exams where courseType='" . $data->cType . "'and class='" . $data->className . "'and section='" . $data->section . "'and semester='" . $data->semester . "'and aceYear='" . $data->acdemicYear . "'";
    $rec_countCheck = $conn->query($q_countCheck);
    $row_countCheck = $rec_countCheck->fetch_assoc();
    $count = $row_countCheck['count'];
    $response = '{';
    if ($count == 0) {
        $q = "insert into exams(courseType,class,section,semester,aceYear,exams)values('" . $data->cType . "','" . $data->className . "','" . $data->section . "','" . $data->semester . "','" . $data->acdemicYear . "','" . $data->exams . "')";
        $records = $conn->query($q);
        if ($records > 0) {

            $response .='"message":"Inserted Successfully",';
            $response .= '"status":"success"';
        } else {
            $response .='"message":"Not Inserted",';
            $response .= '"status":"error"';
        }
    } else {
        $response .='"message":"Data already existed",';
        $response .= '"status":"error"';
    }
    $response .= '}';
    echo $response;
    break;

case 10:    
    $q = "update exams set courseType='" . $data->cType . "',class='" . $data->className . "',section='" . $data->section . "',semester='" . $data->semester . "',aceYear='" . $data->acdemicYear . "',exams='" . $data->exams . "' where id='" . $data->id . "'";
    $records = $conn->query($q);
    $response = '{';
    if($records>0)
    {
    $response .='"message":"Updated Successfully",';
    $response .= '"status":"success"';
    }else{
        $response .='"message":" Not Updated ",';
    $response .= '"status":"error"';
    }
    $response .= '}';
    echo $response;
    break;

case 11:    
    $q = "delete from exams  where id='" . $data->id . "'";
    $records = $conn->query($q);
    $response = '{';
    if($records>0)
    {
    $response .='"message":"Deleted Successfully",';
    $response .= '"status":"success"';
    }else
    {
        $response .='"message":" Not Deleted ",';
    $response .= '"status":"error"';
    }
    $response .= '}';
    echo $response;
        break;


//end exams
//start Users
case 12:    

    $q = "select * from users";
    $records = $conn->query($q);
    $rows = $records->num_rows;
    if ($rows > 0) {
        $res = '';
        $x = 1;
        while ($row = $records->fetch_assoc()) {
            $res .='{';
            $res .= '"uname":"' . $row["user_name"] . '",';
            $res .= '"tabs":"' . $row["role"] . '",';
            $res .= '"id":"' . $row["id"] . '",';
            $res .='"pwd":"' . $row["password"] . '"';
            $res .= '}';
            $res.= $x < $rows ? ',' : '';
            $x++;
        }
        $response = '{';
        $response .= '"status":"success",';
        $response .='"data":[' . $res . ']';
        $response .= '}';
        echo $response;
    } else
        echo "no records found";
break;
case 13:
 
    $q = "insert into users(user_name,password,role,school)values('" . $data->uname . "','" . $data->pwd . "','" . $data->role . "','" . $data->school . "')";
    $records = $conn->query($q);
    $response = '{';
    if($records>0)
    {
    $response .='"message":"Inserted Successfully",';
    $response .= '"status":"success"';
    }else{
      $response .='"message":" Not Inserted ",';
    $response .= '"status":"error"';  
    }
    $response .= '}';
    echo $response;
        break;


case 14: 
    $q = "update users set user_name='" . $data->uname . "',password='" . $data->pwd . "',role='" . $data->role . "' where id='" . $data->id . "'";
    $records = $conn->query($q);
    $response = '{';
    if($records>0)
    {
    $response .='"message":"Updated Successfully",';
    $response .= '"status":"success"';
    }else{
        $response .='"message":" Not Updated ",';
    $response .= '"status":"error"';
    }
    $response .= '}';
    echo $response;
        break;

 case 5: 
    $q = "delete from users  where id='" . $data->id . "'";
    $records = $conn->query($q);
    $response = '{';
    if($records>0)
    {
    $response .='"message":"Deleted Successfully",';
    $response .= '"status":"success"';
    }else{
        $response .='"message":" Not Deleted ",';
        $response .= '"status":"error"';
    }
    $response .= '}';
    echo $response;
        break;


}
//end users
?>
