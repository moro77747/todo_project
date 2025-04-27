package com.todoApp.jwt;

import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.interfaces.RSAPublicKey;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.security.oauth2.server.resource.web.BearerTokenAuthenticationEntryPoint;
import org.springframework.security.oauth2.server.resource.web.access.BearerTokenAccessDeniedHandler;
import org.springframework.security.web.SecurityFilterChain;

import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jose.jwk.source.JWKSource;
import com.nimbusds.jose.proc.SecurityContext;
import org.springframework.stereotype.Component;
import org.springframework.web.cors.CorsConfiguration;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class JwtSecurityConfig {


    @Autowired
    private UserDetailsServiceImpl userDetailsServiceImpl;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        return httpSecurity.cors(httpSecurityCorsConfigurer -> httpSecurityCorsConfigurer.configurationSource(request -> {
            CorsConfiguration configuration = new CorsConfiguration();
            configuration.addAllowedMethod("*");
            configuration.addAllowedHeader("Content-Type");
            configuration.addAllowedOrigin("*");
            configuration.addAllowedOriginPattern("/**");

            return configuration;}))
                .csrf(AbstractHttpConfigurer::disable)// (1)
                .sessionManagement(
                        session -> 
                            session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS)) // (2)
                .authorizeHttpRequests(
                        auth -> 
                            auth.requestMatchers("/", //#CHANGE
                            		"/authenticate", "/actuator", "/actuator/*")
                                .permitAll()
                                .requestMatchers("/h2-console/**")
                                .permitAll()
                                    .requestMatchers("swagger-ui/**").permitAll()
                                    .requestMatchers("v3/api-docs/**").permitAll()
                                    .requestMatchers(HttpMethod.OPTIONS,"/**")
                                    .permitAll()
                                    .requestMatchers("/users").permitAll()
                                .anyRequest()
                                .authenticated()) // (3)
                .oauth2ResourceServer(oauth2 -> oauth2.jwt(withDefaults())) // (4)
                .exceptionHandling(
                        (ex) -> 
                            ex.authenticationEntryPoint(
                                new BearerTokenAuthenticationEntryPoint())
                              .accessDeniedHandler(
                                new BearerTokenAccessDeniedHandler()))
                .httpBasic(
                        withDefaults()) // (5)
                .headers(header -> header.frameOptions(frameOptionsConfig -> frameOptionsConfig.sameOrigin()))
                .build();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            UserDetailsService userDetailsServiceImpl) {
        var authenticationProvider = new DaoAuthenticationProvider();
        authenticationProvider.setUserDetailsService(userDetailsServiceImpl);
        authenticationProvider.setPasswordEncoder(passwordEncoder());
        return new ProviderManager(authenticationProvider);
    }


    @Bean
    public JwtEncoder jwtEncoder(JWKSource<SecurityContext> jwkSource) {
        return new NimbusJwtEncoder(jwkSource);
    }

    @Bean
    public KeyPair keyPair() {
        try {
            var keyPairGenerator = KeyPairGenerator.getInstance("RSA");
            keyPairGenerator.initialize(2048);
            return keyPairGenerator.generateKeyPair();
        } catch (Exception ex) {
            throw new RuntimeException(ex);
        }
    }

    @Bean
    public RSAKey rsaKey(KeyPair keyPair) {

        return new RSAKey
                .Builder((RSAPublicKey)keyPair.getPublic())
                .privateKey(keyPair.getPrivate())
                .keyID(UUID.randomUUID().toString())
                .build();
    }

    @Bean
    public JWKSource<SecurityContext> jwkSource(RSAKey rsaKey) {
        var jwkSet = new JWKSet(rsaKey);

        return (jwkSelector, context) ->  jwkSelector.select(jwkSet);

    }

    @Bean
    public JwtDecoder jwtDecoder(RSAKey rsaKey) throws JOSEException {
        return NimbusJwtDecoder
                .withPublicKey(rsaKey.toRSAPublicKey())
                .build();

    }



    @Bean
    public PasswordEncoder passwordEncoder()
    {
        return new BCryptPasswordEncoder();
    }
    
}


