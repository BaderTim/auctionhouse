package com.baderundletters.auktionshaus.backendjavaserver.email;

import com.baderundletters.auktionshaus.backendjavaserver.error.InvalidArgumentsException;

import javax.mail.*;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;
import java.util.Properties;

public class EmailHandler {

    public static Session session;

    public static void initialize() {
        Properties prop = new Properties();
        prop.put("mail.smtp.auth", "true");
        prop.put("mail.smtp.starttls.enable", "true");
        prop.put("mail.smtp.host", "smtp.ionos.de");
        prop.put("mail.smtp.port", "587");
        prop.put("mail.smtp.ssl.trust", "smtp.ionos.de");
        session = Session.getInstance(prop, new Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication("info@dw-auction.com", "");
            }
        });
        System.out.println("[INITIALIZER] Logged into SMTP Email Client.");
    }

    public static void send_email(String target_email, String subject, String text) {
        try {
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress("info@dw-auction.com", "dw-auction"));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(target_email));
            message.setSubject(subject);

            MimeBodyPart mimeBodyPart = new MimeBodyPart();
            mimeBodyPart.setContent(text, "text/html");

            Multipart multipart = new MimeMultipart();
            multipart.addBodyPart(mimeBodyPart);

            message.setContent(multipart);

            Transport.send(message);
        } catch (Exception x) {
            x.printStackTrace();
            throw new InvalidArgumentsException("Mailserver error.");
        }
    }

}
