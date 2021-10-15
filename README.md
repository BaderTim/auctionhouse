# auctionhouse 
This auctionhouse project is a fullstack web application that was developed by a fellow student of mine and myself for a friend in late 2020. It is about ancient pictures from the (early) 20th century.   
Sadly the project came to nothing since our friend decided he did not want to host an auctionhouse anymore after some time - so we had to cancel it.  
  
This repository contains everything my fellow student and me achieved so far. In retrospective we were close to finishing the project, but still had some major items on our TODO list like reworking the security system, adding SSL to our database and fixing some design issues. For the developing process we have used Azure DevOps.

## Getting Started
- Setup MySQL database [here](https://github.com/BaderTim/auctionhouse/tree/main/database-mysql)
- Setup Java SpringBoot backend [here](https://github.com/BaderTim/auctionhouse/tree/main/backend-springboot)
- Setup React frontend [here](https://github.com/BaderTim/auctionhouse/tree/main/frontend-react)
- Login with demo seller-account: 
    - E-Mail: `test123@account.de`
    - Password: `test`

## About
Here are some images and additional information of the auctionhouse application.  
  
The auctionhouse seperates users into four different groups: **Visitor, User, Seller & Admin**. Each group has different permissions:
- Visitor: can just watch auctions and their content, but cannot see images or bet on anything
- User: can bet on auctions and also sees their images
- Seller: can bet on auctions, sees images and can create auctions
- Admin: can do all of the above plus moderating operations like *ban*
### Title screen
This is what you would see if you were logged in as a user. Currently there is just one auction live.
  
![title screen](https://github.com/BaderTim/auctionhouse/blob/main/images/title%20screen.JPG?raw=true)

### Title screen (not logged in)
This is what a visitor would see if he filtered for auctions which are already done.  


