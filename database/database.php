<?php
  class DB{
      public function getConnection(){
         $host="localhost:3306";
         $uname="root";
         $pwd="root";
         $db="sms"; 
          // Create connection
            $conn = new mysqli($host,$uname,$pwd,$db);
            // Check connection
            if ($conn->connect_error) {
                die("Connection failed: " . $conn->connect_error);
            } 
            return $conn;
      }
  }
?>
