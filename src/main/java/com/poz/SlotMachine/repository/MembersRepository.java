package com.poz.SlotMachine.repository;

import com.poz.SlotMachine.model.Members;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;

import java.util.Optional;
@Service
public class MembersRepository {
    private final JdbcClient jdbcClient;

    public MembersRepository(JdbcClient jdbcClient) {
        this.jdbcClient = jdbcClient;
    }

    public Optional<Members> getUserInfo(String username,String password){
        return jdbcClient
                .sql("""
                        SELECT *
                        FROM members
                        WHERE username = :username  AND password =:password
                        """)
                .param("username",username)
                .param("password",password)
                .query(Members.class)
                .optional();
    }

    public Optional<Members> getUserInfoByName(String username){
        return jdbcClient
                .sql("""
                        SELECT *
                        FROM members
                        WHERE username = :username
                        """)
                .param("username",username)
                .query(Members.class)
                .optional();
    }


    public void registerNewUser(String username , String password){
        jdbcClient
                .sql("""
                        INSERT INTO members(username ,password,status) 
                        VALUES(:username , :password , 1)
                        """)
                .param("username", username)
                .param("password",password)
                .update();
    }
}
