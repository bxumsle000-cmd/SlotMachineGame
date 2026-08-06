package com.poz.SlotMachine.repository;

import com.poz.SlotMachine.model.MemberWallet;
import com.poz.SlotMachine.model.Menbers;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;

import java.util.Optional;
@Service
public class MemberWalletRepository {
    private final JdbcClient jdbcClient;

    public MemberWalletRepository(JdbcClient jdbcClient) {
        this.jdbcClient = jdbcClient;
    }

    public Optional<MemberWallet> getMenberWallet(int member_id){
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

    public void balanceChange(int menber_id,int newBalance){
        jdbcClient
                .sql("""
                        UPDATE member_wallet
                        SET balance += :newBalance:
                            updated_at = SYSDATETIME()
                        WHERE menber_id= :menber_id
                        """)
                .param("menber_id",menber_id)
                .param("newBalance",newBalance)
                .update();
    }

}
