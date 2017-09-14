<?php

$postdata = file_get_contents("php://input");
$data = json_decode($postdata);
// include database and object files 
include_once '../database/database.php';
// Create connection
$db = new DB();
$conn = $db->getConnection();

$option = $data->optId;
//function authCheck(){
//     session_start();
//   $cURole=$_SESSION["role"];
//   if($cURole !='Admin')
//       return false;
//   else
//       return true;
//   
//}
switch ($option){
case 0: 
    $query = "select * from employee";
    $records = $conn->query($query);
    $rows = $records->num_rows;
    if ($rows > 0) {
        $res = '';
        $x = 1;
        while ($row = $records->fetch_assoc()) {
            $res .='{';
            $res .= '"maternity":"' . $row["MaternityLeaves"] . '",';
            $res .='"acNo":"' . $row["AccountNumber"] . '",';
            $res .='"vehicle":"' . $row["vehicle"] . '",';
            $res .='"desig":"' . $row["Designation"] . '",';
            $res .= '"freq":"' . $row["PayFreq"] . '",';
            $res .='"empId":"' . $row["empId"] . '",';
            $res .='"emailid":"' . $row["email"] . '",';
            $res .='"currency":"' . $row["Currency"] . '",';
            $res .= '"id":"' . $row["id"] . '",';
            $res .='"qualification":"' . $row["qualification"] . '",';
            $res .= '"maritalstatus":"' . $row["maritalstatus"] . '",';
            $res .='"previousorg":"' . $row["previousorg"] . '",';
            $res .='"component":"' . $row["SalComp"] . '",';
            $res .= '"name":"' . $row["name"] . '",';
            $res .='"casual":"' . $row["CasualLeaves"] . '",';
            $res .= '"gender":"' . $row["gender"] . '",';
            $res .='"bank":"' . $row["BankName"] . '",';
            $res .='"experience":"' . $row["experience"] . '",';
            $res .= '"salary":"' . $row["salary"] . '",';
            $res .='"acType":"' . $row["AccountType"] . '",';
            $res .= '"employee":"' . $row["employeetype"] . '",';
            $res .= '"ifsc":"' . $row["IfscCode"] . '",';
            $res .= '"phonenumber":"' . $row["phoneNo"] . '",';
            $res .= '"slRemain":"' . $row["slRemain"] . '",';
            $res .= '"photo":"' . $row["photo"] . '",';
            $res .= '"clRemain":"' . $row["clRemain"] . '",';
            $res .= '"bloodgrp":"' . $row["bloodgrp"] . '",';
            $res .= '"amt":"' . $row["Amount"] . '",';
            $res .= '"address":"' . $row["address"] . '",';
            $res .= '"dob":"' . $row["dob"] . '",';
            $res .= '"sick":"' . $row["SickLeaves"] . '",';
            $res .= '"mlRemain":"' . $row["MaternityLeaves"] . '",';
            $res .= '"comments":"' . $row["Comments"] . '",';

            $res .='"doj":"' . $row["doj"] . '"';

            $res .= '}';
            $res.= $x < $rows ? ',' : '';
            $x++;
        }
        $response = '{';
        $response .= '"status":"success",';
        $response .='"data":[' . $res . ']';
        $response .= '}';
        echo $response;
    }
    break;
 case 1: 
     $empId = 0;
    $empId_query = "SELECT empId FROM employee order by empId desc limit 1";
    $rec_empIdCheck = $conn->query($empId_query);
    $empId_count = $rec_empIdCheck->fetch_assoc();
    $empId = $empId_count['empId'];
    $empId=$empId+1;
    $query = "insert into employee (employeetype,name,dob,gender,qualification,experience,phoneNo,salary,email,doj,maritalstatus,previousorg,bloodgrp,address,vehicle,photo,empId,Designation,SalComp,PayFreq,Currency,CasualLeaves,MaternityLeaves,SickLeaves,Amount,Comments,AccountNumber,AccountType,BankName,IfscCode,clRemain,slRemain,mlRemain) values('".$data->employee."','".$data->name."','".$data->dob."','".$data->gender."','".$data->qualification."','".$data->experience."','".$data->phonenumber."','".$data->salary."','".$data->emailid."','".$data->doj."','".$data->maritalstatus."','".$data->previousorg."','".$data->bloodgrp."','".$data->address."','".$data->vehicle."','".$data->photo."','".$empId."','".$data->desig."','".$data->component."','".$data->freq."','".$data->currency."','".$data->casual."','".$data->maternity."','".$data->sick."','".$data->amt."','".$data->comments."','".$data->acNo."','".$data->acType."','".$data->bank."','".$data->ifsc."','".$data->clRemain."','".$data->slRemain."','".$data->mlRemain."')";
    $records = $conn->query($query);
   
    $response = '{';
    if($records > 0){
    $response .= '"message":"Inserted Successfully",';
    $response .= '"status":"success"';
    }else{
       $response .= '"message":"Not Inserted",';
    $response .= '"status":"error"'; 
    }

    $response .= '}';
    echo $response;
    break;
 case 2:
    $query = "update employee set employeetype='" . $data->employee . "',name='" . $data->name . "',dob='" . $data->dob . "',gender='" . $data->gender . "',qualification='" . $data->qualification . "',experience='" . $data->experience . "',phoneno='" . $data->phonenumber . "',salary='" . $data->salary . "',email='" . $data->emailid . "',doj='" . $data->doj . "',maritalstatus='" . $data->maritalstatus . "',previousorg='" . $data->previousorg . "',bloodgrp='" . $data->bloodgrp . "',address='" . $data->address . "',vehicle='" . $data->vehicle . "',photo='" . $data->photo . "',Designation='" . $data->desig . "',SalComp='" . $data->salary . "',PayFreq='" . $data->freq . "',Currency='" . $data->currency . "',CasualLeaves='" . $data->casual . "',MaternityLeaves='" . $data->maternity . "',SickLeaves='" . $data->sick . "',Amount='" . $data->amt . "',Comments='" . $data->comments . "',AccountNumber='" . $data->acNo . "',AccountType='" . $data->acType . "',BankName='" . $data->bank . "',IfscCode='" . $data->ifsc . "'where empId=" . $data->pkValue . "";


    $records = $conn->query($query);

    $response = '{';
    if($records > 0){
    $response .= '"message":"Employee Updated Successfully",';
    $response .= '"status":"success"';
    }else{
        $response .= '"message":"Not updated",';
        $response .= '"status":"error"';
    }

    $response .= '}';
    echo $response;
    break;
 case 3: 
    $query = "delete from employee where empId='" . $data->pkValue . "'";
    $records = $conn->query($query);

    $response = '{';
    
    if($records > 0){
    $response .= '"message":"Deleted Successfully",';
    $response .= '"status":"success"';
    }else{
        $response .= '"message":"Not Deleted",';
        $response .= '"status":"error"';
    }

    $response .= '}';
    echo $response;
    break;
}
?>