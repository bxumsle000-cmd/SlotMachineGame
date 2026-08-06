package com.poz.SlotMachine.repository;

import com.poz.SlotMachine.model.MemberWallet;
import com.poz.SlotMachine.model.Menbers;
import com.poz.SlotMachine.model.SpinHistory;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;

import java.util.Optional;
@Service
public class SpinHistoryRepository {
    private final JdbcClient jdbcClient;

    public SpinHistoryRepository(JdbcClient jdbcClient) {
        this.jdbcClient = jdbcClient;
    }

    public Optional<SpinHistory> getSpinHistory(int member_id) {
        return jdbcClient
                .sql("""
                        SELECT *
                        FROM spin_history
                        WHERE member_id = :member_id
                        """)
                .param("member_id", member_id)
                .query(SpinHistory.class)
                .optional();
    }

    public void insertNewHistory(int memberId, int betAmount, int winAmount,
                       int InitialBalance, int finalBalance, int totalMultiplier) {
        jdbcClient
                .sql("""
                        INSERT INTO dbo.spin_history
                            (member_id, bet_amount, win_amount,
                             InitialBalance, finalBalance, total_multiplier)
                        VALUES
                            (:memberId, :betAmount, :winAmount,
                             :InitialBalance, :finalBalance, :totalMultiplier)
                        """)
                .param("memberId", memberId)
                .param("betAmount", betAmount)
                .param("winAmount", winAmount)
                .param("InitialBalance", InitialBalance)
                .param("finalBalance", finalBalance)
                .param("totalMultiplier", totalMultiplier)
                .update();
    }
}

