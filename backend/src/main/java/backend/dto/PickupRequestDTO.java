package backend.dto;


import java.time.LocalDateTime;

import backend.entity.PickupStatus;



public class PickupRequestDTO {




    private Long id;


    private PickupStatus status;


    private LocalDateTime requestedAt;


    private LocalDateTime approvedAt;


    private LocalDateTime completedAt;



    private VolunteerDTO volunteer;


    private RescueInfoDTO rescueDonation;








    public PickupRequestDTO(){



    }








    public PickupRequestDTO(

            Long id,

            PickupStatus status,

            LocalDateTime requestedAt,

            LocalDateTime approvedAt,

            LocalDateTime completedAt,

            VolunteerDTO volunteer,

            RescueInfoDTO rescueDonation

    ){


        this.id = id;

        this.status = status;

        this.requestedAt = requestedAt;

        this.approvedAt = approvedAt;

        this.completedAt = completedAt;

        this.volunteer = volunteer;

        this.rescueDonation = rescueDonation;


    }









    public Long getId(){


        return id;


    }






    public PickupStatus getStatus(){


        return status;


    }






    public LocalDateTime getRequestedAt(){


        return requestedAt;


    }






    public LocalDateTime getApprovedAt(){


        return approvedAt;


    }






    public LocalDateTime getCompletedAt(){


        return completedAt;


    }






    public VolunteerDTO getVolunteer(){


        return volunteer;


    }






    public RescueInfoDTO getRescueDonation(){


        return rescueDonation;


    }









    public static class VolunteerDTO {



        private Long id;


        private String name;


        private String email;


        private String location;








        public VolunteerDTO(

                Long id,

                String name,

                String email,

                String location

        ){


            this.id = id;

            this.name = name;

            this.email = email;

            this.location = location;


        }








        public Long getId(){


            return id;


        }







        public String getName(){


            return name;


        }







        public String getEmail(){


            return email;


        }







        public String getLocation(){


            return location;


        }


    }









    public static class RescueInfoDTO {



        private Long id;


        private String title;


        private String type;


        private Integer quantity;


        private String location;








        public RescueInfoDTO(

                Long id,

                String title,

                String type,

                Integer quantity,

                String location

        ){


            this.id = id;

            this.title = title;

            this.type = type;

            this.quantity = quantity;

            this.location = location;


        }








        public Long getId(){


            return id;


        }







        public String getTitle(){


            return title;


        }







        public String getType(){


            return type;


        }







        public Integer getQuantity(){


            return quantity;


        }







        public String getLocation(){


            return location;


        }


    }




}