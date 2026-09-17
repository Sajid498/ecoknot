package backend.exception;


import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;



@RestControllerAdvice
public class GlobalExceptionHandler {



    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<?> handleRuntimeException(
            RuntimeException exception
    ){


        ErrorResponse error = new ErrorResponse(

                exception.getMessage(),

                LocalDateTime.now()

        );


        return new ResponseEntity<>(

                error,

                HttpStatus.BAD_REQUEST

        );


    }







    static class ErrorResponse {


        private String message;

        private LocalDateTime timestamp;




        public ErrorResponse(
                String message,
                LocalDateTime timestamp
        ){

            this.message = message;

            this.timestamp = timestamp;

        }





        public String getMessage(){

            return message;

        }




        public LocalDateTime getTimestamp(){

            return timestamp;

        }


    }


}