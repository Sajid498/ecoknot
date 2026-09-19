package backend.dto;


import java.time.LocalDateTime;



public class ResourceDTO {


    private Long id;


    private String content;


    private String imageUrl;


    private String userName;


    private Long userId;


    private int likes;


    private int shares;


    private LocalDateTime createdAt;





    public ResourceDTO(

            Long id,

            String content,

            String imageUrl,

            String userName,

            Long userId,

            int likes,

            int shares,

            LocalDateTime createdAt

    ){

        this.id = id;

        this.content = content;

        this.imageUrl = imageUrl;

        this.userName = userName;

        this.userId = userId;

        this.likes = likes;

        this.shares = shares;

        this.createdAt = createdAt;

    }





    public Long getId(){

        return id;

    }





    public String getContent(){

        return content;

    }





    public String getImageUrl(){

        return imageUrl;

    }





    public String getUserName(){

        return userName;

    }





    public Long getUserId(){

        return userId;

    }





    public int getLikes(){

        return likes;

    }





    public int getShares(){

        return shares;

    }





    public LocalDateTime getCreatedAt(){

        return createdAt;

    }


}