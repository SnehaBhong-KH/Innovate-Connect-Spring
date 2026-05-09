package com.innovateconnect.api.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendEmail(String to, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("innovateconnect02@gmail.com");
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send email to " + to + ": " + e.getMessage());
        }
    }

   public void sendRegistrationEmail(String to, String name, String role) {
    String subject = "Welcome to InnovateConnect!";

    String body = String.format(
        "Dear %s,\n\n" +
        "We are excited to welcome you to InnovateConnect!\n\n" +
        "Congratulations! Your registration as a %s has been completed successfully. "
        + "You are now officially part of a growing community where innovative ideas meet "
        + "real-world opportunities.\n\n" +
        "With your InnovateConnect account, you can:\n" +
        "- Explore exciting projects and challenges\n" +
        "- Collaborate with students, companies, and professionals\n" +
        "- Share ideas, gain experience, and build impactful solutions\n\n" +
        "To get started, simply log in to your account using your registered email address. "
        + "We recommend completing your profile to get personalized recommendations and make "
        + "the most out of the platform.\n\n" +
        "If you have any questions or need assistance, our support team is always here to help.\n\n" +
        "Thank you for choosing InnovateConnect. We’re thrilled to have you on board and look "
        + "forward to seeing the amazing contributions you’ll make.\n\n" +
        "Warm regards,\n" +
        "The InnovateConnect Team\n\n" +
        "Empowering Innovation. Connecting Opportunities.",
        name, role
    );

    sendEmail(to, subject, body);
}
}
