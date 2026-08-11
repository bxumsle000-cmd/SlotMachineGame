package com.poz.SlotMachine.repository;

import com.poz.SlotMachine.constant.BetConfig;
import com.poz.SlotMachine.model.MemberWallet;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

import java.util.Optional;
@Repository
public class MemberWalletRepository {
    private final JdbcClient jdbcClient;

    public MemberWalletRepository(JdbcClient jdbcClient) {
        this.jdbcClient = jdbcClient;
    }

    public Optional<MemberWallet> getMemberWallet(int member_id){
        return jdbcClient
                .sql("""
                        SELECT *
                        FROM member_wallet
                        WHERE member_id = :member_id
                        """)
                .param("member_id",member_id)
                .query(MemberWallet.class)
                .optional();
    }

    public void balanceChange(int member_id,int amount){
        jdbcClient
                .sql("""
                        UPDATE member_wallet
                        SET balance += :amount,
                            updated_at = SYSDATETIME()
                        WHERE member_id= :member_id
                        """)
                .param("member_id",member_id)
                .param("amount",amount)
                .update();
    }

    public void createWallet(int member_id,int balance){
        jdbcClient
                .sql("""
                        INSERT INTO member_wallet(member_id,balance,updated_at) VALUES(:member_id,:balance,SYSDATETIME())                       
                        """)
                .param("member_id",member_id)
                .param("balance",balance)
                .update();
    }

}
