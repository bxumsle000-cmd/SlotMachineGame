package com.poz.SlotMachine.repository;

import com.poz.SlotMachine.model.Menbers;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;

import java.util.Optional;
@Service
public class MembersRepository {
    private final JdbcClient jdbcClient;

    public MembersRepository(JdbcClient jdbcClient) {
        this.jdbcClient = jdbcClient;
    }

    public Optional<Menbers> getUserInfo(int id){
        return jdbcClient
                .sql("""
                        SELECT *
                        FROM members
                        WHERE id = :id
                        """)
                .param("id",id)
                .query(Menbers.class)
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
