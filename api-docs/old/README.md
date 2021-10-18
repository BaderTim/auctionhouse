# API Diagramm
![auktionshaus api diagramm.png](https://github.com/BaderTim/auctionhouse/blob/main/api-docs/old/api_diagram_old.png?raw=true)

# API Beschreibung
<br>

`/` - GET
	• unix_server_time

`/login` - POST
	• email, password
	• session_key

<br>

`/report` - POST
	• session_key, problem, descripton
	• 200

<br>

`/account/user/register` - POST
	• email, password, first_name, last_name, phone_number, birth_date, house_number, street_name, adress_addition, postal_code, city, country, passport
	• session_key 

`/account/user` - POST
	• session_key
	• user_id, email, password, first_name, last_name, phone_number, birth_date, house_number, street_name, adress_addition, postal_code, city, country, passport, profile_pictute, unix_creation_time

`/account/user/id` - POST
	• user_id, _session_key_
	• first_name, last_name, profile_pictute, country, is_admin, unix_creation_time

`/account/user/edit` - POST
	• session_key, _first_name, last_name, phone_number, birth_date, house_number, street_name, adress_addition, postal_code, city, country, passport, profile_pictute, description
	• 200_

`/account/user/change_password` - POST
	• session_key, old_password, new_password
	• new_session_key

`/account/user/delete` - POST
	• session_key, password
	• 200

<br>

`/account/seller/register` - POST
	• session_key, bank_account, bank_account_first_name, bank_account_last_name
	• 200

`/account/seller` - POST
	• session_key 
	• seller_id, bank_account, bank_account_first_name, bank_account_last_name, debt

`/account/seller/edit` - POST
	• session_key, _bank_account, bank_account_first_name, bank_account_last_name_
	• 200

`/account/seller/delete` - POST
	• session_key, password
	• 200

<br>

`/account/admin/ban` - POST
	• session_key, user_id
	• 200

`/account/admin/end_auction` - POST
	• session_key, auction_id
	• 200

`/account/admin/send_email` - POST
	• session_key, email, title, content
	• 200

`/account/admin/view_report` - POST
	• session_key, _filter, id_
	• [user_id, reason, details, image], …


`/account/follow` - POST
	• session_key, to_follow_user_id
	• 200

`/account/follow/unfollow` - POST
	• session_key, to_follow_user_id
	• 200

`/account/follow/get_follower` - POST
	• session_key, _filter_
	• [user_id, first_name, last_name, profile_picture, country, is_admin], …

`/account/follow/is_following_me` - POST
	• session_key, user_id
	• is_following_me
  
<br>
<br>

`/auction/start` - POST
	• session_key, title, description, amount,  type, auction_type, starting_price, unix_starting_time, [image1, image2, …]
	• auction_id

`/auction` - POST
	• _session_key, filter_
	• [auction_id, title, description, amount,  auction_type, starting_price, unix_starting_time, current_price, bank_transfer, paypal, cash, international, thumbnail], …

`/auction/id` - POST
	• auction_id, _session_key_
	• title, description, amount,  type, auction_type, starting_price, unix_starting_time, current_price, bank_transfer, paypal, cash, international, [image1, image2, …]

`/auction/bet` - POST
	• session_key, auction_id, amount
	• 200

`/auction/suggest` - POST
	• session_key, auction_id, amount, _message_
	• [author_user_id, message, unix_time], …

`/auction/end` - POST
	• session_key, auction_id
	• 200

<br>
<br>

`/rating/new` - POST
	• session_key, user_id, rating, comment
	• rating_id

`/rating/id` - POST
	• rating_id, _session_key_
	• creator_user_id, rating, comment, unix_time

`/rating` - POST
	• session_key, user_id
	• [rating_id, creator_user_id, rating, comment, unix_time], …

`/rating/from_user` - POST
	• creator_user_id, _session_key_
	• [rating_id, user_id, rating, comment, unix_time], …

<br>
<br>

`/chat` - POST
	• session_key, partner_user_id, unix_until_time
	• [author_user_id, message, unix_time], …

`/chat/send` - POST
	• session_key, partner_user_id, message
	• 200

<br>
<br>

`/statistic/get_all_users` - POST
	• session_key
	• [user_id, first_name, last_name, email, unix_time], …

`/statistic/get_all_auctions` - POST
	• session_key
	• [auction_id, title, description, amount,  auction_type, starting_price, unix_starting_time, current_price, bank_transfer, paypal, cash, international], …

`/statistic/total_users` - POST
	• session_key
	• total_user_count

`/statistic/total_profile_views` - POST
	• session_key
	• total_profile_view_count

`/statistic/total_auctions` - POST
	• session_key
	• total_auction_count

`/statistic/total_bets` - POST
	• session_key
	• total_bet_count

