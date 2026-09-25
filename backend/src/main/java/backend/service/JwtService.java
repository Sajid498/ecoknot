package backend.service;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import backend.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    private final SecretKey signingKey;

    private final long expirationMs;


    public JwtService(
            @Value("${jwt.secret}")
            String secret,

            @Value("${jwt.expiration-ms}")
            long expirationMs
    ) {

        this.signingKey =
                Keys.hmacShaKeyFor(
                        secret.getBytes(
                                StandardCharsets.UTF_8
                        )
                );

        this.expirationMs =
                expirationMs;

    }


    public String generateToken(
            User user
    ) {

        Date now =
                new Date();

        Date expiry =
                new Date(
                        now.getTime()
                        +
                        expirationMs
                );


        return Jwts.builder()

                .subject(
                        user.getEmail()
                )

                .claim(
                        "userId",
                        user.getId()
                )

                .claim(
                        "role",
                        user.getRole()
                )

                .issuedAt(
                        now
                )

                .expiration(
                        expiry
                )

                .signWith(
                        signingKey
                )

                .compact();

    }


    public String extractEmail(
            String token
    ) {

        return getClaims(
                token
        ).getSubject();

    }


    public Long extractUserId(
            String token
    ) {

        Number userId =
                getClaims(
                        token
                ).get(
                        "userId",
                        Number.class
                );


        if(userId == null){

            return null;

        }


        return userId.longValue();

    }


    public String extractRole(
            String token
    ) {

        return getClaims(
                token
        ).get(
                "role",
                String.class
        );

    }


    public boolean isTokenValid(
            String token
    ) {

        try {

            Claims claims =
                    getClaims(
                            token
                    );


            return claims.getExpiration()
                    .after(
                            new Date()
                    );

        }
        catch(Exception exception){

            return false;

        }

    }


    private Claims getClaims(
            String token
    ) {

        return Jwts.parser()

                .verifyWith(
                        signingKey
                )

                .build()

                .parseSignedClaims(
                        token
                )

                .getPayload();

    }

}
