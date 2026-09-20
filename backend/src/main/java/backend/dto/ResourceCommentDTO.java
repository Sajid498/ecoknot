package backend.dto;


import java.time.LocalDateTime;



public class ResourceCommentDTO {



    private Long id;


    private String content;


    private String userName;


    private Long userId;


    private LocalDateTime createdAt;







    public ResourceCommentDTO(

            Long id,

            String content,

            String userName,

            Long userId,

            LocalDateTime createdAt

    ){


        this.id = id;

        this.content = content;

        this.userName = userName;

        this.userId = userId;

        this.createdAt = createdAt;


    }








    public Long getId(){

        return id;

    }






    public String getContent(){

        return content;

    }







    public String getUserName(){

        return userName;

    }







    public Long getUserId(){

        return userId;

    }







    public LocalDateTime getCreatedAt(){

        return createdAt;

    }


}