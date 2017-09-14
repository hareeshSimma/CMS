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
switch ($option)
{
case 0:
    $query = "select *from student where ctype='" . $data->cType . "' and class='" . $data->className . "' and semester='" . $data->semester . "' and section='" . $data->section . "'";
    $records = $conn->query($query);
    $rows = $records->num_rows;
    if ($rows > 0) {
        $res = '';
        $x = 1;
        while ($row = $records->fetch_assoc()) {
            $res .='{';
            $res .= '"admNo":"' . $row["admNo"] . '",';
            $res .='"phNo":"' . $row["phno"] . '",';
            $res .='"bgroup":"' . $row["BGroup"] . '",';
            $res .='"gname":"' . $row["gaurdian"] . '",';
            $res .= '"caste":"' . $row["Cast"] . '",';
            $res .='"mtongue":"' . $row["MTongue"] . '",';
            $res .='"emailid":"' . $row["email"] . '",';
            $res .='"religion":"' . $row["religion"] . '",';
            $res .= '"transport":"' . $row["transport"] . '",';
            $res .='"name":"' . $row["name"] . '",';
            $res .= '"gender":"' . $row["gender"] . '",';
            $res .='"fname":"' . $row["fname"] . '",';
            $res .='"aceYear":"' . $row["aceYear"] . '",';
            $res .= '"mname":"' . $row["mname"] . '",';
            $res .='"national":"' . $row["national"] . '",';
            $res .= '"iMarks":"' . $row["imarks"] . '",';
            $res .='"admType":"' . $row["admType"] . '",';
            $res .='"class":"' . $row["class"] . '",';
            $res .= '"section":"' . $row["section"] . '",';
            $res .='"cType":"' . $row["cType"] . '",';
            $res .= '"residence":"' . $row["residential"] . '",';
            $res .='"address":"' . $row["address"] . '",';
            $res .='"doa":"' . $row["doj"] . '",';
            $res .='"pqual":"' . $row["PQual"] . '",';
            $res .='"dob":"' . $row["dob"] . '",';
            $res .='"occup":"' . $row["Occu"] . '",';
            $res .='"Surname":"' . $row["surname"] . '",';
            $res .='"semester":"' . $row["semester"] . '"';
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

case 1:
    $admNo = 1;
    $adm_query = "SELECT admNo FROM student order by admNo desc limit 1";
    $rec_admNoCheck = $conn->query($adm_query);
    $admNo_count = $rec_admNoCheck->fetch_assoc();
    $admNo = $admNo_count['admNo'];
    $admNo=$admNo+1;
     $query = "insert into student(admNo,admType,cType,class,semester,section,surname,name,fname,mname,gender,address,dob,doj,iMarks,phno,aceYear,MTongue,Cast,BGroup,PQual,Occu,residential,email,transport,religion,national,gaurdian) values('" . $admNo . "','" . $data->admType . "','" . $data->cType . "','" . $data->className . "','" . $data->semester . "','" . $data->section . "','".$data->Surname."','" . $data->name . "','" . $data->fname . "','" . $data->mname . "','" . $data->gender . "','" . $data->address . "','" . $data->dob . "','" . $data->doa . "','" . $data->iMarks . "','" . $data->phno . "','" . $data->acdemicYear . "','" . $data->mtongue . "','" . $data->caste . "','" . $data->bgroup . "','" . $data->pqual . "','" . $data->occup . "','" .$data->residence."','" . $data->emailid . "','" . $data->transport . "','" . $data->religion . "','" . $data->national . "','" . $data->gname . "')";
    // $query = "insert into student(admNo,admType,cType,class,semester,section,surname,name,fname,mname,gender,address,dob,doj,iMarks,phno,aceYear,MTongue,Cast,BGroup,PQual,Occu,residential,email,transport,religion,national,gaurdian) values('" . $admNo . "','" . $data->admType . "','" . $data->cType . "','" . $data->className . "','" . $data->semester . "','" . $data->section . "','".$data->surName."','" . $data->name . "','" . $data->fname . "','" . $data->mname . "','" . $data->gender . "','" . $data->residence . "','" . $data->address . "','" . $data->acdemicYear . "','" . $data->doa . "','" . $data->phno . "','" . $data->iMarks . "','" . $data->Surname . "','" . $data->mtongue . "','" . $data->caste . "','" . $data->bgroup . "','" . $data->pqual . "','" . $data->occup . "','" . $data->emailid . "','" . $data->national . "','" . $data->religion . "','" . $data->transport . "','" . $data->gname . "')";

        $records = $conn->query($query);

    $response = '{';
    if ($records > 0) {
        $response .= '"message":"Inserted Successfully",';
        $response .= '"status":"success"';
    } else {
        $response .= '"message":"NOt Inserted ",';
        $response .= '"status":"error"';
    }


    $response .= '}';
    echo $response;
    break;

case 2:
    $query = "update student set admType='" . $data->admType . "',ctype='" . $data->cType . "',class='" . $data->className .
            "',semester='" . $data->semester . "',section='" . $data->section . "',surname='" . $data->Surname .
            "',name='" . $data->name . "',fname='" . $data->fname . "',mname='" . $data->mname .
            "',gender='" . $data->gender . "',address='" . $data->address . "',dob='" . $data->dob .
            "',doj='" . $data->doa . "',iMarks='" . $data->iMarks . "',phno='" . $data->phno . "',aceYear='" . $data->acdemicYear .
            "',MTongue='" . $data->mtongue . "',Cast='" . $data->caste . "',BGroup='" . $data->bgroup .
            "',PQual='" . $data->pqual . "',Occu='" . $data->occup . "',residential='" . $data->residence .
            "',email='" . $data->emailid . "',transport='" . $data->transport . "',religion='" . $data->religion .
            "',national='" . $data->national . "',gaurdian='" . $data->gname . "'where admNo=" . $data->admNo;

    $records = $conn->query($query);

    $response = '{';
    if ($records > 0) {
        $response .= '"message":"Student Updated Successfully",';
        $response .= '"status":"success"';
    } else {
        $response .= '"message":"Student Not Updated ",';
        $response .= '"status":"error"';
    }


    $response .= '}';
    echo $response;
    break;

case 3:
    $query = "delete from student where admNo=" . $data->admNo;
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
}
?>