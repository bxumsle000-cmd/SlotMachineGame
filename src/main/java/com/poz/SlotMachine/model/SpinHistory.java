package com.poz.SlotMachine.model;

/**
 *
 * @param id
 * @param member_id
 * @param bet_amount
 * @param win_amount
 * @param InitialBalance
 * @param finalBalance
 * @param total_multiplier
 * @param created_at
 */
public record SpinHistory(
        int id,
        int member_id,
        int bet_amount,
        int win_amount,
        int InitialBalance,
        int finalBalance,
        int total_multiplier,
        String created_at
) {
}
