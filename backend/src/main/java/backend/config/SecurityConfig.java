package backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;


    public SecurityConfig(
            JwtAuthFilter jwtAuthFilter
    ) {

        this.jwtAuthFilter =
                jwtAuthFilter;

    }


    @Bean
    public PasswordEncoder passwordEncoder() {

        return new BCryptPasswordEncoder();

    }


    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    )
            throws Exception {

        http

                .csrf(
                        csrf ->
                                csrf.disable()
                )

                .sessionManagement(
                        session ->
                                session.sessionCreationPolicy(
                                        SessionCreationPolicy.STATELESS
                                )
                )

                /*
                 * JWT is now recognized and authenticated.
                 *
                 * Existing API routes remain permitAll in this
                 * foundation step so the current frontend does
                 * not break before all protected requests are
                 * migrated to Authorization: Bearer <token>.
                 */
                .authorizeHttpRequests(
                        auth ->
                                auth.anyRequest()
                                        .permitAll()
                )

                .httpBasic(
                        httpBasic ->
                                httpBasic.disable()
                )

                .formLogin(
                        formLogin ->
                                formLogin.disable()
                )

                .addFilterBefore(
                        jwtAuthFilter,
                        UsernamePasswordAuthenticationFilter.class
                );


        return http.build();

    }

}
