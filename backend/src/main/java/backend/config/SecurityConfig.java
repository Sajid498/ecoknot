package backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
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

                .authorizeHttpRequests(
                        auth ->
                                auth

                                        // Allow browser preflight requests
                                        .requestMatchers(
                                                HttpMethod.OPTIONS,
                                                "/**"
                                        )
                                        .permitAll()

                                        // Public authentication endpoints
                                        .requestMatchers(
                                                HttpMethod.POST,
                                                "/api/users/signup",
                                                "/api/users/login"
                                        )
                                        .permitAll()

                                        // Public community browsing
                                        .requestMatchers(
                                                HttpMethod.GET,

                                                "/api/blood-requests",
                                                "/api/blood-requests/*",
                                                "/api/blood-requests/blood-group/*",

                                                "/api/rescues",
                                                "/api/rescues/*",

                                                "/api/resources",
                                                "/api/resources/*",
                                                "/api/resources/*/comments",

                                                "/api/funds",
                                                "/api/funds/*"
                                        )
                                        .permitAll()

                                        // Admin fundraising endpoints
                                        .requestMatchers(
                                                "/api/funds/admin/**"
                                        )
                                        .hasRole(
                                                "ADMIN"
                                        )

                                        // Everything else requires JWT
                                        .anyRequest()
                                        .authenticated()
                )

                .exceptionHandling(
                        exception ->
                                exception

                                        .authenticationEntryPoint(
                                                (
                                                        request,
                                                        response,
                                                        authException
                                                ) ->
                                                        response.sendError(
                                                                401,
                                                                "Authentication required"
                                                        )
                                        )

                                        .accessDeniedHandler(
                                                (
                                                        request,
                                                        response,
                                                        accessDeniedException
                                                ) ->
                                                        response.sendError(
                                                                403,
                                                                "Access denied"
                                                        )
                                        )
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