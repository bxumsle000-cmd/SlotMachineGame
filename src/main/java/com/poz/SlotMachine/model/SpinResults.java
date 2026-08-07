package com.poz.SlotMachine.model;

import java.util.List;

/**
 * @param totalMultiplier
 * @param grid
 * @param winPayable
 */
public record SpinResults(
        int totalMultiplier , List<List<String>> grid , List<Paytable> winPayable
) {
}
