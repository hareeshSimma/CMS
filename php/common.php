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
    
   $q="select * from news" ;
       $records=$conn->query($q);
       $rows=$records->num_rows;
       if($rows>0)
       {
           $res='';
           $x=1;
          while($row=$records->fetch_assoc())
          {
             $res .='{';
             $res .= '"news":"'    . $row["msg"] . '",';
             $res .='"ndate":"'     .$row["dateNews"].'",';
             $res .='"id":"'  .$row["id"].'"' ;
             $res .= '}';
             $res.= $x< $rows ? ',':'' ;
                $x++;
          }
          $response='{';
          $response .= '"status":"success",';
          $response .='"data":['.$res.']';
          $response .= '}';
          echo $response;
       }else{
           echo "no records found";
       }
       
       break;
    
    
    case 1:    
   $query="insert into news(msg,dateNews) values('".$data->news."','".$data->ndate."')";
   $records=$conn->query($query);

   $response='{';
          $response .= '"message":"Inserted Successfully",';
          $response .= '"status":"success"';
         
          $response .= '}';
          echo $response;
          break;

    case 2:    
     $query="update news set msg='".$data->news."' , dateNews='".$data->ndate."' where id='".$data->id."'";
    $records=$conn->query($query);

   $response='{';
          $response .= '"message":" Updated Successfully",';
          $response .= '"status":"success"';
         
          $response .= '}';
          echo $response;
          break;

    case 3:    
   $query="delete from news where id='".$data->id."'";
   $records=$conn->query($query);

   $response='{';
          $response .= '"message":"Deleted Successfully",';
          $response .= '"status":"success"';
         
          $response .= '}';
          echo $response;
          break;

    case 4:    
    //get cType
      $commonData='';
      
       $res_banks='';
       $res_classes='';
       $res_ctypes='';
       $res_districts='';
       $res_exams='';
       $res_sections='';
       $res_semester='';
       $res_states='';
       $res_subjects='';
      $q_ctype="select *from ctype_new" ;
       $rec_ctype=$conn->query($q_ctype);
       $rows_ctype=$rec_ctype->num_rows;
       if($rows_ctype>0)
       {
           $res='';
           $x=1;
          while($row=$rec_ctype->fetch_assoc())
          {
             $res .='{';
             $res .= '"cType":"'    . $row["courseType"] . '"';
             $res .= '}';
             $res.= $x< $rows_ctype ? ',':'' ;
                $x++;
          }
          $res_ctypes .='"ctypes":['.$res.'],';
          
       }else{
          
           $res_ctypes .='"ctypes":[],';
       }
       //end ctype
       //start class
       $q_class="select *from classes_new";
       $rec_class=$conn->query($q_class);
       $rows_class=$rec_class->num_rows;
       if($rows_class>0)
       {
           $res='';
           $x=1;
          while($row=$rec_class->fetch_assoc())
          {
             $res .='{';
             $res .= '"class":"'    . $row["class"] . '"';
             $res .= '}';
             $res.= $x< $rows_class ? ',':'' ;
                $x++;
          }
          $res_classes .='"classes":['.$res.'],';
          
       }else{
            
           $res_classes .='"classes":[],';
       }
        //end class
        //start section
       
       $q_section="select *from section_new";
       $rec_section=$conn->query($q_section);
       $rows_section=$rec_section->num_rows;
       if($rows_section>0)
       {
           $res='';
           $x=1;
          while($row=$rec_section->fetch_assoc())
          {
             $res .='{';
             $res .= '"section":"'    . $row["section"] . '"';
             $res .= '}';
             $res.= $x< $rows_section ? ',':'' ;
                $x++;
          }
          $res_sections .='"sections":['.$res.'],';
          
       }else{
           $res_sections .='"sections":[],';
       }
      
       //end section
       
       //start subjects
       
       $q_subjects="select *from subjectslist_new";
       $rec_subjects=$conn->query($q_subjects);
       $rows_subjects=$rec_subjects->num_rows;
       if($rows_subjects>0)
       {
           $res='';
           $x=1;
          while($row=$rec_subjects->fetch_assoc())
          {
             $res .='{';
             $res .= '"subject":"'    . $row["subject"] . '",';
             $res .= '"code":"'    . $row["subCode"] . '"';

             $res .= '}';
             $res.= $x< $rows_subjects ? ',':'' ;
                $x++;
          }
          $res_subjects .='"subjects":['.$res.'],';
          
       }else{
           $res_subjects.='"subjects":[],';
       }
      
       //end subjects
       
       //start exam_new
       
       $q_exams="select *from exams_new";
       $rec_exams=$conn->query($q_exams);
       $rows_exams=$rec_exams->num_rows;
       if($rows_exams>0)
       {
           $res='';
           $x=1;
          while($row=$rec_exams->fetch_assoc())
          {
             $res .='{';
             $res .= '"exam":"'    . $row["exam"] . '",';
             $res .= '"code":"'    . $row["examCode"] . '"';

             $res .= '}';
             $res.= $x< $rows_exams ? ',':'' ;
                $x++;
          }
          $res_exams .='"exams":['.$res.'],';
          
       }else{
           $res_exams.='"exams":[],';
       }
      
       //end exams
       
       //start state
       
       $q_states="select *from states";
       $rec_states=$conn->query($q_states);
       $rows_states=$rec_states->num_rows;
       if($rows_states>0)
       {
           $res='';
           $x=1;
          while($row=$rec_states->fetch_assoc())
          {
             $res .='{';
             $res .= '"stateName":"'    . $row["stateName"] . '"';
             

             $res .= '}';
             $res.= $x< $rows_states ? ',':'' ;
                $x++;
          }
          $res_states .='"states":['.$res.'],';
          
       }else{
           $res_states.='"states":[],';
       }
      
       //end states
       
       //start district
       
       $q_districts="select *from districts";
       $rec_districts=$conn->query($q_districts);
       $rows_districts=$rec_districts->num_rows;
       if($rows_districts>0)
       {
           $res='';
           $x=1;
          while($row=$rec_districts->fetch_assoc())
          {
             $res .='{';
             $res .= '"districtName":"'    . $row["districtName"] . '"';
             $res .= '}';
             $res.= $x< $rows_districts ? ',':'' ;
                $x++;
          }
          $res_districts.='"districts":['.$res.'],';
          
       }else{
         
           $res_districts.='"districts":[],';
       }
      
       //end district
       
        //start banks
       
       $q_banks="select *from banks";
       $rec_banks=$conn->query($q_banks);
       $rows_banks=$rec_banks->num_rows;
       if($rows_banks>0)
       {
           $res='';
           $x=1;
          while($row=$rec_banks->fetch_assoc())
          {
             $res .='{';
             $res .= '"bankName":"'    . $row["bankName"] . '"';
             $res .= '}';
             $res.= $x< $rows_banks ? ',':'' ;
                $x++;
          }
          $res_banks.='"banks":['.$res.'],';
          
       }else{
           $res_banks.='"banks":[],';
       }
      
       //end banks
       
        //start semester
       
       $q_semester="select *from semesters";
       $rec_semester=$conn->query($q_semester);
       $rows_semester=$rec_semester->num_rows;
       if($rows_semester>0)
       {
           $res='';
           $x=1;
          while($row=$rec_semester->fetch_assoc())
          {
             $res .='{';
             $res .= '"semester":"'    . $row["semName"] . '"';
             $res .= '}';
             $res.= $x< $rows_semester ? ',':'' ;
                $x++;
          }
          $res_semester.='"semesters":['.$res.'],';
          
       }else{
            
           $res_semester.='"semesters":[],';
       }
      
       //end semesters
       $commonData.='{';
       $commonData.=$res_banks;
       $commonData.=$res_classes;
       $commonData.=$res_ctypes;
       $commonData.=$res_districts;
       $commonData.=$res_exams;
       $commonData.=$res_sections;
       $commonData.=$res_semester;
       $commonData.=$res_states;
       $commonData.=$res_subjects;
       $commonData .= '"status":"success"';
       $commonData.='}';
       echo $commonData;
       break;

    case 5:
    
     $exam_query="select *from exams where courseType='".$data->cType."' and class='".$data->className."' and section='".$data->section."' and semester='".$data->semester."'";
     $sub_query="select *from subjects where cType='".$data->cType."' and stream='".$data->className."' and section='".$data->section."' and semester='".$data->semester."'";
     $rec_exams = $conn->query($exam_query);
     $rows_exams = $rec_exams->num_rows;
     $res='{';
    if ($rows_exams > 0) {
        while ($row = $rec_exams->fetch_assoc()) {
            $res .='"exams":"' . $row["exams"] . '",';
          //  $res.="exams:'".$row['exams']."',";
        }
    }
     $rec_sub = $conn->query($sub_query);
     $rows_sub = $rec_sub ->num_rows;
    if ($rows_sub > 0) {
        
        while ($row = $rec_sub->fetch_assoc()) {
             $res .='"subjects":"' . $row["subjects"] . '",';
           //  $res.="subjects:'".$row['subjects']."',";
        }
    }
    $res .= '"status":"success"';
    $res.='}';
    echo $res;
    break;

}
?>
