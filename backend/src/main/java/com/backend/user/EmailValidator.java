package com.backend.user;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class EmailValidator {

    private static final String EMAIL_REGEX = "^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{1,7}$";
    //        check if email like: letters&numbers @ 1 to 7 extentions (gmail.com = 2)
    private static final Pattern pattern = Pattern.compile(EMAIL_REGEX);

    private static boolean isValidEmail(String email) {
        Matcher matcher = pattern.matcher(email);
        return matcher.matches();
    }

    public static void validate(String email) {
        if (!isValidEmail(email)) {
            throw new IllegalArgumentException("Email must be like: letters&numbers @ 1 to 7 domains");
        }
    }
}
