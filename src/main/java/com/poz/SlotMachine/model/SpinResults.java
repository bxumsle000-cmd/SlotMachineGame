package com.poz.SlotMachine.model;

import java.util.List;

/**
 * @param totalMultiplier
 * @param gird
 * @param winPayable
 */
public record SpinResults(
        int totalMultiplier , List<List<String>> gird , List<Paytable> winPayable
) {
}
