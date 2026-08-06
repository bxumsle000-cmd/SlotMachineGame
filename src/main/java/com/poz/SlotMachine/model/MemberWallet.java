package com.poz.SlotMachine.model;

/**
 *
 * @param member_id
 * @param balance
 * @param updated_at
 */
public record MemberWallet(
        int member_id,
        int balance,
        String updated_at
) {
}
