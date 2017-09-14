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

//hostel info 
switch ($option) {
    case 0: 
            $q = "select * from libaddbook";
            $records = $conn->query($q);
            $rows = $records->num_rows;
            if ($rows > 0) {
                $res = '';
                $x = 1;
                while ($row = $records->fetch_assoc()) {
                    $res .='{';
                    $res .= '"quantity":"' . $row["quantity"] . '",';
                    $res .='"year":"' . $row["year"] . '",';
                    $res .='"author":"' . $row["bookAothor"] . '",';
                    $res .='"cType":"' . $row["courseType"] . '",';
                    $res .='"className":"' . $row["className"] . '",';
                    $res .='"bookName":"' . $row["bookName"] . '",';
                    $res .='"bookIds":"' . $row["bookIds"] . '",';
                    $res .='"supplier":"' . $row["supplier"] . '",';
                    $res .='"publisher":"' . $row["publisher"] . '",';
                    $res .='"semester":"' . $row["semName"] . '",';
                    $res .='"id":"' . $row["id"] . '",';
                    $res .='"yop":"' . $row["yearOfPub"] . '",';
                    $res .='"bookTitle":"' . $row["bookTitle"] . '"';
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
        
    case 1: 
            $q = "insert into libaddbook(bookTitle,bookAothor,publisher,yearOfPub,quantity,bookName) values('" . $data->bookTitle . "','" . $data->author . "','" . $data->publisher . "','" . $data->yop . "','" . $data->quantity . "','" . $data->bookName . "')";
            $records = $conn->query($q);
            $response = '{';
            if ($records > 0) {
                $response .='"message":"Inserted Successfully",';
                $response .= '"status":"success"';
            } else {
                $response .= '"message":"Not Inserted",';
                $response .= '"status":"error"';
            }

            $response .= '}';
            echo $response;
            break;
        

    case 2: 

            $q = "update libaddbook set bookTitle ='" . $data->bookTitle . "',bookAothor='" . $data->author . "',publisher='" . $data->publisher . "',yearOfPub='" . $data->yop . "',bookName='" . $data->bookName . "',quantity='" . $data->quantity . "' where id=" . $data->id . "";
            $records = $conn->query($q);
            $response = '{';
            if ($records > 0) {
                $response .='"message":"Updated Successfully",';
                $response .= '"status":"success"';
            } else {
                $response .= '"message":"Not Updated",';
                $response .= '"status":"error"';
            }

            $response .= '}';
            echo $response;
            break;
        
    case 3: 

            $q = "delete from libaddbook where id='" . $data->id . "'";
            $result = $conn->query($q);
            $response = '{';
            if ($result > 0) {
                $response .='"message":"Deleted Successfully",';
                $response .= '"status":"success"';
            } else {
                $response .= '"message":"Not Deleted",';
                $response .= '"status":"error"';
            }
            $response .= '}';
            echo $response;
            break;
        
//end of add book

    case 4: 
            $q = "select * from libissuedbooks";
            $records = $conn->query($q);
            $rows = $records->num_rows;
            if ($rows > 0) {
                $res = '';
                $x = 1;
                while ($row = $records->fetch_assoc()) {
                    $res .='{';
                    $res .= '"id":"' . $row["id"] . '",';
                    $res .='"user":"' . $row["userType"] . '",';
                    $res .='"cType":"' . $row["courseType"] . '",';
                    $res .='"className":"' . $row["clsName"] . '",';
                    $res .= '"semester":"' . $row["semester"] . '",';
                    $res .='"section":"' . $row["section"] . '",';
                    $res .='"bookTitle":"' . $row["bookName"] . '",';
                    $res .='"admNo":"' . $row["admNo"] . '",';
                    $res .= '"empId":"' . $row["empId"] . '",';
                    $res .='"date1":"' . $row["b1Date"] . '",';
                    $res .='"date2":"' . $row["b2Date"] . '",';
                    $res .='"date3":"' . $row["b3Date"] . '",';
                    $res .='"name":"' . $row["name"] . '",';

                    $res .='"nameEmp":"' . $row["nameEmp"] . '"';

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
            $q = "insert into libissuedbooks(userType,courseType,clsName,semester,section,bookName,admNo,empId,b1Date,b2Date,b3Date,name,nameEmp)values('" . $data->user . "','" . $data->cType . "','" . $data->className . "','" . $data->semester . "','" . $data->section . "','" . $data->bookTitle . "','" . $data->admNo . "','" . $data->empId . "','" . $data->date1 . "','" . $data->date2 . "','" . $data->date3 . "','".$data->name . "','".$data->nameEmp . "')";
            $records = $conn->query($q);
            $response = '{';
            if ($records > 0) {
                $response .='"message":"Inserted Successfully",';
                $response .= '"status":"success"';
            } else {
                $response .= '"message":"Not Inserted",';
                $response .= '"status":"error"';
            }
            $response .= '}';
            echo $response;
            break;
        
    case 6: 
            $q = "update libissuedbooks set userType ='" . $data->user . "',courseType='" . $data->cType . "',clsName='" . $data->className . "',semester='" . $data->semester . "',section='" . $data->section . "',bookName='" . $data->bookTitle . "',admNo='" . $data->admNo . "',empId='" . $data->empId ."',b1Date='" . $data->date1 . "',b2Date='" . $data->date2 . "',b3Date='" . $data->date3 . "',name='" . $data->name . "',nameEmp='" . $data->nameEmp . "'where id=" . $data->id ."";
 $records = $conn->query($q);

            $response = '{';
            if ($records > 0) {
                $response .='"message":"Updated Successfully",';
                $response .= '"status":"success"';
            } else {
                $response .= '"message":"Not Updated",';
                $response .= '"status":"error"';
            }
            $response .= '}';
            echo $response;
            break;
        
    case 7: 
            $q = "delete from libissuedbooks  where id='" . $data->id . "'";
            $records = $conn->query($q);
            $response = '{';
            if ($records > 0) {
                $response .='"message":"Deleted Successfully",';
                $response .= '"status":"success"';
            } else {
                $response .= '"message":"Not Deleted",';
                $response .= '"status":"error"';
            }
            $response .= '}';
            echo $response;
            break;
        

//start 
    case 8: 
            $q = "SELECT * FROM libissuedbooks WHERE userType='Student' and courseType='" . $data->cType . "' and clsName='" . $data->className . "' and semester='" . $data->semester . "' and section='" . $data->section . "' and b2Date<='" . $data->date2 . "' and bookName IS NOT NULL";
                
            $records = $conn->query($q);
            $rows = $records->num_rows;
            if ($rows > 0) {
                $res = '';
                $x = 1;
                while ($row = $records->fetch_assoc()) {
                    $res .='{';
                    $res .= '"id":"' . $row["id"] . '",';
                    $res .='"user":"' . $row["userType"] . '",';
                    $res .='"cType":"' . $row["courseType"] . '",';
                    $res .='"className":"' . $row["clsName"] . '",';
                    $res .= '"semester":"' . $row["semester"] . '",';
                    $res .='"section":"' . $row["section"] . '",';
                    $res .='"bookTitle":"' . $row["bookName"] . '",';
                    $res .='"admNo":"' . $row["admNo"] . '",';
                    $res .= '"name":"' . $row["name"] . '",';
                    $res .='"date2":"' . $row["b2Date"] . '"';
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
            $q = "SELECT * FROM libissuedbooks WHERE userType='Staff' and bookName IS NOT NULL";
                
            $records = $conn->query($q);
            $rows = $records->num_rows;
            if ($rows > 0) {
                $res = '';
                $x = 1;
                while ($row = $records->fetch_assoc()) {
                    $res .='{';
                    $res .= '"id":"' . $row["id"] . '",';
                    $res .='"user":"' . $row["userType"] . '",';
                    $res .='"cType":"' . $row["courseType"] . '",';
                    $res .='"className":"' . $row["clsName"] . '",';
                    $res .= '"semester":"' . $row["semester"] . '",';
                    $res .='"section":"' . $row["section"] . '",';
                    $res .='"bookTitle":"' . $row["bookName"] . '",';
                    $res .='"admNo":"' . $row["admNo"] . '",';
                    $res .= '"empId":"' . $row["empId"] . '",';
                    $res .='"nameEmp":"' . $row["nameEmp"] . '"';
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
        
    case 10: 
             $q = "SELECT * FROM libissuedbooks WHERE userType='Student' and courseType='" . $data->cType . "' and clsName='" . $data->className .  "' and semester='" . $data->semester . "' and section='" . $data->section . "' and bookName IS NOT NULL";
                
            $records = $conn->query($q);
            $rows = $records->num_rows;
            if ($rows > 0) {
                $res = '';
                $x = 1;
                while ($row = $records->fetch_assoc()) {
                    $res .='{';
                    $res .= '"id":"' . $row["id"] . '",';
                    $res .='"user":"' . $row["userType"] . '",';
                    $res .='"cType":"' . $row["courseType"] . '",';
                    $res .='"className":"' . $row["clsName"] . '",';
                    $res .= '"semester":"' . $row["semester"] . '",';
                    $res .='"section":"' . $row["section"] . '",';
                    $res .='"bookTitle":"' . $row["bookName"] . '",';
                    $res .='"admNo":"' . $row["admNo"] . '",';
                    $res .= '"empId":"' . $row["empId"] . '",';
                    $res .='"name":"' . $row["name"] . '"';
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
        
//    case 11: {
//            $q = "delete from hststuallot  where id='" . $data->id . "'";
//            $records = $conn->query($q);
//            $response = '{';
//            if ($records > 0) {
//                $response .='"message":"Deleted Successfully",';
//                $response .= '"status":"success"';
//            } else {
//                $response .= '"message":"Not Deleted",';
//                $response .= '"status":"error"';
//            }
//
//            $response .= '}';
//            echo $response;
//            break;
//        }
}
//end student allot
?>

