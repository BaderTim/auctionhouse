# auctionhouse 
This auctionhouse project is a fullstack web application that was developed by a fellow student of mine and myself for a friend in late 2020. It is about ancient pictures from the (early) 20th century.   
Sadly the project came to nothing since our friend decided he did not want to host an auctionhouse anymore after some time - so we had to cancel it.  
  
This repository contains everything my fellow student and me achieved so far. In retrospective we were close to finishing the project, but still had some major items on our TODO list like reworking the security system, adding SSL to our database and fixing some design issues. I worked on both the backend and the frontend, while my partner was in contact with the stakeholders and also helped develop the frontend. We used Azure DevOps for the development.

## Getting Started
- Setup the MySQL database [here](https://github.com/BaderTim/auctionhouse/tree/main/database-mysql)
- Setup the Java SpringBoot backend [here](https://github.com/BaderTim/auctionhouse/tree/main/backend-springboot)
- Setup the React frontend [here](https://github.com/BaderTim/auctionhouse/tree/main/frontend-react)
- Login with demo seller-account: 
    - E-Mail: `test123@account.de`
    - Password: `test`

# Preview & Additional Information
Here are some images and additional information of the auctionhouse application. Some images are zoomed out/in.  
  
The auctionhouse seperates users into four different groups: **Visitor, User, Seller & Admin**.  
Each group has different permissions:
- Visitor: can just watch auctions and their content, but cannot see images or bet on anything
- User: can bet on auctions and also sees their images
- Seller: can bet on auctions, sees images and can create auctions
- Admin: can do all of the above plus moderating operations like *ban*

## Title Screen
This is what you would see if you were logged in as a user. Currently there is just one auction live. The auctions on the title screen aren't static - there are three different categories that would get shown: **New, Hot & Featured**. The card positioning is done by using Bootstrap's responsive grid system.
  
![title screen_user](https://github.com/BaderTim/auctionhouse/blob/main/images/title%20screen.JPG?raw=true)
  
  
## Title Screen (Not Logged in)
This is what a visitor would see if he filtered for all auctions that are already over. There are many different filter and sorting options, reaching from location to certain dates and auction types.  
  
![title screen_visitor](https://github.com/BaderTim/auctionhouse/blob/main/images/all-auctions.JPG?raw=true)
  
  
## User Navigation
Users can use different features. They can maintain a profile, add auctions to their watchlist, check how their current bets are going, check their bet-history and register as a seller.  
  
![user_navigation](https://github.com/BaderTim/auctionhouse/blob/main/images/user-navigation.JPG?raw=true)
  
  
## Seller Account
As a seller your profile differs from the user one. Other users and sellers can see the auctions you are doing on your profile and can also rate and report it
  
![seller_account](https://github.com/BaderTim/auctionhouse/blob/main/images/my%20page.JPG?raw=true)
  
If you create an auction you have to pay a small fee. Thats the business principle of this auctionhouse. If you want to add more than 4 images to your auction, you also have to pay extra fees. All costs incurred are stored and debited at the end of each month.  
Each seller has to register a credit card in order to create auctions. The seller can manage his credit cards and billing information on his seller account page. The payments are being processed by [Stripe](https://stripe.com/).
  
![seller_account_billing](https://github.com/BaderTim/auctionhouse/blob/main/images/seller-account-overview.JPG?raw=true)
  
  
## Creating an Auction
Creating an Auction requires some basic information about the item. You can choose between a lot of options, including the payment methods. The auctionhouse does not manage the payments of the auction items - buyer and seller have to do this on their own. After an auction has ended, a chat room between buyer and seller will be created.
  
![creating_an_auction](https://github.com/BaderTim/auctionhouse/blob/main/images/create-auction-full.JPG?raw=true)
  
After successfully creating a new auction, other users and sellers can bet on it as soon as it goes live. You can adjust the auction timing during the creation process. After the auction is live you cannot edit it anymore.  
  
![creating_an_auction](https://github.com/BaderTim/auctionhouse/blob/main/images/auction.JPG?raw=true)
