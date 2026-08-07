package com.poz.SlotMachine.model;

import java.util.List;

/**
 *
 * @param winAmount
 * @param grid
 * @param winPayable
 */
public record SpinResponse(
        int winAmount, List<List<String>> grid , List<Paytable> winPayable
) {
}
