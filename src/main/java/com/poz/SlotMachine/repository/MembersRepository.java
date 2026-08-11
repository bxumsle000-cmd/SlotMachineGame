package com.poz.SlotMachine.repository;

import com.poz.SlotMachine.model.Members;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

import java.util.Optional;
@Repository
public class MembersRepository {
    private final JdbcClient jdbcClient;

    public MembersRepository(JdbcClient jdbcClient) {
        this.jdbcClient = jdbcClient;
    }

    /**
     * 密碼改存 BCrypt 雜湊後，SQL 不能再拿密碼當查詢條件
     * （同一組密碼每次雜湊結果都不同，字串永遠不會相等）。
     * 登入請一律用這個方法只查帳號，再由 LoginService 用
     * passwordEncoder.matches() 比對密碼。
     */
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
