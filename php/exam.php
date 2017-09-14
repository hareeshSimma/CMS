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

switch ($option) {
    case 1:
        //get TimeTable Data
        $query = "select *from timetable where courseType='" . $data->cType . "' and className='" . $data->className . "' and section='" . $data->section . "' and semester='" . $data->semester . "' and test='" . $data->testName . "'";
        $records = $conn->query($query);
        $rows = $records->num_rows;
        $res = '';
        if ($rows > 0) {
            $x = 1;
            while ($row = $records->fetch_assoc()) {
                $res .='{';
                $res .= '"id":"' . $row["id"] . '",';
                $res .='"subject":"' . $row["subject"] . '",';
                $res .='"date":"' . $row["date"] . '",';
                $res .='"sTime":"' . $row["startTime"] . '",';
                $res .= '"eTime":"' . $row["endTime"] . '"';
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
        else{
            echo 'No Records Found';
        }
        break;
    case 2:
        //timeTable insert
        $query = "insert into timetable(courseType,className,section,semester,test,subject,date,startTime,endTime) values('" . $data->cType . "','" . $data->className . "','" . $data->section . "','" . $data->semester . "','" . $data->testName . "','" . $data->subjects . "','" . $data->dates . "','" . $data->startTimes . "','" . $data->endTimes . "')";
        $records = $conn->query($query);

        $response = '{';
        if ($records > 0) {
            $response .= '"message":"Inserted Successfully",';
            $response .= '"status":"success"';
        } else {
            $response .= '"message":"Not Inserted",';
            $response .= '"status":"error"';
        }

        $response .= '}';
        echo $response;
        break;
    case 3:
        //timeTable update
        $query = "update timetable set courseType='" . $data->cType . "',className='" . $data->className . "',section='" . $data->section .
                "',semester='" . $data->semester . "',test='" . $data->testName . "',subject='" . $data->subjects . "',date='" . $data->dates .
                "',startTime='" . $data->startTimes . "',endTime='" . $data->endTimes . "' where id='" . $data->pkVal . "'";
        $records = $conn->query($query);

        $response = '{';
        if ($records > 0) {
            $response .= '"message":"Updated Successfully",';
            $response .= '"status":"success"';
        } else {
            $response .= '"message":"Not Updated",';
            $response .= '"status":"error"';
        }

        $response .= '}';
        echo $response;
        break;
    case 4:
        //timeTale delete
        $query = "delete from timetable where id='" . $data->pkVal . "'";
        $records = $conn->query($query);
        $response = '{';
        if ($records > 0) {
            $response .= '"message":"Deleted Successfully",';
            $response .= '"status":"success"';
        } else {
            $response .= '"message":"Not Deleted",';
            $response .= '"status":"error"';
        }

        $response .= '}';
        echo $response;
        break;
    case 5:
        //marks list different
        if ($data->testName != null || $data->testName != '')
            $query = "select *from marks   where courseType='" . $data->cType . "' and className='" . $data->className . "' and section='" . $data->section . "' and  semester='" . $data->semester . "'and test='" . $data->testName . "'and admNo='" . $data->admNo . "'";
        else
            $query = "select *from marks   where courseType='" . $data->cType . "' and className='" . $data->className . "' and section='" . $data->section . "' and  semester='" . $data->semester . "'and admNo='" . $data->admNo . "'";

        $records = $conn->query($query);
        $rows = $records->num_rows;
        $res = '';
        if ($rows > 0) {
            $x = 1;
            while ($row = $records->fetch_assoc()) {
                $res .='{';
                $res .= '"id":"' . $row["id"] . '",';
                $res .='"courseType":"' . $row["courseType"] . '",';
                $res .='"className":"' . $row["className"] . '",';
                $res .='"section":"' . $row["section"] . '",';
                $res .= '"semester":"' . $row["semester"] . '",';
                $res .= '"admNo":"' . $row["admNo"] . '",';
                $res .='"name":"' . $row["name"] . '",';
                $res .='"test":"' . $row["test"] . '",';
                $res .='"marks":"' . $row["marks"] . '",';
                $res .= '"maxMarks":"' . $row["maxMarks"] . '",';
                $res .='"total":"' . $row["total"] . '",';
                $res .= '"percent":"' . $row["percent"] . '"';
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
         else{
            echo 'No Records Found';
        }
        break;
    case 6:
        //insert marks
        $q_countCheck = "select count(*)as count from marks where admNo='" . $data->admNo . "'";
    $rec_countCheck = $conn->query($q_countCheck);
    $row_countCheck = $rec_countCheck->fetch_assoc();
    $count = $row_countCheck['count'];
    $response = '{';
    if ($count == 0){
        $query = "insert into marks(courseType,className,section,semester,admNo,name,test,marks,maxMarks,total,percent) values('" . $data->cType . "','" . $data->className . "','" . $data->section . "','" . $data->semester . "','" . $data->admNo . "','" . $data->name . "','" . $data->testName . "','" . $data->marks . "','" . $data->maxMarks . "','" . $data->total . "','" . $data->percent . "')";
        $records = $conn->query($query);

       
        if ($records > 0) {
            $response .= '"message":"Inserted Successfully",';
            $response .= '"status":"success"';
        } else {
            $response .= '"message":"Not Inserted",';
            $response .= '"status":"error"';
        }
    }
    else {
        $response .='"message":"Data already existed",';
        $response .= '"status":"error"';
    }
        $response .= '}';
        echo $response;
        break;
    case 7:
        //update makrs
        $query = "update marks set courseType='" . $data->cType . "',className='" . $data->className . "',section='" . $data->section .
                "',semester='" . $data->semester . "',admNo='" . $data->admNo . "',name='" . $data->name .
                "',test='" . $data->testName . "',marks='" . $data->marks . "',maxMarks='" . $data->maxMarks . "',total='" . $data->total . "',percent='" . $data->percent . "' where id='" . $data->pkVal . "'";
        $records = $conn->query($query);

        $response = '{';
        if ($records > 0) {
            $response .= '"message":"Updated Successfully",';
            $response .= '"status":"success"';
        } else {
            $response .= '"message":"Not Updated",';
            $response .= '"status":"error"';
        }

        $response .= '}';
        echo $response;
        break;
    case 8:
        //delete marks
        $query = "delete from marks where id='" . $data->id . "'";
        $records = $conn->query($query);
        $response = '{';
        if ($records > 0) {
            $response .= '"message":"Deleted Successfully",';
            $response .= '"status":"success"';
        } else {
            $response .= '"message":"Not Deleted",';
            $response .= '"status":"error"';
        }

        $response .= '}';
        echo $response;


        break;
    case 9:
        //marks list 
        $query = "select *from marks   where courseType='" . $data->cType . "' and className='" . $data->className . "' and section='" . $data->section . "' and  semester='" . $data->semester . "'and test='" . $data->testName . "'";

        $records = $conn->query($query);
        $rows = $records->num_rows;
        $res = '';
        if ($rows > 0) {
            $x = 1;
            while ($row = $records->fetch_assoc()) {
                $res .='{';
                $res .= '"id":"' . $row["id"] . '",';
                $res .='"courseType":"' . $row["courseType"] . '",';
                $res .='"className":"' . $row["className"] . '",';
                $res .='"section":"' . $row["section"] . '",';
                $res .= '"semester":"' . $row["semester"] . '",';
                $res .= '"admNo":"' . $row["admNo"] . '",';
                $res .='"name":"' . $row["name"] . '",';
                $res .='"test":"' . $row["test"] . '",';
                $res .='"marks":"' . $row["marks"] . '",';
                $res .= '"maxMarks":"' . $row["maxMarks"] . '",';
                $res .='"total":"' . $row["total"] . '",';
                $res .= '"percent":"' . $row["percent"] . '"';
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
 else{
            echo 'No Records Found';
        }
        break;
}
?>