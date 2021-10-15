import React from "react";
import {Route, Switch} from "react-router-dom";
import Home from "../page/Home";
import About from "../page/About";
import Contact from "../page/Contact";
import Imprint from "../page/Imprint";
import Conditions from "../page/Conditions";
import Profile from "../page/profile/Profile";
import BetHistory from "../page/profile/history/BetHistory";
import SellerRegistration from "../page/profile/SellerRegistration";
import Chat from "../page/profile/Chat";
import NotFound from "../page/NotFound";
import All from "../page/auction/All";
import WW1 from "../page/auction/WW1";
import WW2 from "../page/auction/WW2";
import PrivateChat from "../page/profile/PrivateChat";
import AuctionHistory from "../page/profile/history/AuctionHistory";
import History from "../page/profile/history/History";
import MyPage from "../page/profile/MyPage";
import CreateAuction from "../page/auction/CreateAuction";
import Auction from "../page/auction/Auction";
import Registration from "../page/profile/Registration";

import Statistics from "../page/Admin/statistics";
import UserOverview from "../page/Admin/useroverview";

import CurrentBets from "../page/CurrentBets";
import Watchlist from "../page/profile/Watchlist";
import RatingPage from "../page/profile/RatingPage";
import Other from "../page/auction/Other";
import PhotoAlbum from "../page/auction/PhotoAlbum";
import SellerAccount from "../page/profile/SellerAccount";


export default class Main extends React.Component {

    render() {
        return(
            <Switch>
                <Route exact path='/' render={() => <Home add_alert={this.props.add_alert} session={this.props.session}/>}/>

                <Route path="/registration" render={() => <Registration session={this.props.session} />}/>

                <Route exact path='/profile' render={() => <Profile session={this.props.session}/>}/>
                <Route exact path='/profile/chat' render={() => <Chat add_alert={this.props.add_alert} session={this.props.session}/>}/>
                <Route exact path='/profile/seller-account' render={() => <SellerAccount add_alert={this.props.add_alert}  session={this.props.session}/>}/>
                <Route exact path='/profile/seller-registration' render={() => <SellerRegistration add_alert={this.props.add_alert} session={this.props.session}/>}/>
                <Route exact path='/profile/seller-registration/:success' render={() => <SellerRegistration add_alert={this.props.add_alert} session={this.props.session}/>}/>
                <Route exact path='/profile/seller-registration/:success/:stripe_session' render={() => <SellerRegistration overwrite_session={this.props.overwrite_session} add_alert={this.props.add_alert} session={this.props.session}/>}/>

                <Route exact path='/profile/id/:profile_id/ratings' render={() => <RatingPage add_alert={this.props.add_alert} session={this.props.session}/>}/>

                <Route exact path='/seller/:user_name' render={() => <MyPage session={this.props.session}/>}/>
                <Route exact path='/seller/id/:profile_id' render={() => <MyPage add_alert={this.props.add_alert} session={this.props.session}/>}/>

                <Route exact path='/profile/current-bets' render={() => <CurrentBets add_alert={this.props.add_alert} session={this.props.session}/>}/>
                <Route exact path='/profile/watchlist' render={() => <Watchlist add_alert={this.props.add_alert} session={this.props.session}/>}/>

                <Route exact path='/profile/history' render={() => <History add_alert={this.props.add_alert} session={this.props.session}/>}/>
                <Route exact path='/profile/history/bets' render={() => <BetHistory session={this.props.session}/>}/>
                <Route exact path='/profile/history/auctions' render={() => <AuctionHistory session={this.props.session}/>}/>

                <Route exact path='/all' render={() => <All add_alert={this.props.add_alert} session={this.props.session}/>}/>
                <Route exact path='/ww1' render={() => <WW1 add_alert={this.props.add_alert} session={this.props.session}/>}/>
                <Route exact path='/ww2' render={() => <WW2 add_alert={this.props.add_alert} session={this.props.session}/>}/>
                <Route exact path='/other' render={() => <Other add_alert={this.props.add_alert} session={this.props.session}/>}/>
                <Route exact path='/photo-albums' render={() => <PhotoAlbum add_alert={this.props.add_alert} session={this.props.session}/>}/>
                <Route exact path='/create-auction' render={() => <CreateAuction add_alert={this.props.add_alert} session={this.props.session}/>}/>

                <Route exact path='/about' render={() => <About session={this.props.session}/>}/>
                <Route exact path='/contact' render={() => <Contact session={this.props.session}/>}/>
                <Route exact path='/imprint' render={() => <Imprint session={this.props.session}/>}/>
                <Route exact path='/conditions' render={() => <Conditions session={this.props.session}/>}/>

                <Route path={"/profile/chat/:chat_id"} render={() => <PrivateChat add_alert={this.props.add_alert} session={this.props.session}/>}/>
                <Route path="/auction/id/:auctionid" render={() => <Auction session={this.props.session} />}/>

                <Route exact path='/statistics' render={() => <Statistics session={this.props.session}/>}/>
                <Route exact path='/statistics/allusers' render={() => <UserOverview session={this.props.session}/>}/>
                <Route path="/" render={() => <NotFound/>}/>
            </Switch>
        )
    }
}