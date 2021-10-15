package com.baderundletters.auktionshaus.backendjavaserver;

import com.baderundletters.auktionshaus.backendjavaserver.payment.PaymentRollout;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.text.SimpleDateFormat;
import java.util.Date;

@Component
public class Scheduler {

    //
    //  Generate cron timestamps here: http://www.cronmaker.com/
    //

    // @Scheduled(cron = "0 * * 1-4 1/1 *")
    @Scheduled(cron = "0 0 9 1 1/1 *") // first day of month at 9 am 0 0 9 1 1/1 *
    public void cronJobSch() {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
        System.out.println("Starting last day of month schedule @ " + sdf.format(new Date()));
        PaymentRollout paymentRollout = new PaymentRollout();
        paymentRollout.start();
    }
}
